import { MAIN_CONTENT_PADDING_TOP } from "@/adapter/ui/utils/layoutConstants";
import { describe, expect, it } from "vitest";

describe("layoutConstants", () => {
  describe("MAIN_CONTENT_PADDING_TOP", () => {
    it("has MOBILE and DESKTOP keys", () => {
      expect(MAIN_CONTENT_PADDING_TOP.MOBILE).toBeDefined();
      expect(MAIN_CONTENT_PADDING_TOP.DESKTOP).toBeDefined();
    });

    it("MOBILE is 150px", () => {
      expect(MAIN_CONTENT_PADDING_TOP.MOBILE).toBe("150px");
    });

    it("DESKTOP is 182px", () => {
      expect(MAIN_CONTENT_PADDING_TOP.DESKTOP).toBe("182px");
    });
  });
});
