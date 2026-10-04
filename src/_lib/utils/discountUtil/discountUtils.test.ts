import { describe, expect, it } from "vitest";
import {
  DISCOUNT_PERCENT,
  calculateDiscountPrice,
  getProductPricing,
} from "./discountUtils";

describe("calculateDiscountPrice", () => {
  it("applies the discount only to offers", () => {
    expect(calculateDiscountPrice(100, true)).toBe(100 * (1 - DISCOUNT_PERCENT / 100));
    expect(calculateDiscountPrice(100, false)).toBe(100);
    expect(calculateDiscountPrice(100)).toBe(100);
  });

  it("never discounts zero or negative prices", () => {
    expect(calculateDiscountPrice(0, true)).toBe(0);
    expect(calculateDiscountPrice(-5, true)).toBe(-5);
  });
});

describe("getProductPricing", () => {
  // Regression: the Corduroy Jacket showed 87.20 in the cart but Stripe charged 109.
  const corduroyJacket = {
    price: 109,
    is_offer: true,
    product_variants: [
      { size: "S", price: null },
      { size: "M", price: null },
    ],
  };

  it("discounts offer products from the DB price", () => {
    expect(getProductPricing(corduroyJacket)).toEqual({
      originalPrice: 109,
      finalPrice: 87.2,
      isDiscounted: true,
    });
  });

  it("falls back to the product price when the variant has no price", () => {
    expect(getProductPricing(corduroyJacket, "S").finalPrice).toBe(87.2);
  });

  it("uses the variant price when it is set", () => {
    const product = {
      price: 100,
      is_offer: true,
      product_variants: [{ size: "XL", price: 120 }],
    };
    expect(getProductPricing(product, "XL")).toEqual({
      originalPrice: 120,
      finalPrice: 96,
      isDiscounted: true,
    });
  });

  it("leaves regular products untouched", () => {
    expect(getProductPricing({ price: 79, is_offer: false })).toEqual({
      originalPrice: 79,
      finalPrice: 79,
      isDiscounted: false,
    });
  });

  it("handles prices stored as strings", () => {
    expect(getProductPricing({ price: "49.90", is_offer: null }).finalPrice).toBe(49.9);
  });

  it("rounds to whole cents so Stripe gets an exact amount", () => {
    const { finalPrice } = getProductPricing({ price: 33.33, is_offer: true });
    expect(finalPrice).toBe(26.66);
    expect(Number.isInteger(Math.round(finalPrice * 100))).toBe(true);
  });

  it("treats an unknown size like no size", () => {
    expect(getProductPricing(corduroyJacket, "XXXL").finalPrice).toBe(87.2);
  });
});
