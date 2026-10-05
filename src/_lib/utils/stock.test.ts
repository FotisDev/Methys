import { describe, expect, it } from "vitest";
import { LOW_STOCK_THRESHOLD, getStockStatus } from "./stock";

describe("getStockStatus", () => {
  it("sums quantities across sizes", () => {
    expect(getStockStatus([{ quantity: 2 }, { quantity: 1 }])).toEqual({
      total: 3,
      isSoldOut: false,
      isLowStock: true,
    });
  });

  it("is not low stock above the threshold", () => {
    expect(
      getStockStatus([{ quantity: LOW_STOCK_THRESHOLD + 1 }]).isLowStock,
    ).toBe(false);
  });

  it("treats no variants as sold out", () => {
    expect(getStockStatus([])).toMatchObject({
      isSoldOut: true,
      isLowStock: false,
    });
    expect(getStockStatus(null).isSoldOut).toBe(true);
  });

  it("ignores negative quantities", () => {
    expect(getStockStatus([{ quantity: -3 }, { quantity: 2 }]).total).toBe(2);
  });
});
