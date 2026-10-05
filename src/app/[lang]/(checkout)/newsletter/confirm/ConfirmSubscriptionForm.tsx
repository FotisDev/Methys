"use client";

import { useActionState } from "react";
import Link from "@/components/LocaleLink/LocaleLink";
import {
  confirmNewsletterSubscription,
  type ConfirmState,
} from "@/_lib/backend/newsletter/action";
import { NEWSLETTER_DISCOUNT_PERCENT } from "@/_lib/constants";
import { useT } from "@/i18n/client";

const initialState: ConfirmState = { status: "idle" };

export default function ConfirmSubscriptionForm({ token }: { token: string }) {
  const t = useT();
  const [state, formAction, isPending] = useActionState(
    confirmNewsletterSubscription,
    initialState,
  );
  const vars = { percent: NEWSLETTER_DISCOUNT_PERCENT };

  if (state.status === "confirmed" || state.status === "already") {
    return (
      <div role="status">
        <h1 className="text-2xl md:text-3xl mb-3">
          {state.status === "confirmed" && state.code
            ? t("newsletter.confirmed", vars)
            : t("newsletter.alreadyConfirmed")}
        </h1>
        {state.status === "confirmed" && state.code && (
          <p className="my-8 text-2xl tracking-[0.2em] font-bold border border-dashed border-vintage-green py-4">
            {state.code}
          </p>
        )}
        <Link
          href="/collections"
          className="inline-block mt-4 bg-vintage-green text-white px-8 py-3 text-sm hover:bg-vintage-brown transition-colors"
        >
          {t("newsletter.emailCta")}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <h1 className="text-2xl md:text-3xl mb-3">
        {t("newsletter.confirmPageTitle")}
      </h1>
      <p className="text-sm text-gray-500 mb-10">
        {t("newsletter.confirmPageText", vars)}
      </p>

      {(state.status === "invalid" || state.status === "error") && (
        <p role="alert" className="text-sm text-red-600 mb-6">
          {state.status === "invalid"
            ? t("newsletter.invalidLink")
            : t("newsletter.failed")}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-vintage-green text-white px-10 py-3 text-sm uppercase tracking-widest hover:bg-vintage-brown transition-colors disabled:opacity-60 cursor-pointer"
      >
        {isPending ? t("newsletter.confirming") : t("newsletter.confirmButton")}
      </button>
    </form>
  );
}
