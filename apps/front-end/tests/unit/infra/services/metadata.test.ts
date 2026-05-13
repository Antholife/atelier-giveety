import { createMetadataForPage } from "@/infra/services/metadata";
import { describe, expect, it, vi } from "vitest";

const mockT = vi.fn((key: string) => {
  if (key === "atelier-ui-ux.title") return "atelier ui ux";
  if (key === "atelier-ui-ux.description") return "Description atelier";
  return key;
});

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => Promise.resolve(mockT)),
}));

describe("infra/services/metadata", () => {
  describe("createMetadataForPage", () => {
    it("returns title capitalized with ' - Giveety' and description", async () => {
      const result = await createMetadataForPage("atelier-ui-ux");
      expect(result).toEqual({
        title: "Atelier ui ux - Giveety",
        description: "Description atelier",
      });
    });

    it("calls getTranslations with 'pages' namespace", async () => {
      const { getTranslations } = await import("next-intl/server");
      await createMetadataForPage("atelier-ui-ux");
      expect(getTranslations).toHaveBeenCalledWith("pages");
    });
  });
});
