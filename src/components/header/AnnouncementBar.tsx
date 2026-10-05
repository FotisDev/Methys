"use client";

import { useFormatPrice, useT } from "@/i18n/client";
import { FREE_SHIPPING_THRESHOLD } from "@/_lib/utils/shipping";

// Fixed strip above the navbar. Its height (h-8) is matched by the navbar's
// top-8 offset and the spacer in HeaderProvider.
export default function AnnouncementBar() {
  const t = useT();
  const formatPrice = useFormatPrice();

  return (
    <div className="fixed top-0 inset-x-0 z-30 h-8 flex items-center justify-center bg-vintage-green text-white text-[11px] sm:text-xs tracking-wider uppercase px-4 text-center">
      {t("product.freeDelivery", {
        amount: formatPrice(FREE_SHIPPING_THRESHOLD),
      })}
    </div>
  );
}
