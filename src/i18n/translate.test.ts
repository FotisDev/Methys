import { describe, expect, it } from "vitest";
import {
  createTranslator,
  formatPrice,
  translateCategory,
  translateCount,
  translateDynamic,
  type MessageKey,
} from "./translate";

// Intl uses a non-breaking space between number and currency in some locales.
const normalize = (s: string) => s.replace(/ /g, " ");

describe("createTranslator", () => {
  it("returns the string for the given locale", () => {
    expect(createTranslator("en")("cart.title")).toBe("Cart");
    expect(createTranslator("el")("cart.title")).toBe("Καλάθι");
    expect(createTranslator("de")("cart.title")).toBe("Warenkorb");
    expect(createTranslator("da")("cart.title")).toBe("Kurv");
  });

  it("fills in {placeholders}", () => {
    const t = createTranslator("en");
    expect(t("product.inStock", { count: 3 })).toBe("3 in stock");
    expect(t("product.addedToCartWithSize", { name: "Cap", size: "M" })).toBe(
      'Added "Cap" (Size: M) to cart!',
    );
  });

  it("leaves unknown placeholders as they are", () => {
    expect(createTranslator("en")("product.inStock")).toBe("{count} in stock");
  });

  it("returns the key itself when nothing matches", () => {
    expect(createTranslator("el")("does.not.exist" as MessageKey)).toBe(
      "does.not.exist",
    );
  });
});

describe("translateCount", () => {
  it("picks the singular and plural forms", () => {
    const t = createTranslator("en");
    expect(translateCount(t, "common.items", 1)).toBe("1 item");
    expect(translateCount(t, "common.items", 3)).toBe("3 items");
    expect(translateCount(t, "common.items", 0)).toBe("0 items");
  });
});

describe("translateDynamic / translateCategory", () => {
  it("translates DB category names by slug", () => {
    expect(
      translateCategory(createTranslator("el"), "jackets", "jackets"),
    ).toBe("Μπουφάν & σακάκια");
  });

  it("derives the slug from the name when there is no slug", () => {
    expect(
      translateCategory(createTranslator("de"), null, "Knitwear Hoodies"),
    ).toBe("Strick & Hoodies");
    expect(translateCategory(createTranslator("de"), null, "Scarves")).toBe(
      "Schals",
    );
  });

  it("falls back to the DB name for unknown categories", () => {
    expect(
      translateCategory(createTranslator("el"), "brand-new", "Brand New"),
    ).toBe("Brand New");
  });

  it("translates server error keys and passes other text through", () => {
    const t = createTranslator("de");
    expect(translateDynamic(t, "validation.emailRequired", "x")).toBe(
      "E-Mail-Adresse ist erforderlich",
    );
    expect(translateDynamic(t, "Some raw error", "Some raw error")).toBe(
      "Some raw error",
    );
  });
});

describe("formatPrice", () => {
  it("formats euros per locale", () => {
    expect(normalize(formatPrice(87.2, "en"))).toBe("€87.20");
    expect(normalize(formatPrice(87.2, "de"))).toBe("87,20 €");
    expect(normalize(formatPrice(87.2, "el"))).toBe("87,20 €");
    expect(normalize(formatPrice("1234.5", "de"))).toBe("1.234,50 €");
  });
});
