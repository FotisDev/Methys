-- Contact-form categories that fit a clothing shop. Which categories the form
-- offers, and in what order, is set by SUPPORT_CATEGORY_SLUGS in
-- src/_lib/backend/SupportCategories/action.ts. The old "bug-report" and
-- "feature-request" rows stay because existing tickets reference them.
-- Display names per language come from the supportCategories messages.

insert into public.support_categories (name, slug)
select v.name, v.slug
from (values
  ('Order status', 'order-status'),
  ('Shipping & delivery', 'shipping'),
  ('Returns & exchanges', 'returns'),
  ('Sizing & products', 'sizing'),
  ('Discount codes', 'discounts')
) as v(name, slug)
where not exists (
  select 1 from public.support_categories c where c.slug = v.slug
);

update public.support_categories set name = 'Payments & refunds' where slug = 'billing';
update public.support_categories set name = 'Account & login' where slug = 'account';
