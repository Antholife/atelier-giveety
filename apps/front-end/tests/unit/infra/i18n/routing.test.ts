import { i18nRouting } from "@/infra/i18n/routing";
import { describe, expect, it } from "vitest";

describe("infra/i18n/routing", () => {
  it("i18nRouting has locales fr and en", () => {
    expect(i18nRouting.locales).toEqual(["fr", "en"]);
  });

  it("i18nRouting has defaultLocale fr", () => {
    expect(i18nRouting.defaultLocale).toBe("fr");
  });

  it("i18nRouting has pathnames object with route paths as keys", () => {
    expect(i18nRouting.pathnames).toBeDefined();
    expect(typeof i18nRouting.pathnames).toBe("object");
    expect(Object.keys(i18nRouting.pathnames).length).toBeGreaterThan(0);
  });

  it("each pathname value has fr and en locale paths", () => {
    const pathnames = i18nRouting.pathnames as Record<
      string,
      { fr: string; en: string }
    >;
    const entries = Object.entries(pathnames);
    expect(entries.length).toBeGreaterThan(0);
    const allHaveFrEn = entries.every(
      ([path, locales]) =>
        path.startsWith("/") &&
        "fr" in locales &&
        "en" in locales &&
        typeof locales.fr === "string" &&
        typeof locales.en === "string",
    );
    expect(allHaveFrEn).toBe(true);
  });

  it("pathnames include the atelier-ui-ux route", () => {
    const keys = Object.keys(i18nRouting.pathnames);
    expect(keys.some((k) => k.includes("atelier-ui-ux"))).toBe(true);
  });
});
