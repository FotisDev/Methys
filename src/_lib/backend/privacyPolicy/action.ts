import { createSupabaseServerClient } from "@/_lib/supabase/server";

export type PrivacyPolicyBackendType = {
  title: string;
  content: string;
  slug: string;
  id: number;
  updated_at: string;
  created_at:string;
};

export default async function getPrivacyPolicy(): Promise<PrivacyPolicyBackendType | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("pages")
    .select("title, content, id, slug , updated_at, created_at")
    .eq("slug", "privacy-policy")
    .single();

  if (error) {
    console.error("Error fetching privacy policy:", error.message);
  }

  return data;
}
