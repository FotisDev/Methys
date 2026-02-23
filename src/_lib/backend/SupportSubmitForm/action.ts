"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitSupportTicket(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await createSupabaseServerClient();

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const category_id  = formData.get("category_id") as string;
    const message = (formData.get("message") as string)?.trim();

    if (!name || !email || !category_id  || !message) {
      return { status: "error", message: "All fields are required." };
    }

    if(!category_id || typeof category_id !=='string'){
      return {status:'error',message:"invalid category"};
    }

    const { data: categoryExists } = await supabase
      .from("support_categories")
      .select("id")
      .eq("id", category_id)
      .maybeSingle();

    if (!categoryExists) {
      return { status: "error", message: "Selected category does not exist." };
    }

    const { error } = await supabase.from("support_tickets").insert([
      {
        name,
        email,
        category_id,
        message,
      },
    ]);

    if (error) {
      return { status: "error", message: "Failed to submit ticket." };
    }

    const safeMessage = message
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

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
        <p>${safeMessage}</p>
      `,
    });

    return {
      status: "success",
      message: "Ticket submitted successfully.",
    };
  } catch (err) {
    console.error("Support ticket error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}