import theme from "@/adapter/ui/theme";
import { describe, expect, it } from "vitest";

describe("theme", () => {
  it("exposes palette.primary with main and light", () => {
    expect(theme.palette.primary.main).toBe("#084D43");
    expect(theme.palette.primary.light).toBe("#E0F2F1");
  });

  it("exposes palette.secondary", () => {
    expect(theme.palette.secondary.main).toBe("#D3E582");
    expect(theme.palette.secondary.light).toBe("#D3EDE9");
  });

  it("exposes palette.tertiary with main, light, dark", () => {
    expect(theme.palette.tertiary.main).toBe("#F48472");
    expect(theme.palette.tertiary.light).toBe("#FDE9E6");
    expect(theme.palette.tertiary.dark).toBe("#C66A5A");
  });

  it("exposes extendedVars with appBarHeight and breadcrumbsHeight", () => {
    expect(theme.extendedVars).toBeDefined();
    expect(theme.extendedVars.appBarHeight).toBe("9vh");
    expect(theme.extendedVars.breadcrumbsHeight).toBe("6vh");
  });

  it("exposes typography.fontFamily", () => {
    expect(theme.typography.fontFamily).toContain("var(--font-mulish)");
  });

  it("exposes palette.background.default, card, page", () => {
    expect(theme.palette.background.default).toBe("#ffffff");
    expect(theme.palette.background.card).toBe("#FBFCF2");
    expect(theme.palette.background.page).toBe("#F2F1ED");
  });

  it("exposes palette.pdf with starColor, defaultSkillColor, white", () => {
    expect(theme.palette.pdf.starColor).toBe("#FFD700");
    expect(theme.palette.pdf.defaultSkillColor).toBe("#A8E6CF");
    expect(theme.palette.pdf.white).toBe("#FFFFFF");
  });
});
