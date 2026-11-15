-- Orders: idempotent webhook inserts, stock bookkeeping, shipping/tracking and
-- customers reading their own order history.

-- The table already exists in production; this keeps fresh setups working.
create table if not exists public.orders (
  id                        uuid        primary key default gen_random_uuid(),
  user_id                   uuid        references auth.users(id) on delete set null,
  stripe_session_id         text        not null,
  stripe_payment_intent_id  text,
  status                    text        not null default 'paid',
  total_amount              numeric(10, 2) not null default 0,
  currency                  text        not null default 'eur',
  customer_info             jsonb       not null default '{}'::jsonb,
  items                     jsonb       not null default '[]'::jsonb,
  created_at                timestamptz not null default now()
);

alter table public.orders
  add column if not exists locale               text not null default 'en',
  add column if not exists fulfillment_status   text not null default 'processing'
    check (fulfillment_status in ('processing', 'shipped', 'delivered', 'canceled')),
  add column if not exists tracking_number      text,
  add column if not exists tracking_url         text,
  add column if not exists shipped_at           timestamptz,
  add column if not exists confirmation_sent_at timestamptz;

-- Stripe retries webhooks, so the same Checkout Session can arrive more than
-- once. The webhook upserts on this key and only fulfils the first delivery.
--
-- If this fails with "could not create unique index", duplicates already exist.
-- Find them with:
--   select stripe_session_id, count(*) from orders group by 1 having count(*) > 1;
-- and delete the extra rows before running this migration again.
create unique index if not exists orders_stripe_session_id_key
  on public.orders (stripe_session_id);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

-- Orders hold names and addresses. The server writes with the service role;
-- a signed-in customer may read only their own rows.
alter table public.orders enable row level security;

drop policy if exists "Own orders read" on public.orders;
create policy "Own orders read" on public.orders
  for select using (auth.uid() = user_id);

-- Takes stock off for a paid order in one statement (one transaction).
-- items: [{ "id": 12, "size": "M", "quantity": 2 }, ...]
-- Never goes below zero: if two people paid for the last item at the same time,
-- the order still goes through and the admin sees 0 left.
create or replace function public.decrement_stock(items jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  update public.product_variants pv
     set quantity = greatest(pv.quantity - i.quantity, 0)
    from jsonb_to_recordset(items) as i(id bigint, size text, quantity int)
   where pv.product_id = i.id
     and pv.size = i.size
     and i.quantity > 0;
$$;

-- Only the server (service role) may call it.
revoke execute on function public.decrement_stock(jsonb) from public, anon, authenticated;
