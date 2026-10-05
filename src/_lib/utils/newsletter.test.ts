import { describe, expect, it } from "vitest";
import {
  CONFIRMATION_RESEND_COOLDOWN_MS,
  CONFIRMATION_TTL_MS,
  canResendConfirmation,
  isConfirmationExpired,
  isValidToken,
} from "./newsletter";

const sentAt = "2026-10-01T12:00:00.000Z";
const sent = new Date(sentAt).getTime();

describe("isConfirmationExpired", () => {
  it("is valid within the TTL", () => {
    expect(isConfirmationExpired(sentAt, sent + CONFIRMATION_TTL_MS)).toBe(
      false,
    );
  });

  it("expires after the TTL", () => {
    expect(isConfirmationExpired(sentAt, sent + CONFIRMATION_TTL_MS + 1)).toBe(
      true,
    );
  });
});

describe("canResendConfirmation", () => {
  it("blocks a resend during the cooldown", () => {
    expect(canResendConfirmation(sentAt, sent + 1000)).toBe(false);
  });

  it("allows a resend after the cooldown", () => {
    expect(
      canResendConfirmation(sentAt, sent + CONFIRMATION_RESEND_COOLDOWN_MS),
    ).toBe(true);
  });
});

describe("isValidToken", () => {
  it("accepts a UUID", () => {
    expect(isValidToken("3f1c2b6e-8a4d-4c1e-9b2a-1d2e3f4a5b6c")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isValidToken("not-a-token")).toBe(false);
    expect(isValidToken(null)).toBe(false);
    expect(isValidToken("")).toBe(false);
  });
});
