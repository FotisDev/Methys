"use server";

import { supabasePublic } from "@/_lib/supabase/client";
import { unstable_cache } from "next/cache";

export type SupportCategory = {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
};

export const getSupportCategories = unstable_cache(
  async (): Promise<SupportCategory[] | null> => {
    const { data, error } = await supabasePublic
      .from("support_categories")
      .select("id, name, slug, created_at")
      .order("name");

    if (error) {
      console.error("Error fetching support categories:", error.message);
      return null;
    }

    return data ?? [];
  },
  ['suport-categories'],
  {
    revalidate:90000,
    tags:['support-categories']
  }
);
