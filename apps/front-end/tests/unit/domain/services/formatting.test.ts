import { capitalize, formatDate, slugify } from "@/domain/services";
import { describe, expect, it } from "vitest";

describe("domain/services/formatting", () => {
  describe("capitalize", () => {
    it("returns empty string for null", () => {
      expect(capitalize(null)).toBe("");
    });

    it("returns empty string for undefined", () => {
      expect(capitalize(undefined)).toBe("");
    });

    it("returns empty string for empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("capitalizes first letter only", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("leaves rest of string unchanged", () => {
      expect(capitalize("HELLO")).toBe("HELLO");
      expect(capitalize("hello world")).toBe("Hello world");
    });

    it("single char becomes uppercase", () => {
      expect(capitalize("a")).toBe("A");
    });
  });

  describe("formatDate", () => {
    it("returns string with day, month and year for valid ISO date", () => {
      const result = formatDate("2024-01-12", "en-US");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain("2024");
      expect(result).toMatch(/\d/);
    });

    it("uses locale for formatting (en-US)", () => {
      const result = formatDate("2024-01-12", "en-US");
      expect(result).toMatch(/January|Jan/);
      expect(result).toMatch(/12/);
      expect(result).toMatch(/2024/);
    });

    it("uses locale for formatting (fr)", () => {
      const result = formatDate("2024-01-12", "fr");
      expect(result).toContain("2024");
      expect(result).toMatch(/janvier|Janvier/);
      expect(result).toMatch(/12/);
    });

    it("formats different dates correctly", () => {
      const result = formatDate("2023-06-15", "en-US");
      expect(result).toContain("2023");
      expect(result).toMatch(/June|Jun/);
      expect(result).toMatch(/15/);
    });
  });

  describe("slugify", () => {
    it("lowercases the string", () => {
      expect(slugify("Atelier")).toBe("atelier");
    });

    it("replaces spaces with hyphens", () => {
      expect(slugify("Atelier UI UX")).toBe("atelier-ui-ux");
    });

    it("strips accents (NFD normalization)", () => {
      expect(slugify("Événements")).toBe("evenements");
      expect(slugify("Atelier de compétences")).toBe(
        "atelier-de-competences",
      );
    });

    it("removes special characters", () => {
      expect(slugify("hello world!")).toBe("hello-world");
      expect(slugify("test@example.com")).toBe("testexamplecom");
    });

    it("handles multiple spaces as single hyphen", () => {
      expect(slugify("a   b")).toBe("a-b");
    });

    it("returns empty string for empty input", () => {
      expect(slugify("")).toBe("");
    });

    it("keeps alphanumeric and hyphens only", () => {
      expect(slugify("foo_bar-baz")).toBe("foo_bar-baz");
    });
  });
});
