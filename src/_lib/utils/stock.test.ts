import { describe, expect, it } from "vitest";
import {
  LOW_STOCK_THRESHOLD,
  findStockProblem,
  getSizeQuantity,
  getStockStatus,
} from "./stock";

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

describe("getSizeQuantity", () => {
  const variants = [
    { size: "M", quantity: 2 },
    { size: "L", quantity: -1 },
  ];
  it("finds the size", () => expect(getSizeQuantity(variants, "M")).toBe(2));
  it("never goes negative", () =>
    expect(getSizeQuantity(variants, "L")).toBe(0));
  it("returns null for unknown or missing sizes", () => {
    expect(getSizeQuantity(variants, "XS")).toBeNull();
    expect(getSizeQuantity(variants, null)).toBeNull();
  });
});

describe("findStockProblem", () => {
  const products = new Map([
    [1, { name: "Tee", product_variants: [{ size: "M", quantity: 1 }] }],
    [2, { name: "Cap", product_variants: [] }],
  ]);

  it("passes when there is enough stock", () => {
    expect(
      findStockProblem([{ id: 1, selectedSize: "M", quantity: 1 }], products),
    ).toBeNull();
  });

  it("names the line that wants too much", () => {
    expect(
      findStockProblem([{ id: 1, selectedSize: "M", quantity: 2 }], products),
    ).toBe("Tee (M)");
  });

  it("flags a size that no longer exists", () => {
    expect(
      findStockProblem([{ id: 1, selectedSize: "XL", quantity: 1 }], products),
    ).toBe("Tee (XL)");
  });

  it("ignores products without size variants", () => {
    expect(findStockProblem([{ id: 2, quantity: 5 }], products)).toBeNull();
  });
});
