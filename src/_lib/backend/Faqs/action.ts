"use server";

import { supabasePublic } from "@/_lib/supabase/client";
import { FAQ } from "@/_lib/types";
import { unstable_cache } from "next/cache";

const FetchFaqs = unstable_cache(
  async (): Promise<FAQ[]> => {
    const { data, error } = await supabasePublic
      .from("help")
      .select("id,title,subtitle,created_at,description")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching FAQs:", error);
      return [];
    }

    return data as FAQ[];
  },
  ["faqs"],
  {
    revalidate: 86400, 
    tags: ["faqs"],
  },
);

export default FetchFaqs;