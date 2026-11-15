import { describe, expect, it } from "vitest";
import { packMetadata, toOrderLines, unpackMetadata } from "./stripeMetadata";

describe("packMetadata / unpackMetadata", () => {
  it("round-trips a value", () => {
    const value = [{ id: 1, size: "M", quantity: 2 }];
    expect(unpackMetadata(packMetadata("cart", value), "cart")).toEqual(value);
  });

  it("keeps every chunk within Stripe's 500-character limit", () => {
    const value = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      size: "XXL",
      quantity: 3,
    }));
    const packed = packMetadata("cart", value);
    expect(Object.keys(packed).length).toBeGreaterThan(1);
    for (const chunk of Object.values(packed)) {
      expect(chunk.length).toBeLessThanOrEqual(500);
    }
    expect(unpackMetadata(packed, "cart")).toEqual(value);
  });

  it("falls back to the legacy single key", () => {
    const metadata = { cart_items: JSON.stringify([{ id: 4 }]) };
    expect(unpackMetadata(metadata, "cart", "cart_items")).toEqual([{ id: 4 }]);
  });

  it("returns null for missing or broken data", () => {
    expect(unpackMetadata(undefined, "cart")).toBeNull();
    expect(unpackMetadata({}, "cart")).toBeNull();
    expect(unpackMetadata({ cart_0: "{not json" }, "cart")).toBeNull();
  });
});

describe("toOrderLines", () => {
  it("normalizes compact and legacy cart items", () => {
    expect(
      toOrderLines([
        { id: 1, size: "M", quantity: 2 },
        { id: "2", selectedSize: "L", quantity: 1, name: "Tee" },
        { id: 3 },
      ]),
    ).toEqual([
      { id: 1, size: "M", quantity: 2 },
      { id: 2, size: "L", quantity: 1 },
      { id: 3, quantity: 1 },
    ]);
  });

  it("drops invalid entries", () => {
    expect(toOrderLines([null, { id: "x" }, { id: -1 }, "oops"])).toEqual([]);
    expect(toOrderLines("not an array")).toEqual([]);
  });
});
