-- Back-in-stock alerts, saved carts (abandoned-cart emails), review photos.
-- All written by the server with the service role; RLS on with no write policies.

-- "Email me when size M is back."
create table if not exists public.stock_alerts (
  id          uuid        primary key default gen_random_uuid(),
  product_id  bigint      not null references public.products(id) on delete cascade,
  size        text        not null,
  email       text        not null check (email = lower(email)),
  locale      text        not null default 'en',
  created_at  timestamptz not null default now(),
  notified_at timestamptz,
  unique (product_id, size, email)
);

create index if not exists stock_alerts_pending_idx
  on public.stock_alerts (product_id, size) where notified_at is null;

alter table public.stock_alerts enable row level security;

-- The cart of a signed-in customer, so it follows them across devices and can
-- trigger one reminder email if they leave without paying.
-- items: [{ "id": 12, "size": "M", "quantity": 2 }, ...]
create table if not exists public.saved_carts (
  user_id          uuid        primary key references auth.users(id) on delete cascade,
  email            text        not null,
  locale           text        not null default 'en',
  items            jsonb       not null default '[]'::jsonb,
  updated_at       timestamptz not null default now(),
  reminder_sent_at timestamptz
);

create index if not exists saved_carts_reminder_idx
  on public.saved_carts (updated_at) where reminder_sent_at is null;

alter table public.saved_carts enable row level security;

-- Customer photos on reviews (public URLs in the review-photos bucket).
alter table public.product_reviews
  add column if not exists photo_urls text[] not null default '{}'
    check (cardinality(photo_urls) <= 3);

-- Public bucket: anyone can view, only the service role can upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-photos',
  'review-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
