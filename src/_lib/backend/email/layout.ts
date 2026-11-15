import { getResend } from "@/_lib/backend/email/resend";
import { env } from "@/env";

// Shared look for every transactional email (newsletter, orders, alerts).

export function emailLayout(content: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #2f3e2f;">
      <p style="font-size: 20px; letter-spacing: 4px; margin: 0 0 24px;">METHYS</p>
      ${content}
    </div>
  `;
}

export const emailButton = (href: string, label: string) => `
  <p style="margin: 28px 0;">
    <a href="${href}" style="display: inline-block; background: #2f3e2f; color: #fff; padding: 12px 28px; text-decoration: none;">
      ${label}
    </a>
  </p>
`;

export async function sendEmail(to: string, subject: string, html: string) {
  const { error } = await getResend().emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject,
    html,
  });
  if (error) throw new Error(`Resend send: ${error.message}`);
}
