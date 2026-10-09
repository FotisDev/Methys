import { randomBytes } from "crypto";
import Stripe from "stripe";
import { FROM_EMAIL, getResend } from "@/_lib/backend/email/resend";
import { NEWSLETTER_DISCOUNT_PERCENT } from "@/_lib/constants";
import { SITE_URL } from "@/components/SEO/urls";
import { getT } from "@/i18n/server";
import type { Locale } from "@/i18n.config";

// Server-only helpers for the newsletter (Resend contacts + emails, Stripe codes).

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const COUPON_ID = `newsletter-welcome-${NEWSLETTER_DISCOUNT_PERCENT}`;

// One Resend segment per language, e.g. "Newsletter (EL)". Pick it as the
// audience when sending a broadcast. Created on first use.
export const segmentName = (locale: Locale) =>
  `Newsletter (${locale.toUpperCase()})`;

const segmentIds = new Map<Locale, string>();

async function getSegmentId(locale: Locale) {
  const cached = segmentIds.get(locale);
  if (cached) return cached;

  const name = segmentName(locale);
  const { data: list, error: listError } = await getResend().segments.list();
  if (listError) throw new Error(`Resend segments: ${listError.message}`);

  let id = list?.data.find((s) => s.name === name)?.id;
  if (!id) {
    const { data: created, error } = await getResend().segments.create({
      name,
    });
    if (error || !created) {
      throw new Error(`Resend segment create: ${error?.message}`);
    }
    id = created.id;
  }

  segmentIds.set(locale, id);
  return id;
}

// Adds the email to Resend (or re-subscribes an existing contact) in the
// segment for their language. Returns the Resend contact id.
export async function subscribeContact(email: string, locale: Locale) {
  const segmentId = await getSegmentId(locale);

  const { data: created } = await getResend().contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  });
  if (created) return created.id;

  // Most likely the contact already exists (e.g. they unsubscribed earlier).
  const { data: updated, error: updateError } =
    await getResend().contacts.update({
      email,
      unsubscribed: false,
    });
  if (updateError || !updated) {
    throw new Error(`Resend contact update: ${updateError?.message}`);
  }
  // Errors here usually mean "already in segment"; the contact is subscribed either way.
  await getResend()
    .contacts.segments.add({ email, segmentId })
    .catch(() => {});
  return updated.id;
}

async function ensureWelcomeCoupon() {
  try {
    return await stripe.coupons.retrieve(COUPON_ID);
  } catch (err) {
    if (!(err instanceof Stripe.errors.StripeInvalidRequestError)) throw err;
    return stripe.coupons.create({
      id: COUPON_ID,
      name: `Newsletter welcome ${NEWSLETTER_DISCOUNT_PERCENT}%`,
      percent_off: NEWSLETTER_DISCOUNT_PERCENT,
      duration: "once",
    });
  }
}

function generateCode() {
  // 8 chars from an alphabet without look-alikes (0/O, 1/I).
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from(
    randomBytes(8),
    (b) => alphabet[b % alphabet.length],
  ).join("");
  return `WELCOME-${suffix}`;
}

// A single-use Stripe promotion code for one subscriber.
export async function createWelcomeCode(email: string) {
  await ensureWelcomeCoupon();
  const promotionCode = await stripe.promotionCodes.create({
    promotion: { type: "coupon", coupon: COUPON_ID },
    code: generateCode(),
    max_redemptions: 1,
    metadata: { source: "newsletter", email },
  });
  return promotionCode.code;
}

function emailLayout(content: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #2f3e2f;">
      <p style="font-size: 20px; letter-spacing: 4px; margin: 0 0 24px;">METHYS</p>
      ${content}
    </div>
  `;
}

const button = (href: string, label: string) => `
  <p style="margin: 28px 0;">
    <a href="${href}" style="display: inline-block; background: #2f3e2f; color: #fff; padding: 12px 28px; text-decoration: none;">
      ${label}
    </a>
  </p>
`;

async function send(to: string, subject: string, html: string) {
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
  if (error) throw new Error(`Resend send: ${error.message}`);
}

export async function sendConfirmationEmail(
  email: string,
  locale: Locale,
  token: string,
) {
  const t = await getT(locale);
  const vars = { percent: NEWSLETTER_DISCOUNT_PERCENT };
  const link = `${SITE_URL}/${locale}/newsletter/confirm?token=${token}`;

  await send(
    email,
    t("newsletter.confirmEmailSubject"),
    emailLayout(`
      <h1 style="font-weight: normal;">${t("newsletter.confirmEmailHeading")}</h1>
      <p>${t("newsletter.confirmEmailBody", vars)}</p>
      ${button(link, t("newsletter.confirmEmailButton"))}
      <p style="font-size: 13px; color: #666;">${t("newsletter.confirmEmailIgnore")}</p>
    `),
  );
}

export async function sendWelcomeEmail(
  email: string,
  locale: Locale,
  code: string,
) {
  const t = await getT(locale);
  const vars = { percent: NEWSLETTER_DISCOUNT_PERCENT };

  await send(
    email,
    t("newsletter.emailSubject", vars),
    emailLayout(`
      <h1 style="font-weight: normal;">${t("newsletter.emailHeading")}</h1>
      <p>${t("newsletter.emailBody", vars)}</p>
      <p style="font-size: 24px; letter-spacing: 3px; font-weight: bold; padding: 16px; border: 1px dashed #2f3e2f; text-align: center;">
        ${code}
      </p>
      <p style="font-size: 13px; color: #666;">${t("newsletter.emailNote")}</p>
      ${button(`${SITE_URL}/${locale}/collections`, t("newsletter.emailCta"))}
    `),
  );
}
