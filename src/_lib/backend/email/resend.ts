import { Resend } from "resend";
import { env } from "@/env";

// Created on first use: the constructor throws without an API key, which would
// otherwise break every page that imports this module.
let resendClient: Resend | null = null;
export function getResend() {
  resendClient ??= new Resend(env.RESEND_API_KEY);
  return resendClient;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
