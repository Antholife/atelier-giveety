import { createShakeAnimation } from "@/adapter/ui/theme/animations";
import type { Theme } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";

describe("animations", () => {
  describe("createShakeAnimation", () => {
    it("returns object with @keyframes shake", () => {
      const theme = createTheme() as Theme;
      const result = createShakeAnimation(theme);
      expect(result).toHaveProperty("@keyframes shake");
      expect(typeof result["@keyframes shake"]).toBe("object");
    });

    it("uses theme.palette.background.default for 0%, 70%, 80%, 100%", () => {
      const theme = createTheme({
        palette: { background: { default: "#fff000" } },
      }) as Theme;
      const keyframes = createShakeAnimation(theme)["@keyframes shake"];
      expect(keyframes["0%"].backgroundColor).toBe("#fff000");
      expect(keyframes["70%"].backgroundColor).toBe("#fff000");
      expect(keyframes["80%"].backgroundColor).toBe("#fff000");
      expect(keyframes["100%"].backgroundColor).toBe("#fff000");
    });

    it("uses theme.palette.secondary.light for 10%–60%", () => {
      const theme = createTheme({
        palette: { secondary: { main: "#000", light: "#abc123" } },
      }) as Theme;
      const keyframes = createShakeAnimation(theme)["@keyframes shake"];
      const secondaryLight = "#abc123";
      expect(keyframes["10%"].backgroundColor).toBe(secondaryLight);
      expect(keyframes["20%"].backgroundColor).toBe(secondaryLight);
      expect(keyframes["30%"].backgroundColor).toBe(secondaryLight);
      expect(keyframes["40%"].backgroundColor).toBe(secondaryLight);
      expect(keyframes["50%"].backgroundColor).toBe(secondaryLight);
      expect(keyframes["60%"].backgroundColor).toBe(secondaryLight);
    });

    it("defines translateX values for shake steps", () => {
      const theme = createTheme() as Theme;
      const keyframes = createShakeAnimation(theme)["@keyframes shake"];
      expect(keyframes["0%"].transform).toBe("translateX(0)");
      expect(keyframes["10%"].transform).toBe("translateX(-3px)");
      expect(keyframes["20%"].transform).toBe("translateX(3px)");
      expect(keyframes["50%"].transform).toBe("translateX(-2px)");
      expect(keyframes["60%"].transform).toBe("translateX(2px)");
      expect(keyframes["70%"].transform).toBe("translateX(-1px)");
      expect(keyframes["100%"].transform).toBe("translateX(0)");
    });
  });
});
