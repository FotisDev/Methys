import { describe, expect, it } from "vitest";
import { displayOrderStatus, orderReference, safeTrackingUrl } from "./orders";

describe("orderReference", () => {
  it("strips the test and live prefixes", () => {
    expect(orderReference("cs_test_a1b2c3d4e5f6g7")).toBe("A1B2C3D4E5");
    expect(orderReference("cs_live_zzzzyyyyxxxx")).toBe("ZZZZYYYYXX");
  });
});

describe("displayOrderStatus", () => {
  it("shows refunds first", () => {
    expect(
      displayOrderStatus({ status: "refunded", fulfillment_status: "shipped" }),
    ).toBe("refunded");
  });

  it("uses the fulfillment status", () => {
    expect(
      displayOrderStatus({ status: "paid", fulfillment_status: "shipped" }),
    ).toBe("shipped");
  });

  it("defaults to processing", () => {
    expect(displayOrderStatus({ status: "paid" })).toBe("processing");
    expect(
      displayOrderStatus({ status: "paid", fulfillment_status: "weird" }),
    ).toBe("processing");
  });
});

describe("safeTrackingUrl", () => {
  it("accepts http(s) links", () => {
    expect(safeTrackingUrl(" https://track.example/123 ")).toBe(
      "https://track.example/123",
    );
  });

  it("rejects other schemes and junk", () => {
    expect(safeTrackingUrl("javascript:alert(1)")).toBeNull();
    expect(safeTrackingUrl("not a url")).toBeNull();
    expect(safeTrackingUrl("")).toBeNull();
    expect(safeTrackingUrl(null)).toBeNull();
  });
});
