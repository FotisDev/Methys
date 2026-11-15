import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/_lib/supabase/server";

// The single place that decides who is an admin: profiles.role = 'admin'.

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(userId: string): Promise<"admin" | "user"> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin" ? "admin" : "user";
}

// Returns the admin user, or null when not signed in / not an admin.
export async function getAdminUser(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return (await getUserRole(user.id)) === "admin" ? user : null;
}

// For server actions: throws instead of returning null.
export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) throw new Error("Admin access required");
  return user;
}
