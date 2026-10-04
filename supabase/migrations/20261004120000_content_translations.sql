-- Translations for long-form DB content (en stays in the original tables).
-- Short UI strings and category names live in src/messages/*.json instead.

create table if not exists public.product_translations (
  product_id       bigint not null references public.products(id) on delete cascade,
  locale           text   not null check (locale in ('el', 'da', 'de')),
  name             text,
  description      text,
  size_description text,
  product_details  text,
  updated_at       timestamptz not null default now(),
  primary key (product_id, locale)
);

create table if not exists public.help_translations (
  help_id     bigint not null references public.help(id) on delete cascade,
  locale      text   not null check (locale in ('el', 'da', 'de')),
  title       text,
  subtitle    text,
  description text,
  updated_at  timestamptz not null default now(),
  primary key (help_id, locale)
);

create table if not exists public.page_translations (
  page_id    uuid   not null references public.pages(id) on delete cascade,
  locale     text   not null check (locale in ('el', 'da', 'de')),
  title      text,
  content    text,
  updated_at timestamptz not null default now(),
  primary key (page_id, locale)
);

-- Public storefront content: anyone may read, only the service role may write.
alter table public.product_translations enable row level security;
alter table public.help_translations    enable row level security;
alter table public.page_translations    enable row level security;

drop policy if exists "Public read" on public.product_translations;
drop policy if exists "Public read" on public.help_translations;
drop policy if exists "Public read" on public.page_translations;

create policy "Public read" on public.product_translations for select using (true);
create policy "Public read" on public.help_translations    for select using (true);
create policy "Public read" on public.page_translations    for select using (true);
