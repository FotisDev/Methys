import { supabasePublic } from "@/_lib/supabase/client";
import { unstable_cache } from "next/cache";
import { translatePage } from "@/_lib/backend/translations/action";

export type PrivacyPolicyBackendType = {
  title: string;
  content: string;
  slug: string;
  id: string;
  updated_at: string;
  created_at: string;
};

const fetchEnglishPrivacyPolicy = unstable_cache(
  async (): Promise<PrivacyPolicyBackendType | null> => {
    const { data, error } = await supabasePublic
      .from("pages")
      .select("title, content, id, slug, updated_at, created_at")
      .eq("slug", "privacy-policy")
      .single();

    if (error) {
      console.error("Error fetching privacy policy:", error.message);
      return null;
    }

    return data;
  },
  ["privacy-policy"],
  {
    revalidate: 86400, 
    tags: ["privacy-policy"],
  },
);

export default async function getPrivacyPolicy(
  locale = "en",
): Promise<PrivacyPolicyBackendType | null> {
  return translatePage(await fetchEnglishPrivacyPolicy(), locale);
}
