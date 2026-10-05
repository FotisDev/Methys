import { describe, expect, it } from "vitest";
import { localizePath } from "./localizePath";

describe("localizePath", () => {
  it("prefixes internal paths with the locale", () => {
    expect(localizePath("/help", "el")).toBe("/el/help");
    expect(localizePath("/collections/clothing/jackets", "de")).toBe(
      "/de/collections/clothing/jackets",
    );
  });

  it("maps the root to the locale home page", () => {
    expect(localizePath("/", "da")).toBe("/da");
  });

  it("keeps query strings and hashes", () => {
    expect(localizePath("/collections?size=M#top", "el")).toBe(
      "/el/collections?size=M#top",
    );
  });

  it("does not double-prefix paths that already have a locale", () => {
    expect(localizePath("/en/help", "el")).toBe("/en/help");
    expect(localizePath("/de", "el")).toBe("/de");
  });

  it("falls back to English for missing or unknown locales", () => {
    expect(localizePath("/help")).toBe("/en/help");
    expect(localizePath("/help", "fr")).toBe("/en/help");
  });

  it("leaves external, relative and protocol-relative links alone", () => {
    expect(localizePath("https://stripe.com", "el")).toBe("https://stripe.com");
    expect(localizePath("//cdn.example.com/x.js", "el")).toBe(
      "//cdn.example.com/x.js",
    );
    expect(localizePath("#reviews", "el")).toBe("#reviews");
    expect(localizePath("?size=M", "el")).toBe("?size=M");
  });

  it("does not treat a path that merely starts with a locale as localized", () => {
    expect(localizePath("/english-collection", "el")).toBe(
      "/el/english-collection",
    );
  });
});
