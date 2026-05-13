import { getGiveetyLogoSvg } from "@/adapter/ui/utils/giveetyLogoSvg";
import { describe, expect, it } from "vitest";

describe("giveetyLogoSvg", () => {
  describe("getGiveetyLogoSvg", () => {
    it("returns string starting with svg tag", () => {
      const result = getGiveetyLogoSvg("#084D43");
      expect(result.trim().startsWith("<svg")).toBe(true);
      expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it("includes viewBox and width/height", () => {
      const result = getGiveetyLogoSvg("#000");
      expect(result).toContain('viewBox="0 0 2069.29 708.66"');
      expect(result).toContain('width="200"');
      expect(result).toContain('height="70"');
    });

    it("uses logoColor in fill attributes", () => {
      const color = "#abc123";
      const result = getGiveetyLogoSvg(color);
      expect(result).toContain(`fill="${color}"`);
    });

    it("returns different svg when color changes", () => {
      const a = getGiveetyLogoSvg("#111");
      const b = getGiveetyLogoSvg("#222");
      expect(a).not.toBe(b);
      expect(a).toContain("#111");
      expect(b).toContain("#222");
    });
  });
});
