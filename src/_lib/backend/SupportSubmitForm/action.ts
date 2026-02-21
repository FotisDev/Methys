"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitSupportTicket(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const category_id = formData.get("category_id") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !category_id || !message) {
    return { status: "error", message: "All fields are required." };
  }

  const { error } = await supabase
    .from("support_tickets")
    .insert([{ name, email, category_id, message }]);

  if (error) {
    return { status: "error", message: error.message };
  }

  try {
    await resend.emails.send({
      from: "Support <onboarding@resend.dev>",
      to: "fotislir@outlook.com",
      subject: `New Support Ticket from ${name}`,
      html: `
        <h2>New Support Ticket</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category ID:</strong> ${category_id}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }

  return { status: "success", message: "Ticket submitted successfully." };
}