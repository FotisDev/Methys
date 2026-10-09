import { supabasePublic } from "@/_lib/supabase/client";
import { unstable_cache } from "next/cache";

export type SupportCategory = {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
};

// Categories offered on the contact form, in display order. Rows not listed
// here (e.g. the old "bug-report") stay in the table for existing tickets but
// are no longer offered.
export const SUPPORT_CATEGORY_SLUGS = [
  "order-status",
  "shipping",
  "returns",
  "billing",
  "sizing",
  "discounts",
  "account",
  "other",
] as const;

export function isOfferedCategory(slug: string) {
  return (SUPPORT_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export const getSupportCategories = unstable_cache(
  async (): Promise<SupportCategory[] | null> => {
    const { data, error } = await supabasePublic
      .from("support_categories")
      .select("id, name, slug, created_at")
      .in("slug", SUPPORT_CATEGORY_SLUGS);

    if (error) {
      console.error("Error fetching support categories:", error.message);
      return null;
    }

    const order = SUPPORT_CATEGORY_SLUGS as readonly string[];
    return (data ?? []).sort(
      (a, b) => order.indexOf(a.slug) - order.indexOf(b.slug),
    );
  },
  ["support-categories"],
  {
    revalidate: 90000,
    tags: ["support-categories"],
  },
);
