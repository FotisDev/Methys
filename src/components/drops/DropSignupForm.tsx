"use client";

import { useActionState } from "react";
import { subscribeToDrop } from "@/_lib/backend/drops/action";
import type { AlertFormState } from "@/_lib/backend/stockAlerts/action";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale, useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { cn } from "@/_lib/utils/cn";

const initialState: AlertFormState = { status: "idle", message: "" };

export default function DropSignupForm({
  dropId,
  className,
}: {
  dropId: number;
  className?: string;
}) {
  const t = useT();
  const locale = useLocale();
  const { user } = useAuth();
  const [state, formAction, isPending] = useActionState(
    subscribeToDrop,
    initialState,
  );

  if (state.status === "success") {
    return (
      <p role="status" className={cn("text-sm", className)}>
        ✓ {t("drops.signupSuccess")}
      </p>
    );
  }

  return (
    <div className={cn("space-y-2 w-full max-w-md", className)}>
      <form action={formAction} className={cn("flex w-full")}>
        <input type="hidden" name="dropId" value={dropId} />
        <input type="hidden" name="locale" value={locale} />
        <input
          type="email"
          name="email"
          required
          defaultValue={user?.email ?? ""}
          placeholder={t("footer.emailPlaceholder")}
          aria-label={t("footer.emailPlaceholder")}
          disabled={isPending}
          className={cn(
            "flex-1 min-w-0 border border-current bg-transparent px-3 py-3 text-sm placeholder:text-current/60",
          )}
        />
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "bg-vintage-green text-white px-5 text-xs uppercase tracking-wider hover:bg-vintage-brown disabled:opacity-60",
          )}
        >
          {isPending ? "…" : t("drops.notifyMe")}
        </button>
      </form>
      {state.status === "error" && (
        <p role="alert" className={cn("text-xs text-red-600")}>
          {t(state.message as MessageKey)}
        </p>
      )}
      <p className={cn("text-xs opacity-70")}>{t("drops.signupNote")}</p>
    </div>
  );
}
