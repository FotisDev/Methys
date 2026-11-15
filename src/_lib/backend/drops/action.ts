"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { dropPhase } from "@/_lib/utils/content";
import type { AlertFormState } from "@/_lib/backend/stockAlerts/action";
import { defaultLocale, isLocale } from "@/i18n.config";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  dropId: z.coerce.number().int().positive(),
});

// "Tell me when it drops." /api/cron/notify emails everyone once it's live.
export async function subscribeToDrop(
  _prev: AlertFormState,
  formData: FormData,
): Promise<AlertFormState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    dropId: formData.get("dropId"),
  });
  if (!parsed.success) {
    return { status: "error", message: "validation.emailInvalid" };
  }
  const { email, dropId } = parsed.data;
  const rawLocale = String(formData.get("locale") ?? "");
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const { data: drop } = await supabaseAdmin
    .from("drops")
    .select("starts_at, ends_at, is_published")
    .eq("id", dropId)
    .maybeSingle();
  if (!drop?.is_published) {
    return { status: "error", message: "drops.signupFailed" };
  }
  if (dropPhase(drop) !== "upcoming") {
    return { status: "error", message: "drops.alreadyLive" };
  }

  const { error } = await supabaseAdmin
    .from("drop_signups")
    .upsert(
      { drop_id: dropId, email, locale },
      { onConflict: "drop_id,email", ignoreDuplicates: true },
    );
  if (error) {
    console.error("Drop signup failed:", error.message);
    return { status: "error", message: "drops.signupFailed" };
  }
  return { status: "success", message: "drops.signupSuccess" };
}
