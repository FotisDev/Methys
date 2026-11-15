"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { toOrderLines } from "@/_lib/utils/stripeMetadata";
import type { ProductInDetails } from "@/_lib/types";
import { defaultLocale, isLocale } from "@/i18n.config";

// Signed-in customers' carts live in saved_carts too, so they follow them to
// other devices and /api/cron/notify can send one reminder if they leave.

const MAX_LINES = 50;

async function currentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function saveCart(items: unknown, locale: string) {
  const user = await currentUser();
  if (!user?.email) return;

  const lines = toOrderLines(items).slice(0, MAX_LINES);
  if (lines.length === 0) {
    await supabaseAdmin.from("saved_carts").delete().eq("user_id", user.id);
    return;
  }

  // Unchanged cart (e.g. a page load or token refresh): leave it alone, so
  // the reminder clock isn't reset and nobody gets a second reminder.
  const { data: existing } = await supabaseAdmin
    .from("saved_carts")
    .select("items")
    .eq("user_id", user.id)
    .maybeSingle();
  if (
    existing &&
    JSON.stringify(toOrderLines(existing.items)) === JSON.stringify(lines)
  ) {
    return;
  }

  const { error } = await supabaseAdmin.from("saved_carts").upsert({
    user_id: user.id,
    email: user.email,
    locale: isLocale(locale) ? locale : defaultLocale,
    items: lines,
    updated_at: new Date().toISOString(),
    // A changed cart earns a fresh reminder later.
    reminder_sent_at: null,
  });
  if (error) console.error("Saving cart failed:", error.message);
}

export type SavedCartItem = ProductInDetails & {
  selectedSize?: string;
  quantity: number;
};

// The saved cart rebuilt with current product data. Products that were
// removed, or sizes that no longer exist, are dropped.
export async function loadSavedCart(): Promise<SavedCartItem[]> {
  const user = await currentUser();
  if (!user) return [];

  const { data: saved } = await supabaseAdmin
    .from("saved_carts")
    .select("items")
    .eq("user_id", user.id)
    .maybeSingle();
  const lines = toOrderLines(saved?.items);
  if (lines.length === 0) return [];

  // The visitor's own session, so member-only offer products load too.
  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      `id,name,slug,price,description,size_description,product_details,image_url,is_offer,
      categoryformen:category_men_id!inner(id,name,slug,
      parent:parent_id!inner(id,name,slug)),
      product_variants(size,price,quantity)`,
    )
    .in(
      "id",
      lines.map((l) => l.id),
    )
    .overrideTypes<ProductInDetails[], { merge: false }>();

  const byId = new Map((products ?? []).map((p) => [p.id, p]));
  return lines.flatMap((line) => {
    const product = byId.get(line.id);
    if (!product) return [];
    if (
      line.size &&
      !product.product_variants.some((v) => v.size === line.size)
    ) {
      return [];
    }
    return [{ ...product, selectedSize: line.size, quantity: line.quantity }];
  });
}
