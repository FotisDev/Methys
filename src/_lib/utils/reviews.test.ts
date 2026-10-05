import { describe, expect, it } from "vitest";
import {
  hasPurchasedProduct,
  reviewAuthorName,
  summarizeReviews,
} from "./reviews";

describe("summarizeReviews", () => {
  it("returns zero for no reviews", () => {
    expect(summarizeReviews([])).toEqual({ count: 0, average: 0 });
  });

  it("averages to one decimal", () => {
    expect(
      summarizeReviews([{ rating: 5 }, { rating: 4 }, { rating: 4 }]),
    ).toEqual({ count: 3, average: 4.3 });
  });
});

describe("hasPurchasedProduct", () => {
  const orders = [
    { items: [{ id: 3, quantity: 1 }] },
    { items: [{ id: "7", quantity: 2 }] },
    { items: null },
  ];

  it("finds the product in any order", () => {
    expect(hasPurchasedProduct(orders, 3)).toBe(true);
  });

  it("matches ids stored as strings", () => {
    expect(hasPurchasedProduct(orders, 7)).toBe(true);
  });

  it("returns false when the product was never ordered", () => {
    expect(hasPurchasedProduct(orders, 99)).toBe(false);
    expect(hasPurchasedProduct([], 3)).toBe(false);
  });
});

describe("reviewAuthorName", () => {
  it("shortens the last name to an initial", () => {
    expect(reviewAuthorName("Fotis", "lirakis", "Customer")).toBe("Fotis L.");
  });

  it("uses only the first name when there is no last name", () => {
    expect(reviewAuthorName("Fotis", "", "Customer")).toBe("Fotis");
  });

  it("falls back when there is no first name", () => {
    expect(reviewAuthorName(undefined, "Lirakis", "Customer")).toBe("Customer");
  });
});
