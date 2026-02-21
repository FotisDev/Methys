"use server";

import { supabasePublic } from "@/_lib/supabase/client";

export type SupportCategory = {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
};

export async function getSupportCategories(): Promise<SupportCategory[] | null> {
  const { data, error } = await supabasePublic
    .from("support_categories")
    .select("id, name, slug, created_at") 
    .order("name");

  if (error) {
    console.error("Error fetching support categories:", error.message);
    return null;
  }

  return data ?? [];
}