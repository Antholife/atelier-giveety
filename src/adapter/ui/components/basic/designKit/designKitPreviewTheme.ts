import baseTheme from "@/adapter/ui/theme";
import { createTheme, type Theme } from "@mui/material/styles";

const DARK_BG_PAGE = "#0c1017";
const DARK_BG_CARD = "#121a23";

/**
 * Thème MUI dérivé du Giveety pour le carrousel Design Kit en **dark mode** :
 * conserve les tokens étendus (tertiary, border, background.page/card) pour que
 * `designKitPalette` et les wireframes restent cohérents + liquid glass lisible.
 */
export function createDesignKitPreviewTheme(isDark: boolean): Theme {
  if (!isDark) return baseTheme;

  return createTheme(baseTheme, {
    palette: {
      mode: "dark",
      primary: {
        main: "#5DD4C4",
        light: "#0f2521",
        dark: "#A7F3EC",
      },
      secondary: {
        main: "#C9E070",
        light: "#182014",
        dark: "#E5F6A3",
      },
      tertiary: {
        main: "#F5A090",
        light: "#3d2420",
        dark: "#C66A5A",
      },
      background: {
        default: DARK_BG_PAGE,
        paper: DARK_BG_CARD,
        page: DARK_BG_PAGE,
        card: "#161d26",
      },
      text: {
        primary: "#E8EDF4",
        secondary: "#94A3B8",
      },
      border: {
        main: "#5B6573",
      },
      divider: "rgba(148, 163, 184, 0.14)",
    },
  });
}
