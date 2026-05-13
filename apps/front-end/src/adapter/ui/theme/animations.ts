import { Theme } from "@mui/material";

/**
 * Creates a shake animation keyframe definition
 *
 * Generates a CSS keyframe animation that shakes an element horizontally
 * while changing its background color. Used for form validation feedback.
 *
 * Animation sequence:
 * - Starts at rest with default background
 * - Shakes left/right with decreasing amplitude
 * - Changes background to secondary.light during shake
 * - Returns to default background at the end
 *
 * @param theme - Material-UI theme object for color values
 * @returns Object containing the @keyframes shake definition
 */
export const createShakeAnimation = (theme: Theme) => ({
  "@keyframes shake": {
    "0%": {
      transform: "translateX(0)",
      backgroundColor: theme.palette.background.default,
    },
    "10%": {
      transform: "translateX(-3px)",
      backgroundColor: theme.palette.secondary.light,
    },
    "20%": {
      transform: "translateX(3px)",
      backgroundColor: theme.palette.secondary.light,
    },
    "30%": {
      transform: "translateX(-3px)",
      backgroundColor: theme.palette.secondary.light,
    },
    "40%": {
      transform: "translateX(3px)",
      backgroundColor: theme.palette.secondary.light,
    },
    "50%": {
      transform: "translateX(-2px)",
      backgroundColor: theme.palette.secondary.light,
    },
    "60%": {
      transform: "translateX(2px)",
      backgroundColor: theme.palette.secondary.light,
    },
    "70%": {
      transform: "translateX(-1px)",
      backgroundColor: theme.palette.background.default,
    },
    "80%": {
      transform: "translateX(1px)",
      backgroundColor: theme.palette.background.default,
    },
    "100%": {
      transform: "translateX(0)",
      backgroundColor: theme.palette.background.default,
    },
  },
});
