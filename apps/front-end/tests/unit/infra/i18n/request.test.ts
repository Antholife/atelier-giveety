import { describe, expect, it, vi } from "vitest";

// getRequestConfig returns our callback so we can invoke it and assert on locale
vi.mock("next-intl/server", () => ({
  getRequestConfig: (
    fn: (opts: {
      requestLocale: Promise<string | undefined>;
    }) => Promise<{ locale: string; messages: unknown }>,
  ) => fn,
}));

describe("infra/i18n/request", () => {
  it("returns locale from resolveLocale and messages from locales json", async () => {
    const getRequestConfig = (await import("@/infra/i18n/request")).default;
    const result = await getRequestConfig({
      requestLocale: Promise.resolve("fr"),
    });
    expect(result.locale).toBe("fr");
    expect(result.messages).toBeDefined();
  });

  it("falls back to default locale when requested is unsupported", async () => {
    const getRequestConfig = (await import("@/infra/i18n/request")).default;
    const result = await getRequestConfig({
      requestLocale: Promise.resolve("de"),
    });
    expect(result.locale).toBe("fr");
  });

  it("falls back to default locale when requestLocale is undefined", async () => {
    const getRequestConfig = (await import("@/infra/i18n/request")).default;
    const result = await getRequestConfig({
      requestLocale: Promise.resolve(undefined),
    });
    expect(result.locale).toBe("fr");
  });
});
