import { useMediaQuery, useTheme } from "@mui/material";

/**
 * Hook to check if screen width is below 1000px
 *
 * Useful for responsive layouts that need to adapt at the 1000px breakpoint.
 * Commonly used for adjusting component layouts between tablet and desktop views.
 *
 * @returns True if screen width is <= 1000px, false otherwise
 */
export const useIs1000px = () => {
  return useMediaQuery("(max-width: 1000px)");
};

/**
 * Hook to check if screen is in mobile view
 *
 * Uses Material-UI's theme breakpoint system to detect mobile screens.
 * Mobile is defined as screens below the SM breakpoint (< 600px).
 *
 * @returns True if screen width is < 600px (SM breakpoint), false otherwise
 */
export const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
};
