"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/_lib/backend/auth";

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

  // A customer without a profiles row is a normal user, not a failed login.
  const role = await getUserRole(data.user.id);

  revalidatePath("/offers");
  revalidatePath("/account");
  revalidatePath("/product-entry");

  return { success: true, role };
}
