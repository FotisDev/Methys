-- Double opt-in for the newsletter. A signup starts as 'pending' and becomes
-- 'confirmed' only after the person clicks the link in the confirmation email.
-- confirmed_at is the record of consent (GDPR).
alter table public.newsletter_subscribers
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed')),
  add column if not exists confirm_token uuid not null unique default gen_random_uuid(),
  add column if not exists confirmation_sent_at timestamptz not null default now(),
  add column if not exists confirmed_at timestamptz,
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists resend_contact_id text;

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);
