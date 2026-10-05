"use server";

import { randomUUID } from "crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { defaultLocale, isLocale, type Locale } from "@/i18n.config";
import {
  canResendConfirmation,
  isConfirmationExpired,
  isValidToken,
} from "@/_lib/utils/newsletter";
import {
  createWelcomeCode,
  sendConfirmationEmail,
  sendWelcomeEmail,
  subscribeContact,
} from "./service";

export type NewsletterState = {
  status: "idle" | "success" | "already" | "error";
  message: string;
};

const emailSchema = z.string().trim().toLowerCase().email().max(254);

// Step 1 (double opt-in): save the signup as pending and email a confirmation
// link. Nothing is added to Resend and no code is created until they confirm.
export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { status: "error", message: "validation.emailInvalid" };
  }
  const email = parsed.data;
  const rawLocale = String(formData.get("locale") ?? "");
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const pending: NewsletterState = {
    status: "success",
    message: "newsletter.success",
  };

  try {
    const { data: existing } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, status, confirmation_sent_at")
      .eq("email", email)
      .maybeSingle();

    if (existing?.status === "confirmed") {
      return { status: "already", message: "newsletter.already" };
    }

    if (existing) {
      // Pending or unsubscribed: send a fresh link, unless one just went out.
      if (
        existing.status === "pending" &&
        !canResendConfirmation(existing.confirmation_sent_at)
      ) {
        return pending;
      }
      const token = randomUUID();
      const { error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .update({
          status: "pending",
          locale,
          confirm_token: token,
          confirmation_sent_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);

      await sendConfirmationEmail(email, locale, token);
      return pending;
    }

    const { data: created, error: insertError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email, locale })
      .select("id, confirm_token")
      .single();

    if (insertError) {
      // A parallel request just created it and is sending the email.
      if (insertError.code === "23505") return pending;
      throw new Error(insertError.message);
    }

    try {
      await sendConfirmationEmail(email, locale, created.confirm_token);
    } catch (err) {
      // Let them try again with a clean slate.
      await supabaseAdmin
        .from("newsletter_subscribers")
        .delete()
        .eq("id", created.id);
      throw err;
    }

    return pending;
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return { status: "error", message: "newsletter.failed" };
  }
}

export type ConfirmState =
  | { status: "idle" }
  | { status: "confirmed"; code: string | null }
  | { status: "already" }
  | { status: "invalid" }
  | { status: "error" };

export async function getConfirmationStatus(
  token: unknown,
): Promise<"pending" | "confirmed" | "invalid"> {
  if (!isValidToken(token)) return "invalid";

  const { data } = await supabaseAdmin
    .from("newsletter_subscribers")
    .select("status, confirmation_sent_at")
    .eq("confirm_token", token)
    .maybeSingle();

  if (!data || data.status === "unsubscribed") return "invalid";
  if (data.status === "confirmed") return "confirmed";
  return isConfirmationExpired(data.confirmation_sent_at)
    ? "invalid"
    : "pending";
}

// Step 2: the person clicked "Confirm" on the page the email linked to.
// (A button, not the link itself, so email scanners that open links can't
// subscribe anyone.)
export async function confirmNewsletterSubscription(
  _prevState: ConfirmState,
  formData: FormData,
): Promise<ConfirmState> {
  const token = formData.get("token");
  if (!isValidToken(token)) return { status: "invalid" };

  try {
    const { data: row } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, email, locale, status, confirmation_sent_at, promotion_code")
      .eq("confirm_token", token)
      .maybeSingle();

    if (!row || row.status === "unsubscribed") return { status: "invalid" };
    if (row.status === "confirmed") return { status: "already" };
    if (isConfirmationExpired(row.confirmation_sent_at)) {
      return { status: "invalid" };
    }

    // Only one request may confirm (guards against double clicks).
    const { data: claimed, error: claimError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        unsubscribed_at: null,
      })
      .eq("id", row.id)
      .eq("status", "pending")
      .select("id");
    if (claimError) throw new Error(claimError.message);
    if (!claimed?.length) return { status: "already" };

    const locale: Locale = isLocale(row.locale) ? row.locale : defaultLocale;

    try {
      const contactId = await subscribeContact(row.email, locale);
      await supabaseAdmin
        .from("newsletter_subscribers")
        .update({ resend_contact_id: contactId })
        .eq("id", row.id);
    } catch (err) {
      // Not in Resend means they'd never get newsletters: undo so they can retry.
      await supabaseAdmin
        .from("newsletter_subscribers")
        .update({ status: "pending", confirmed_at: null })
        .eq("id", row.id);
      throw err;
    }

    // One welcome code per email, ever: re-subscribing doesn't earn a new one.
    if (row.promotion_code) return { status: "confirmed", code: null };

    const code = await createWelcomeCode(row.email);
    await supabaseAdmin
      .from("newsletter_subscribers")
      .update({ promotion_code: code })
      .eq("id", row.id);

    // The code is also shown on the page, so a failed email isn't fatal.
    await sendWelcomeEmail(row.email, locale, code).catch((err) =>
      console.error("Welcome email failed:", err),
    );

    return { status: "confirmed", code };
  } catch (err) {
    console.error("Newsletter confirmation failed:", err);
    return { status: "error" };
  }
}
