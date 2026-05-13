import { resolveLocale } from "@/domain/services";
import { describe, expect, it } from "vitest";

describe("domain/services/locale", () => {
  describe("resolveLocale", () => {
    const locales = ["fr", "en"] as const;
    const defaultLocale = "fr";

    it("returns requested when it is in supported locales", () => {
      expect(resolveLocale("fr", locales, defaultLocale)).toBe("fr");
      expect(resolveLocale("en", locales, defaultLocale)).toBe("en");
    });

    it("returns defaultLocale when requested is not supported", () => {
      expect(resolveLocale("de", locales, defaultLocale)).toBe("fr");
      expect(resolveLocale("es", locales, defaultLocale)).toBe("fr");
    });

    it("returns defaultLocale when requested is undefined", () => {
      expect(resolveLocale(undefined, locales, defaultLocale)).toBe("fr");
    });

    it("uses provided defaultLocale as fallback", () => {
      expect(resolveLocale("zz", locales, "en")).toBe("en");
    });
  });
});
