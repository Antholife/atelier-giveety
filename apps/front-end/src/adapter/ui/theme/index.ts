import { createTheme } from "@mui/material/styles";

/**
 * Material-UI theme configuration
 *
 * Defines the complete theme for the application including colors, typography,
 * and custom extended variables. Extends Material-UI's default theme with
 * custom palette colors and layout dimensions.
 */

/**
 * Main application theme
 *
 * Features:
 * - Custom color palette with primary, secondary, tertiary, and utility colors
 * - Extended variables for layout dimensions (app bar height, breadcrumbs height)
 * - Typography configuration with Inter font family
 * - Custom palette extensions for disabled states and coming soon features
 */
const theme = createTheme({
  palette: {
    primary: {
      main: "#084D43",
      light: "#E0F2F1",
    },
    secondary: {
      main: "#D3E582",
      light: "#D3EDE9",
    },
    tertiary: {
      main: "#F48472",
      light: "#FDE9E6",
      dark: "#C66A5A",
    },
    disabled: {
      main: "#9CA3AF",
      border: "#6B7280",
      background: "#D1D5DB",
      input: "#E8E6DE",
    },
    error: {
      main: "#FF0000",
      light: "#FFEBEE",
    },
    success: {
      main: "#0D6B47",
      light: "#E6FFE6",
    },
    background: {
      default: "#ffffff",
      card: "#FBFCF2",
      page: "#F2F1ED",
    },
    text: {
      primary: "#000000",
      secondary: "#50595E",
    },
    border: {
      main: "#7F8790",
    },
    pdf: {
      starColor: "#FFD700",
      defaultSkillColor: "#A8E6CF",
      white: "#FFFFFF",
    },
  },
  extendedVars: {
    appBarHeight: "9vh",
    breadcrumbsHeight: "6vh",
  },
  typography: {
    fontFamily:
      "var(--font-mulish), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
});

export default theme;

/**
 * Material-UI theme type extensions
 *
 * Extends Material-UI's theme types to include custom properties:
 * - ExtendedVars: Custom layout dimensions (app bar height, breadcrumbs height)
 * - TypeBackground: Additional background colors (card, page)
 * - Palette: Custom color palettes (tertiary, disabled, comingSoon, pdf)
 *
 * These type extensions ensure TypeScript recognizes the custom theme properties
 * throughout the application.
 */
declare module "@mui/material/styles" {
  /**
   * Extended variables for custom layout dimensions
   */
  interface ExtendedVars {
    /** Height of the application bar */
    appBarHeight: string;
    /** Height of the breadcrumbs navigation */
    breadcrumbsHeight: string;
  }

  /**
   * Extended background color types
   */
  interface TypeBackground {
    /** Background color for card components */
    card: string;
    /** Background color for page containers */
    page: string;
  }

  /**
   * Extended theme interface with custom variables
   */
  interface Theme {
    /** Custom layout dimension variables */
    extendedVars: ExtendedVars;
  }

  /**
   * Extended theme options interface
   */
  interface ThemeOptions {
    /** Optional custom layout dimension variables */
    extendedVars?: ExtendedVars;
  }

  /**
   * Extended palette interface with custom color palettes
   */
  interface Palette {
    /** Tertiary color palette (orange/coral) */
    tertiary: {
      main: string;
      light: string;
      dark: string;
    };
    /** Disabled state color palette */
    disabled: {
      main: string;
      border: string;
      background: string;
      input: string;
    };
    /** Border color palette */
    border: {
      main: string;
    };
    /** PDF generation color palette */
    pdf: {
      starColor: string;
      defaultSkillColor: string;
      white: string;
    };
  }

  /**
   * Extended palette options interface for theme creation
   */
  interface PaletteOptions {
    tertiary?: {
      main?: string;
      light?: string;
      dark?: string;
    };
    disabled?: {
      main?: string;
      border?: string;
      background?: string;
      input?: string;
    };
    border?: {
      main?: string;
    };
    pdf?: {
      starColor?: string;
      defaultSkillColor?: string;
      white?: string;
    };
  }
}
