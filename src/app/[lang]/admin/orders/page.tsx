import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "@/components/LocaleLink/LocaleLink";
import { getAdminUser } from "@/_lib/backend/auth";
import { updateOrderFulfillment } from "@/_lib/backend/adminOrders/action";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import {
  FULFILLMENT_STATUSES,
  isFulfillmentStatus,
  orderReference,
  type OrderItem,
} from "@/_lib/utils/orders";
import { getT } from "@/i18n/server";
import { formatPrice } from "@/i18n/translate";
import { defaultLocale, isLocale } from "@/i18n.config";
import { cn } from "@/_lib/utils/cn";

type PageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ status?: string }>;
};

export const metadata: Metadata = { title: "Orders · Admin" };

type AdminOrderRow = {
  id: string;
  stripe_session_id: string;
  status: string;
  fulfillment_status: string;
  tracking_number: string | null;
  tracking_url: string | null;
  total_amount: number;
  currency: string;
  customer_info: Record<string, string> | null;
  items: OrderItem[] | null;
  created_at: string;
};

export default async function AdminOrdersPage({
  params,
  searchParams,
}: PageProps) {
  const [{ lang }, { status }] = await Promise.all([params, searchParams]);
  const locale = isLocale(lang) ? lang : defaultLocale;

  // Signed-in customers who aren't admins get a 404, not a hint the page exists.
  if (!(await getAdminUser())) notFound();

  const t = await getT(locale);
  const filter = isFulfillmentStatus(status) ? status : null;

  let query = supabaseAdmin
    .from("orders")
    .select(
      "id, stripe_session_id, status, fulfillment_status, tracking_number, tracking_url, total_amount, currency, customer_info, items, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (filter) query = query.eq("fulfillment_status", filter);

  const { data, error } = await query;
  if (error) console.error("Admin orders:", error.message);
  const orders = (data ?? []) as AdminOrderRow[];
  const dateFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className={cn("container mx-auto px-4 py-10 max-w-5xl font-roboto")}>
      <div className={cn("flex flex-wrap items-center justify-between gap-4")}>
        <h1 className={cn("text-2xl font-light")}>{t("admin.ordersTitle")}</h1>
        <div className={cn("flex gap-4 text-sm")}>
          <Link href="/product-entry" className={cn("underline")}>
            {t("admin.addProduct")}
          </Link>
          <Link href="/" className={cn("underline")}>
            {t("admin.backToShop")}
          </Link>
        </div>
      </div>

      <nav className={cn("flex flex-wrap gap-2 my-6 text-xs")}>
        {[null, ...FULFILLMENT_STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={cn(
              "border px-3 py-1.5 uppercase tracking-wider",
              filter === s
                ? "bg-vintage-green text-white border-vintage-green"
                : "border-gray-300 hover:border-vintage-green",
            )}
          >
            {s ? t(`account.status.${s}`) : t("admin.all")}
          </Link>
        ))}
      </nav>

      {orders.length === 0 && (
        <p className={cn("text-sm text-gray-500")}>{t("admin.noOrders")}</p>
      )}

      <ul className={cn("space-y-4")}>
        {orders.map((order) => {
          const customer = order.customer_info ?? {};
          const items = Array.isArray(order.items) ? order.items : [];
          return (
            <li
              key={order.id}
              className={cn(
                "border border-gray-200 p-5 grid gap-5 md:grid-cols-[1fr_1fr_280px] text-sm",
              )}
            >
              <div>
                <p className={cn("font-medium")}>
                  #{orderReference(order.stripe_session_id)}
                  {order.status === "refunded" && (
                    <span className={cn("ml-2 text-xs text-red-600 uppercase")}>
                      {t("account.status.refunded")}
                    </span>
                  )}
                </p>
                <p className={cn("text-xs text-gray-500 mb-3")}>
                  {dateFormat.format(new Date(order.created_at))}
                </p>
                <p>{customer.name}</p>
                <p className={cn("text-gray-600")}>{customer.email}</p>
                <p className={cn("text-gray-600")}>{customer.phone}</p>
                <p className={cn("text-gray-600")}>
                  {[customer.address, customer.zipCode, customer.city]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div>
                <ul className={cn("space-y-1")}>
                  {items.map((item, i) => (
                    <li key={i}>
                      {item.quantity} × {item.name}
                      {item.selectedSize && ` (${item.selectedSize})`}
                    </li>
                  ))}
                </ul>
                <p className={cn("mt-3 font-medium")}>
                  {formatPrice(
                    order.total_amount,
                    locale,
                    order.currency.toUpperCase(),
                  )}
                </p>
              </div>

              <form action={updateOrderFulfillment} className={cn("space-y-2")}>
                <input type="hidden" name="orderId" value={order.id} />
                <label className={cn("block text-xs text-gray-600")}>
                  {t("admin.status")}
                  <select
                    name="fulfillmentStatus"
                    defaultValue={order.fulfillment_status}
                    className={cn(
                      "mt-1 block w-full border border-gray-300 px-2 py-1.5",
                    )}
                  >
                    {FULFILLMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {t(`account.status.${s}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={cn("block text-xs text-gray-600")}>
                  {t("emails.trackingNumber")}
                  <input
                    name="trackingNumber"
                    defaultValue={order.tracking_number ?? ""}
                    className={cn(
                      "mt-1 block w-full border border-gray-300 px-2 py-1.5",
                    )}
                  />
                </label>
                <label className={cn("block text-xs text-gray-600")}>
                  {t("admin.trackingUrl")}
                  <input
                    name="trackingUrl"
                    type="url"
                    placeholder="https://"
                    defaultValue={order.tracking_url ?? ""}
                    className={cn(
                      "mt-1 block w-full border border-gray-300 px-2 py-1.5",
                    )}
                  />
                </label>
                <button
                  type="submit"
                  className={cn(
                    "w-full bg-vintage-green text-white py-2 text-xs uppercase tracking-wider hover:bg-vintage-brown",
                  )}
                >
                  {t("admin.save")}
                </button>
                <p className={cn("text-[11px] text-gray-500")}>
                  {t("admin.shippedHint")}
                </p>
              </form>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
