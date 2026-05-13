import { routeKeys } from "@/infra/routing";
import { describe, expect, it } from "vitest";

describe("infra/routing", () => {
  describe("routeKeys", () => {
    it("is a non-empty array", () => {
      expect(Array.isArray(routeKeys)).toBe(true);
      expect(routeKeys.length).toBeGreaterThan(0);
    });

    it("contains the atelier-ui-ux route", () => {
      expect(routeKeys).toContain("atelier-ui-ux");
    });
  });
});
