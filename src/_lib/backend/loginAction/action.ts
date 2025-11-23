
'use server';

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { redirect } from "next/navigation";

export type SignInResult = {
  error?: string;
};

export async function signInAction(formData: FormData): Promise<SignInResult> {
  const supabase = await createSupabaseServerClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User doesnt Found" };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: "Profile doesnt found" };
  }

  if (profile.role === "admin") {
    redirect("/product-entry");
  } else {
    redirect("/offers");
  }

  return {};
}