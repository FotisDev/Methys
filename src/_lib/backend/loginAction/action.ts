"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { revalidatePath } from "next/cache";

type SignInSuccess = {
  success: true;
  role: "admin" | "user";
};

type SignInError = {
  success: false;
  error: string;
};

export type SignInResult = SignInSuccess | SignInError;

export async function signInAction(formData: FormData): Promise<SignInResult> {
  const supabase = await createSupabaseServerClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    return { success: false, error: error?.message ?? "Invalid credentials" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile?.role) {
    return { success: false, error: "Profile not found or role missing" };
  }

  revalidatePath("/offers");
  revalidatePath("/product-entry");

  return { success: true, role: profile.role as "admin" | "user" };
}
