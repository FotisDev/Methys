import { Resend } from "resend";

// Created on first use: the constructor throws without an API key, which would
// otherwise break every page that imports this module.
let resendClient: Resend | null = null;
export function getResend() {
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

// Resend's test sender (onboarding@resend.dev) only delivers to the account
// owner. Set RESEND_FROM_EMAIL to an address on a verified domain to send to
// real customers.
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Methys <onboarding@resend.dev>";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
