"use client";
import { LogoutAction } from "@/_lib/backend/logoutAction/action";
import { createSupabaseBrowserClient } from "@/_lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocalizedPath } from "@/components/LocaleLink/LocaleLink";
import { useT } from "@/i18n/client";

export default function LogoutButton({
  className = "",
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const localizePath = useLocalizedPath();
  const t = useT();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();

      await LogoutAction();

      router.push(localizePath("/"));
      router.refresh();
    } catch (error) {
      console.error("logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`bg-vintage-green hover:bg-white-fb text-white hover:text-vintage-green px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? t("auth.loggingOut") : t("auth.logout")}
    </button>
  );
}
