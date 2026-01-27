
"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";

export async function updatePasswordAction(formData: FormData) {
  const access_token = formData.get('access_token') as string;
  const refresh_token = formData.get('refresh_token') as string;
  const type = formData.get('type') as string;
  const password = formData.get('password') as string;

  if (!access_token || !refresh_token || type !== 'recovery') {
    return { error: "Invalid or missing recovery tokens" };
  }

  const supabase = await createSupabaseServerClient();

  const { data: { session }, error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (sessionError || !session) {
    return { error: sessionError?.message || "Failed to establish session" };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  await supabase.auth.signOut();

  return { success: true };
}