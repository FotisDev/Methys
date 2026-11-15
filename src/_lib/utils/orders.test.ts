import { describe, expect, it } from "vitest";
import { displayOrderStatus, orderReference, safeHttpUrl } from "./orders";

describe("orderReference", () => {
  it("strips the test and live prefixes", () => {
    expect(orderReference("cs_test_a1b2c3d4e5f6g7")).toBe("A1B2C3D4E5");
    expect(orderReference("cs_live_zzzzyyyyxxxx")).toBe("ZZZZYYYYXX");
  });
});

describe("displayOrderStatus", () => {
  it("shows refunds", () => {
    expect(displayOrderStatus({ status: "refunded" })).toBe("refunded");
  });

  it("shows every other saved order as paid", () => {
    expect(displayOrderStatus({ status: "paid" })).toBe("paid");
  });
});

describe("safeHttpUrl", () => {
  it("accepts http(s) links", () => {
    expect(safeHttpUrl(" https://artist.example/work ")).toBe(
      "https://artist.example/work",
    );
  });

  it("rejects other schemes and junk", () => {
    expect(safeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(safeHttpUrl("not a url")).toBeNull();
    expect(safeHttpUrl("")).toBeNull();
    expect(safeHttpUrl(null)).toBeNull();
  });
});
