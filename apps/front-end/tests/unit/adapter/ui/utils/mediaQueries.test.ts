import { useIs1000px, useIsMobile } from "@/adapter/ui/utils/mediaQueries";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseMediaQuery = vi.fn();
const mockUseTheme = vi.fn();

vi.mock("@mui/material", () => ({
  useMediaQuery: (query: unknown) => mockUseMediaQuery(query),
  useTheme: () => mockUseTheme(),
}));

function useIs1000pxHook() {
  return useIs1000px();
}

function useIsMobileHook() {
  return useIsMobile();
}

describe("mediaQueries", () => {
  describe("useIs1000px", () => {
    it("returns useMediaQuery result for max-width 1000px", () => {
      mockUseMediaQuery.mockReturnValue(true);
      const { result } = renderHook(useIs1000pxHook);
      expect(result.current).toBe(true);
      expect(mockUseMediaQuery).toHaveBeenCalledWith("(max-width: 1000px)");
    });

    it("returns false when media query matches false", () => {
      mockUseMediaQuery.mockReturnValue(false);
      const { result } = renderHook(useIs1000pxHook);
      expect(result.current).toBe(false);
    });
  });

  describe("useIsMobile", () => {
    it("calls useTheme and useMediaQuery with theme.breakpoints.down(sm)", () => {
      const downSm = "(max-width:599.95px)";
      mockUseTheme.mockReturnValue({
        breakpoints: { down: (key: string) => (key === "sm" ? downSm : "") },
      });
      mockUseMediaQuery.mockReturnValue(true);
      const { result } = renderHook(useIsMobileHook);
      expect(result.current).toBe(true);
      expect(mockUseTheme).toHaveBeenCalled();
      expect(mockUseMediaQuery).toHaveBeenCalledWith(downSm);
    });
  });
});
