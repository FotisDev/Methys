import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import {
  sendBackInStock,
  sendCartReminder,
  sendDropLive,
} from "@/_lib/backend/email/transactional";
import { translateDrops, type Drop } from "@/_lib/backend/drops/queries";
import { toOrderLines } from "@/_lib/utils/stripeMetadata";
import { absoluteUrl } from "@/components/SEO/urls";
import { isLocale } from "@/i18n.config";
import { env } from "@/env";

// Scheduled job (vercel.json → crons). Sends the emails customers asked for:
//  1. back-in-stock alerts whose size has stock again
//  2. one reminder for carts left alone for a day
//  3. "it's live" emails for drops that have started
// Each email is recorded (notified_at / reminder_sent_at) so a rerun never
// sends it twice. Safe to call by hand with the secret, e.g. right at a drop.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH = 100;
const CART_IDLE_MS = 24 * 60 * 60 * 1000;
const CART_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function authorized(request: NextRequest) {
  const secret = env.CRON_SECRET;
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

type ProductForUrl = {
  id: number;
  name: string;
  slug: string | null;
  categoryformen: { slug: string; parent: { slug: string } | null } | null;
};

async function loadProducts(ids: number[]) {
  if (ids.length === 0) return new Map<number, ProductForUrl>();
  const { data } = await supabaseAdmin
    .from("products")
    .select(
      "id, name, slug, categoryformen:category_men_id(slug, parent:parent_id(slug))",
    )
    .in("id", ids);
  return new Map(
    ((data ?? []) as unknown as ProductForUrl[]).map((p) => [p.id, p]),
  );
}

function productPath(product: ProductForUrl) {
  const category = product.categoryformen;
  if (!category?.parent || !product.slug) return "/collections";
  return `/collections/${category.parent.slug}/${category.slug}/${product.slug}`;
}

const localeOf = (value: string) => (isLocale(value) ? value : "en");

async function notifyStockAlerts() {
  const { data: alerts } = await supabaseAdmin
    .from("stock_alerts")
    .select("id, product_id, size, email, locale")
    .is("notified_at", null)
    .limit(BATCH * 5);
  if (!alerts?.length) return 0;

  const productIds = [...new Set(alerts.map((a) => a.product_id as number))];
  const { data: variants } = await supabaseAdmin
    .from("product_variants")
    .select("product_id, size, quantity")
    .in("product_id", productIds)
    .gt("quantity", 0);
  const inStock = new Set(
    (variants ?? []).map((v) => `${v.product_id}:${v.size}`),
  );

  const ready = alerts
    .filter((a) => inStock.has(`${a.product_id}:${a.size}`))
    .slice(0, BATCH);
  const products = await loadProducts([
    ...new Set(ready.map((a) => a.product_id as number)),
  ]);

  let sent = 0;
  for (const alert of ready) {
    const product = products.get(alert.product_id);
    if (!product) continue;
    try {
      const locale = localeOf(alert.locale);
      await sendBackInStock({
        email: alert.email,
        locale,
        productName: product.name,
        size: alert.size,
        productUrl: `${absoluteUrl(productPath(product), locale)}?size=${encodeURIComponent(alert.size)}`,
      });
      await supabaseAdmin
        .from("stock_alerts")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", alert.id);
      sent++;
    } catch (err) {
      console.error(`Stock alert ${alert.id} failed:`, err);
    }
  }
  return sent;
}

async function remindAbandonedCarts() {
  const now = Date.now();
  const { data: carts } = await supabaseAdmin
    .from("saved_carts")
    .select("user_id, email, locale, items")
    .is("reminder_sent_at", null)
    .lt("updated_at", new Date(now - CART_IDLE_MS).toISOString())
    .gt("updated_at", new Date(now - CART_MAX_AGE_MS).toISOString())
    .limit(BATCH);
  if (!carts?.length) return 0;

  const lines = new Map(carts.map((c) => [c.user_id, toOrderLines(c.items)]));
  const products = await loadProducts([
    ...new Set([...lines.values()].flat().map((l) => l.id)),
  ]);

  let sent = 0;
  for (const cart of carts) {
    const itemNames = (lines.get(cart.user_id) ?? []).flatMap((line) => {
      const product = products.get(line.id);
      return product
        ? [line.size ? `${product.name} (${line.size})` : product.name]
        : [];
    });
    try {
      // Marked first: a cart whose products are all gone is simply skipped.
      await supabaseAdmin
        .from("saved_carts")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("user_id", cart.user_id);
      if (itemNames.length === 0) continue;
      await sendCartReminder({
        email: cart.email,
        locale: localeOf(cart.locale),
        itemNames,
      });
      sent++;
    } catch (err) {
      console.error(`Cart reminder for ${cart.user_id} failed:`, err);
    }
  }
  return sent;
}

async function announceLiveDrops() {
  const nowIso = new Date().toISOString();
  const { data: drops } = await supabaseAdmin
    .from("drops")
    .select("id, slug, title, starts_at, ends_at")
    .eq("is_published", true)
    .is("launch_notified_at", null)
    .lte("starts_at", nowIso);
  if (!drops?.length) return 0;

  let sent = 0;
  for (const drop of drops) {
    const { data: signups } = await supabaseAdmin
      .from("drop_signups")
      .select("id, email, locale")
      .eq("drop_id", drop.id)
      .is("notified_at", null)
      .limit(BATCH * 5);

    const titles = new Map<string, string>();
    const titleFor = async (locale: string) => {
      if (!titles.has(locale)) {
        const [translated] = await translateDrops(
          [{ ...drop, product_ids: [] } as unknown as Drop],
          locale,
        );
        titles.set(locale, translated.title);
      }
      return titles.get(locale)!;
    };

    let failures = 0;
    for (const signup of signups ?? []) {
      const locale = localeOf(signup.locale);
      try {
        await sendDropLive({
          email: signup.email,
          locale,
          title: await titleFor(locale),
          dropUrl: absoluteUrl(`/drops/${drop.slug}`, locale),
        });
        await supabaseAdmin
          .from("drop_signups")
          .update({ notified_at: new Date().toISOString() })
          .eq("id", signup.id);
        sent++;
      } catch (err) {
        failures++;
        console.error(`Drop email ${signup.id} failed:`, err);
      }
    }

    // Done once every signup has its email (more than one batch → next run).
    const allDone = failures === 0 && (signups?.length ?? 0) < BATCH * 5;
    if (allDone) {
      await supabaseAdmin
        .from("drops")
        .update({ launch_notified_at: new Date().toISOString() })
        .eq("id", drop.id);
    }
  }
  return sent;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, number | string> = {};
  for (const [name, job] of [
    ["stockAlerts", notifyStockAlerts],
    ["cartReminders", remindAbandonedCarts],
    ["dropLaunches", announceLiveDrops],
  ] as const) {
    try {
      results[name] = await job();
    } catch (err) {
      console.error(`Cron job ${name} failed:`, err);
      results[name] = "failed";
    }
  }

  return NextResponse.json({ ok: true, sent: results });
}
