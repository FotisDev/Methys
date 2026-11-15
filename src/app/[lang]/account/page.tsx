import { redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import DropDownMenu from "@/components/header/DropDownMenu";
import Footer from "@/components/footer/Footer";
import Link from "@/components/LocaleLink/LocaleLink";
import LogoutButton from "@/components/buttons/LogoutButton";
import { getCurrentUser } from "@/_lib/backend/auth";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { getValidImage } from "@/_lib/helpers";
import {
  displayOrderStatus,
  orderReference,
  type OrderItem,
} from "@/_lib/utils/orders";
import { getT } from "@/i18n/server";
import { formatPrice } from "@/i18n/translate";
import { defaultLocale, isLocale } from "@/i18n.config";
import { cn } from "@/_lib/utils/cn";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getT(lang);
  return { title: t("account.metaTitle") };
}

type OrderRow = {
  id: string;
  stripe_session_id: string;
  status: string;
  total_amount: number;
  currency: string;
  items: OrderItem[] | null;
  created_at: string;
};

const STATUS_STYLES = {
  paid: "bg-green-50 text-green-800 border-green-200",
  refunded: "bg-gray-100 text-gray-600 border-gray-200",
} as const;

export default async function AccountPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, stripe_session_id, status, total_amount, currency, items, created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) console.error("Failed to load orders:", error.message);
  const orders = (data ?? []) as OrderRow[];
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <section
        className={cn(
          "container mx-auto px-4 pt-28 pb-20 max-w-3xl font-roboto text-vintage-green",
        )}
      >
        <div className={cn("flex items-start justify-between gap-4 mb-10")}>
          <div>
            <h1 className={cn("text-2xl md:text-3xl font-light tracking-wide")}>
              {t("account.title")}
            </h1>
            <p className={cn("text-sm text-gray-500 mt-1")}>{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <nav
          aria-label={t("account.title")}
          className={cn("flex flex-wrap gap-3 mb-12 text-sm")}
        >
          <Link
            href="/Wishlist"
            className={cn(
              "border border-vintage-green px-4 py-2 hover:bg-vintage-green hover:text-white transition-colors",
            )}
          >
            {t("account.wishlist")}
          </Link>
          <Link
            href="/offers"
            className={cn(
              "border border-vintage-green px-4 py-2 hover:bg-vintage-green hover:text-white transition-colors",
            )}
          >
            {t("account.memberOffers")}
          </Link>
          <Link
            href="/drops"
            className={cn(
              "border border-vintage-green px-4 py-2 hover:bg-vintage-green hover:text-white transition-colors",
            )}
          >
            {t("drops.title")}
          </Link>
        </nav>

        <h2 className={cn("text-lg font-normal mb-4")}>
          {t("account.ordersTitle")}
        </h2>

        {orders.length === 0 ? (
          <div className={cn("border border-gray-200 p-8 text-center")}>
            <p className={cn("text-sm text-gray-600 mb-6")}>
              {t("account.noOrders")}
            </p>
            <Link
              href="/collections"
              className={cn(
                "inline-block bg-vintage-green text-white px-8 py-3 text-sm hover:bg-vintage-brown transition-colors",
              )}
            >
              {t("common.startShopping")}
            </Link>
          </div>
        ) : (
          <ul className={cn("space-y-6")}>
            {orders.map((order) => {
              const status = displayOrderStatus(order);
              const items = Array.isArray(order.items) ? order.items : [];
              return (
                <li key={order.id} className={cn("border border-gray-200")}>
                  <div
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200 text-sm",
                    )}
                  >
                    <div>
                      <p className={cn("font-medium")}>
                        #{orderReference(order.stripe_session_id)}
                      </p>
                      <p className={cn("text-xs text-gray-500")}>
                        {dateFormat.format(new Date(order.created_at))}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs uppercase tracking-wider border px-2.5 py-1",
                        STATUS_STYLES[status],
                      )}
                    >
                      {t(`account.status.${status}`)}
                    </span>
                  </div>

                  <ul className={cn("divide-y divide-gray-100 px-5")}>
                    {items.map((item, i) => (
                      <li
                        key={`${item.id}-${item.selectedSize ?? ""}-${i}`}
                        className={cn("flex items-center gap-4 py-3 text-sm")}
                      >
                        {item.image_url && (
                          <div
                            className={cn(
                              "relative w-12 h-16 bg-gray-50 shrink-0",
                            )}
                          >
                            <Image
                              src={getValidImage(item.image_url)}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className={cn("object-cover")}
                            />
                          </div>
                        )}
                        <div className={cn("flex-1 min-w-0")}>
                          <p className={cn("truncate")}>{item.name}</p>
                          <p className={cn("text-xs text-gray-500")}>
                            {item.selectedSize &&
                              `${t("emails.itemSize", { size: item.selectedSize })} · `}
                            × {item.quantity}
                          </p>
                        </div>
                        {typeof item.price === "number" && (
                          <span className={cn("shrink-0")}>
                            {formatPrice(
                              item.price * item.quantity,
                              locale,
                              order.currency.toUpperCase(),
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={cn(
                      "flex justify-end px-5 py-4 border-t border-gray-200 text-sm",
                    )}
                  >
                    <p>
                      {t("emails.total")}:{" "}
                      <strong className={cn("font-medium")}>
                        {formatPrice(
                          order.total_amount,
                          locale,
                          order.currency.toUpperCase(),
                        )}
                      </strong>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <Footer />
    </HeaderProvider>
  );
}
