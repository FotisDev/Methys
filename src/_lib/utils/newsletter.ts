// A confirmation link stays valid this long after it was emailed.
export const CONFIRMATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// Repeated signups within this window don't send another confirmation email.
export const CONFIRMATION_RESEND_COOLDOWN_MS = 2 * 60 * 1000;

export function isConfirmationExpired(sentAt: string, now = Date.now()) {
  return now - new Date(sentAt).getTime() > CONFIRMATION_TTL_MS;
}

export function canResendConfirmation(sentAt: string, now = Date.now()) {
  return now - new Date(sentAt).getTime() >= CONFIRMATION_RESEND_COOLDOWN_MS;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidToken(token: unknown): token is string {
  return typeof token === "string" && UUID_RE.test(token);
}
