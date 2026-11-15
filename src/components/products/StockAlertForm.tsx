"use client";

import { useActionState, useState } from "react";
import {
  subscribeToStockAlert,
  type AlertFormState,
} from "@/_lib/backend/stockAlerts/action";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale, useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/translate";
import { cn } from "@/_lib/utils/cn";

const initialState: AlertFormState = { status: "idle", message: "" };

// Shown on the product page when one or more sizes are sold out.
export default function StockAlertForm({
  productId,
  soldOutSizes,
  defaultOpen = false,
}: {
  productId: number;
  soldOutSizes: string[];
  defaultOpen?: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const { user } = useAuth();
  const [open, setOpen] = useState(defaultOpen);
  const [state, formAction, isPending] = useActionState(
    subscribeToStockAlert,
    initialState,
  );

  if (soldOutSizes.length === 0) return null;

  if (state.status === "success") {
    return (
      <p role="status" className={cn("text-sm text-vintage-green")}>
        ✓ {t("stockAlert.success")}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "text-xs underline underline-offset-4 hover:no-underline",
        )}
      >
        {t("stockAlert.toggle")}
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className={cn("border border-gray-200 p-4 space-y-3 text-sm")}
    >
      <p className={cn("font-medium")}>{t("stockAlert.title")}</p>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="locale" value={locale} />

      <div className={cn("flex gap-2")}>
        <label className={cn("sr-only")} htmlFor={`alert-size-${productId}`}>
          {t("sizeGuide.size")}
        </label>
        <select
          id={`alert-size-${productId}`}
          name="size"
          required
          defaultValue={soldOutSizes[0]}
          disabled={isPending}
          className={cn("border border-gray-300 px-2 py-2 w-20")}
        >
          {soldOutSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <input
          type="email"
          name="email"
          required
          defaultValue={user?.email ?? ""}
          placeholder={t("footer.emailPlaceholder")}
          aria-label={t("footer.emailPlaceholder")}
          disabled={isPending}
          className={cn("border border-gray-300 px-3 py-2 flex-1 min-w-0")}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full py-3 text-xs font-medium tracking-wider uppercase bg-vintage-green text-white hover:bg-vintage-green/90 disabled:opacity-60",
        )}
      >
        {isPending ? "…" : t("stockAlert.submit")}
      </button>

      {state.status === "error" && (
        <p role="alert" className={cn("text-xs text-red-600")}>
          {t(state.message as MessageKey)}
        </p>
      )}
      <p className={cn("text-xs text-gray-500")}>{t("stockAlert.note")}</p>
    </form>
  );
}
