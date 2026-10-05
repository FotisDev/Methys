-- Newsletter subscribers. Written only by the server (service role), so RLS is
-- on with no policies: nobody can read or write it with the anon key.
create table if not exists public.newsletter_subscribers (
  id              uuid        primary key default gen_random_uuid(),
  email           text        not null unique check (email = lower(email)),
  locale          text        not null default 'en',
  promotion_code  text,
  created_at      timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Product reviews. Only verified buyers may post; that check happens in the
-- server action (it needs the orders table), which writes with the service role.
create table if not exists public.product_reviews (
  id          uuid        primary key default gen_random_uuid(),
  product_id  bigint      not null references public.products(id) on delete cascade,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  author_name text        not null,
  rating      smallint    not null check (rating between 1 and 5),
  title       text        check (char_length(title) <= 120),
  body        text        not null check (char_length(body) between 10 and 2000),
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists product_reviews_product_id_idx
  on public.product_reviews (product_id, created_at desc);

alter table public.product_reviews enable row level security;

drop policy if exists "Public read" on public.product_reviews;
create policy "Public read" on public.product_reviews for select using (true);
