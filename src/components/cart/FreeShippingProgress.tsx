"use client";

import { useFormatPrice, useT } from "@/i18n/client";
import { getShipping } from "@/_lib/utils/shipping";

export default function FreeShippingProgress({
  subtotal,
  className = "",
}: {
  subtotal: number;
  className?: string;
}) {
  const t = useT();
  const formatPrice = useFormatPrice();
  const { isFree, remaining, progress } = getShipping(subtotal);

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs text-vintage-green">
        {isFree
          ? t("shipping.unlocked")
          : t("shipping.remaining", { amount: formatPrice(remaining) })}
      </p>
      <div
        role="progressbar"
        aria-label={t("shipping.progressLabel")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="h-1.5 w-full bg-gray-200 overflow-hidden rounded-full"
      >
        <div
          className="h-full bg-vintage-green transition-[width] duration-500 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
