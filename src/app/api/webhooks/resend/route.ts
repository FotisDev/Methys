import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { getResend } from "@/_lib/backend/newsletter/service";

// Keeps Supabase in sync when someone unsubscribes through the link Resend adds
// to broadcasts, or a contact is deleted in the Resend dashboard.
// Subscribe this endpoint to contact.updated and contact.deleted in Resend.
export async function POST(req: NextRequest) {
  const payload = await req.text();

  let event;
  try {
    event = getResend().webhooks.verify({
      payload,
      // Resend signs webhooks with Svix headers.
      headers: {
        id: req.headers.get("svix-id") ?? "",
        timestamp: req.headers.get("svix-timestamp") ?? "",
        signature: req.headers.get("svix-signature") ?? "",
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
    });
  } catch (err) {
    console.error("Resend webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    (event.type === "contact.updated" && event.data.unsubscribed) ||
    event.type === "contact.deleted"
  ) {
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", event.data.email.toLowerCase())
      .eq("status", "confirmed");

    if (error) {
      console.error("Failed to record unsubscribe:", error.message);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
