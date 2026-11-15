import { emailButton, emailLayout, sendEmail } from "./layout";
import { escapeHtml } from "./resend";
import { SITE_URL } from "@/components/SEO/urls";
import { getT } from "@/i18n/server";
import { formatPrice } from "@/i18n/translate";
import { isLocale, type Locale } from "@/i18n.config";
import type { OrderItem } from "@/_lib/utils/orders";

// Emails triggered by the shop itself: orders, stock, carts, drops.
// Every value that came from a customer or the database is HTML-escaped.

const toLocale = (value: unknown): Locale => (isLocale(value) ? value : "en");

const muted = (text: string) =>
  `<p style="font-size: 13px; color: #666;">${text}</p>`;

type OrderEmail = {
  email: string;
  name: string;
  locale: string;
  reference: string;
  items: OrderItem[];
  total: number;
  currency: string;
  address?: string;
};

function itemRows(
  items: OrderItem[],
  locale: Locale,
  currency: string,
  sizeLabel: (size: string) => string,
) {
  return items
    .map((item) => {
      const size = item.selectedSize
        ? ` · ${escapeHtml(sizeLabel(item.selectedSize))}`
        : "";
      const price =
        item.price === null
          ? ""
          : formatPrice(item.price * item.quantity, locale, currency);
      return `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
            ${escapeHtml(item.name)}${size} × ${item.quantity}
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
            ${price}
          </td>
        </tr>`;
    })
    .join("");
}

export async function sendOrderConfirmation(order: OrderEmail) {
  const locale = toLocale(order.locale);
  const t = await getT(locale);
  const currency = order.currency.toUpperCase();

  await sendEmail(
    order.email,
    t("emails.orderSubject", { reference: order.reference }),
    emailLayout(`
      <h1 style="font-weight: normal;">${t("emails.orderHeading")}</h1>
      <p>${t("emails.orderBody", { name: escapeHtml(order.name) })}</p>
      <p><strong>${t("emails.orderNumber")}:</strong> ${order.reference}</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${itemRows(order.items, locale, currency, (size) =>
          t("emails.itemSize", { size }),
        )}
        <tr>
          <td style="padding: 12px 0;"><strong>${t("emails.total")}</strong></td>
          <td style="padding: 12px 0; text-align: right;">
            <strong>${formatPrice(order.total, locale, currency)}</strong>
          </td>
        </tr>
      </table>
      ${
        order.address
          ? `<p><strong>${t("emails.shippingTo")}:</strong><br>${escapeHtml(order.address)}</p>`
          : ""
      }
      ${emailButton(`${SITE_URL}/${locale}/account`, t("emails.viewOrders"))}
    `),
  );
}

export async function sendBackInStock(alert: {
  email: string;
  locale: string;
  productName: string;
  size: string;
  productUrl: string;
}) {
  const locale = toLocale(alert.locale);
  const t = await getT(locale);
  const vars = { name: escapeHtml(alert.productName), size: alert.size };

  await sendEmail(
    alert.email,
    t("emails.backInStockSubject", {
      name: alert.productName,
      size: alert.size,
    }),
    emailLayout(`
      <h1 style="font-weight: normal;">${t("emails.backInStockHeading")}</h1>
      <p>${t("emails.backInStockBody", vars)}</p>
      ${emailButton(alert.productUrl, t("emails.shopNow"))}
      ${muted(t("emails.oneTimeNotice"))}
    `),
  );
}

export async function sendCartReminder(cart: {
  email: string;
  locale: string;
  itemNames: string[];
}) {
  const locale = toLocale(cart.locale);
  const t = await getT(locale);
  const list = cart.itemNames
    .slice(0, 5)
    .map((name) => `<li>${escapeHtml(name)}</li>`)
    .join("");

  await sendEmail(
    cart.email,
    t("emails.cartSubject"),
    emailLayout(`
      <h1 style="font-weight: normal;">${t("emails.cartHeading")}</h1>
      <p>${t("emails.cartBody")}</p>
      ${list ? `<ul style="padding-left: 18px;">${list}</ul>` : ""}
      ${emailButton(`${SITE_URL}/${locale}/cart`, t("emails.backToCart"))}
    `),
  );
}

export async function sendDropLive(signup: {
  email: string;
  locale: string;
  title: string;
  dropUrl: string;
}) {
  const locale = toLocale(signup.locale);
  const t = await getT(locale);

  await sendEmail(
    signup.email,
    t("emails.dropSubject", { title: signup.title }),
    emailLayout(`
      <h1 style="font-weight: normal;">${t("emails.dropHeading")}</h1>
      <p>${t("emails.dropBody", { title: escapeHtml(signup.title) })}</p>
      ${emailButton(signup.dropUrl, t("emails.dropCta"))}
      ${muted(t("emails.oneTimeNotice"))}
    `),
  );
}
