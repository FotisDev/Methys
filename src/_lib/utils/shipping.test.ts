import { describe, expect, it } from "vitest";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, getShipping } from "./shipping";

describe("getShipping", () => {
  it("charges the flat fee below the threshold", () => {
    expect(getShipping(100)).toEqual({
      fee: SHIPPING_FEE,
      isFree: false,
      remaining: 50,
      progress: 100 / FREE_SHIPPING_THRESHOLD,
    });
  });

  it("is free exactly at the threshold", () => {
    expect(getShipping(FREE_SHIPPING_THRESHOLD)).toMatchObject({
      fee: 0,
      isFree: true,
      remaining: 0,
      progress: 1,
    });
  });

  it("caps progress at 1 above the threshold", () => {
    expect(getShipping(400).progress).toBe(1);
  });

  it("rounds the remaining amount to cents", () => {
    expect(getShipping(149.99).remaining).toBe(0.01);
  });

  it("handles an empty cart", () => {
    expect(getShipping(0)).toMatchObject({ isFree: false, progress: 0 });
  });
});
