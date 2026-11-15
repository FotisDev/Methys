# Methys

Online clothing store built with Next.js (App Router), Supabase, Stripe and
Resend. Available in English, Greek, Danish and German.

## Getting started

```bash
nvm use            # Node 24 (see .nvmrc)
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev        # http://localhost:3000
```

Useful scripts:

| Script              | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run check`     | Type-check, lint and Prettier check (CI too) |
| `npm test`          | Unit tests (Vitest)                          |
| `npm run build`     | Production build                             |
| `npm run gen-types` | Regenerate `database.types.ts` from Supabase |

## Environment variables

| Name                            | Required | Notes                                                             |
| ------------------------------- | -------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | yes      |                                                                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes      |                                                                   |
| `NEXT_PUBLIC_SITE_URL`          | prod     | Used in emails, sitemaps and canonical URLs                       |
| `SUPABASE_SERVICE_ROLE_KEY`     | yes      | Server only                                                       |
| `STRIPE_SECRET_KEY`             | yes      |                                                                   |
| `STRIPE_WEBHOOK_SECRET`         | yes      | From the webhook endpoint in the Stripe dashboard                 |
| `RESEND_API_KEY`                | prod     | Without it no emails are sent                                     |
| `RESEND_FROM_EMAIL`             | prod     | Sender on a verified domain, e.g. `Methys <shop@your-domain.com>` |
| `RESEND_WEBHOOK_SECRET`         | optional | Resend → newsletter unsubscribe sync                              |
| `CRON_SECRET`                   | prod     | At least 16 characters. Protects `/api/cron/notify`               |
| `REVALIDATE_SECRET`             | optional | For `/api/revalidate?tag=...`                                     |
| `SUPPORT_INBOX_EMAIL`           | optional | Where support tickets are sent                                    |

All variables are validated with Zod in `src/env.ts`.

## Database

Migrations live in `supabase/migrations` and are applied in filename order
(Supabase SQL editor, or `supabase db push`). Every table has row-level
security on; the server writes with the service-role key.

## Stripe

Webhook endpoint: `https://<your-domain>/api/webhooks/stripe`, with these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `charge.refunded`

The webhook saves the order once (Stripe retries are ignored), takes the sold
sizes off stock, clears the customer's saved cart and emails the order
confirmation as soon as Stripe confirms the payment.

Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## Scheduled emails

`/api/cron/notify` sends back-in-stock alerts, one abandoned-cart reminder
(24 hours after the cart was last changed) and "it's live" emails for drops.
Every email is recorded, so running it twice never sends anything twice.

`vercel.json` runs it once a day, which is the most the Vercel Hobby plan
allows. On Pro, change the schedule to hourly (`0 * * * *`). To send drop
emails right at launch, call it by hand:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<your-domain>/api/cron/notify
```

## Admin

Admins are users with `role = 'admin'` in `public.profiles`. They add
products at `/<lang>/product-entry`. Orders are visible in the Supabase
`orders` table and in the Stripe dashboard.

## Content: Journal and Drops

Both are edited in the Supabase table editor for now.

**Journal** (`journal_posts`): `slug`, `title`, `excerpt`, `body`,
`cover_image`, `author`, `product_ids` (shown as "Shop the look"),
`published_at`. Leave `published_at` empty for a draft, or set a future date
to schedule. The body is plain text: blank lines separate paragraphs and lines
starting with `## ` become headings. Translations go in
`journal_post_translations` (`el`, `da`, `de`); missing fields fall back to
English.

**Drops** (`drops`): `slug`, `title`, `tagline`, `description`, `hero_image`,
optional `collaborator_*` fields, `starts_at`, optional `ends_at`, and
`is_published`. Add products with `drop_products` (`drop_id`, `product_id`,
`position`). Before `starts_at` the page shows a countdown and an email signup;
from `starts_at` it shows the products. Translations go in
`drop_translations`.

Images: upload to Supabase Storage (public bucket) and paste the
`/storage/v1/object/public/...` URL. Other hosts are blocked by
`images.remotePatterns` in `next.config.ts`.

## Deployment

Vercel deploys `master` automatically; GitHub Actions (`.github/workflows/ci.yml`)
runs lint, type-check, tests and a build on every push and pull request. A
Docker image is also available, see [README.docker.md](README.docker.md).
