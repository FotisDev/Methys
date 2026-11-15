"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { defaultLocale, isLocale } from "@/i18n.config";

export type AlertFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  productId: z.coerce.number().int().positive(),
  size: z.string().trim().min(1).max(10),
});

// "Email me when it's back": one row per product + size + email. Nothing is
// sent now; /api/cron/notify sends a single email once stock returns.
export async function subscribeToStockAlert(
  _prev: AlertFormState,
  formData: FormData,
): Promise<AlertFormState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    productId: formData.get("productId"),
    size: formData.get("size"),
  });
  if (!parsed.success) {
    return { status: "error", message: "validation.emailInvalid" };
  }
  const { email, productId, size } = parsed.data;
  const rawLocale = String(formData.get("locale") ?? "");
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  // Only for sizes that exist and are actually sold out.
  const { data: variant } = await supabaseAdmin
    .from("product_variants")
    .select("quantity")
    .eq("product_id", productId)
    .eq("size", size)
    .maybeSingle();
  if (!variant) return { status: "error", message: "stockAlert.failed" };
  if (variant.quantity > 0) {
    return { status: "error", message: "stockAlert.inStockNow" };
  }

  // Re-subscribing after an earlier alert was sent starts a new wait.
  const { error } = await supabaseAdmin.from("stock_alerts").upsert(
    {
      product_id: productId,
      size,
      email,
      locale,
      notified_at: null,
      created_at: new Date().toISOString(),
    },
    { onConflict: "product_id,size,email" },
  );
  if (error) {
    console.error("Stock alert signup failed:", error.message);
    return { status: "error", message: "stockAlert.failed" };
  }

  return { status: "success", message: "stockAlert.success" };
}
