import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// SITE_URL is read once at import time, so each test imports a fresh copy.
async function loadUrls(siteUrl: string) {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
  vi.resetModules();
  return import("./urls");
}

describe("SEO urls", () => {
  beforeEach(() => vi.unstubAllEnvs());
  afterEach(() => vi.unstubAllEnvs());

  it("cleans up whitespace and trailing slashes in NEXT_PUBLIC_SITE_URL", async () => {
    const { SITE_URL } = await loadUrls(" https://methys.com/ ");
    expect(SITE_URL).toBe("https://methys.com");
  });

  it("builds locale-prefixed absolute URLs", async () => {
    const { absoluteUrl } = await loadUrls("https://methys.com");
    expect(absoluteUrl("/about", "el")).toBe("https://methys.com/el/about");
    expect(absoluteUrl("about", "de")).toBe("https://methys.com/de/about");
    expect(absoluteUrl("/", "da")).toBe("https://methys.com/da");
    expect(absoluteUrl()).toBe("https://methys.com/en");
  });

  it("lists every locale plus x-default as hreflang alternates", async () => {
    const { languageAlternates } = await loadUrls("https://methys.com");
    expect(languageAlternates("/help")).toEqual({
      en: "https://methys.com/en/help",
      el: "https://methys.com/el/help",
      da: "https://methys.com/da/help",
      de: "https://methys.com/de/help",
      "x-default": "https://methys.com/en/help",
    });
  });

  it("makes asset paths absolute but keeps full URLs", async () => {
    const { absoluteAssetUrl } = await loadUrls("https://methys.com");
    expect(absoluteAssetUrl("/AuthClothPhoto.jpg")).toBe("https://methys.com/AuthClothPhoto.jpg");
    expect(absoluteAssetUrl("https://cdn.x.com/a.jpg")).toBe("https://cdn.x.com/a.jpg");
  });
});
