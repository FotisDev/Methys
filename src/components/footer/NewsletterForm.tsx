"use client";

import { useActionState } from "react";
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/_lib/backend/newsletter/action";
import { NEWSLETTER_DISCOUNT_PERCENT } from "@/_lib/constants";
import { useLocale, useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { rich } from "@/i18n/rich";
import Link from "@/components/LocaleLink/LocaleLink";
import { cn } from "@/_lib/utils/cn";

const initialState: NewsletterState = { status: "idle", message: "" };

export default function NewsletterForm() {
  const t = useT();
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  if (state.status === "success" || state.status === "already") {
    return (
      <p role="status" className={cn("text-sm text-vintage-green")}>
        {t(state.message as MessageKey, {
          percent: NEWSLETTER_DISCOUNT_PERCENT,
        })}
      </p>
    );
  }

  return (
    <div className={cn("space-y-2")}>
      <form action={formAction} className={cn("flex w-full")}>
        <input type="hidden" name="locale" value={locale} />
        <input
          type="email"
          name="email"
          placeholder={t("footer.emailPlaceholder")}
          aria-label={t("footer.emailPlaceholder")}
          required
          disabled={isPending}
          className={cn("border border-default-color w-full p-2 text-sm")}
        />
        <button
          type="submit"
          disabled={isPending}
          className={cn("bg-default-cold text-white w-16 disabled:opacity-60")}
          aria-label={
            isPending ? t("newsletter.subscribing") : t("footer.subscribe")
          }
        >
          {isPending ? "…" : "→"}
        </button>
      </form>
      {state.status === "error" && (
        <p role="alert" className={cn("text-xs text-red-600")}>
          {t(state.message as MessageKey)}
        </p>
      )}
      <p className={cn("text-xs text-gray-500")}>
        {rich(t("newsletter.consent"), {
          privacyPolicy: (
            <Link href="/privacy-policy" className={cn("underline")}>
              {t("footer.privacyPolicy")}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}
