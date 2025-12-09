"use server";

import { supabase } from "@/_lib/supabase/client";
import { FAQ } from "@/_lib/types";

export default async function FetchFaqs() {
  const { data, error } = await supabase
    .from("help")
    .select("id,title,subtitle,created_at,description")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
  console.log(data);
  return data as FAQ[];
}
