"use server";

import { after } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { FROM_EMAIL, escapeHtml, getResend } from "@/_lib/backend/email/resend";
import { isOfferedCategory } from "@/_lib/backend/SupportCategories/action";

type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

// Where new-ticket notifications go.
const SUPPORT_INBOX = process.env.SUPPORT_INBOX_EMAIL ?? "fotislir@outlook.com";

const ticketSchema = z.object({
  name: z.string().trim().min(1, "support.errors.required").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("validation.emailInvalid")
    .max(254),
  category_id: z.string().uuid("support.errors.invalidCategory"),
  order_number: z.string().trim().max(50).optional(),
  message: z
    .string()
    .trim()
    .min(10, "support.errors.messageTooShort")
    .max(5000, "support.errors.messageTooLong"),
});

export async function submitSupportTicket(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = ticketSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    category_id: formData.get("category_id") ?? "",
    order_number: formData.get("order_number") || undefined,
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "support.errors.required",
    };
  }
  const { name, email, category_id, order_number, message } = parsed.data;

  try {
    const { data: category } = await supabaseAdmin
      .from("support_categories")
      .select("name, slug")
      .eq("id", category_id)
      .maybeSingle();

    if (!category || !isOfferedCategory(category.slug)) {
      return { status: "error", message: "support.errors.invalidCategory" };
    }

    // support_tickets has no order column; keep it at the top of the message.
    const fullMessage = order_number
      ? `Order: ${order_number}\n\n${message}`
      : message;

    // Service role: the input is validated above, and RLS doesn't let
    // anonymous visitors insert tickets directly.
    const { error } = await supabaseAdmin
      .from("support_tickets")
      .insert([{ name, email, category_id, message: fullMessage }]);

    if (error) {
      console.error("Support ticket insert failed:", error.message);
      return { status: "error", message: "support.errors.failed" };
    }

    // The ticket is already saved, so the notification email doesn't need to
    // hold up the response.
    after(async () => {
      try {
        const { error: sendError } = await getResend().emails.send({
          from: FROM_EMAIL,
          to: SUPPORT_INBOX,
          // Hitting "Reply" answers the customer directly.
          replyTo: email,
          subject: `[${category.name}] New support ticket from ${name}`,
          html: `
            <h2>New support ticket</h2>
            <p><strong>Category:</strong> ${escapeHtml(category.name)}</p>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${order_number ? `<p><strong>Order:</strong> ${escapeHtml(order_number)}</p>` : ""}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line;">${escapeHtml(message)}</p>
          `,
        });
        if (sendError) throw new Error(sendError.message);
      } catch (err) {
        console.error("Support ticket email failed:", err);
      }
    });

    return { status: "success", message: "support.form.submitted" };
  } catch (err) {
    console.error("Support ticket error:", err);
    return { status: "error", message: "support.errors.failed" };
  }
}
