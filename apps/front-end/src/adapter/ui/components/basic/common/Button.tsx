import { Button as MuiButton, SxProps, Theme, useTheme } from "@mui/material";
import { MouseEvent, ReactNode, useMemo } from "react";

/**
 * Props for Button component
 *
 * @property children - Button content (text or React nodes)
 * @property type - HTML button type ("button" | "submit" | "reset")
 * @property variant - Button visual variant:
 *   - "outlined": Button with border and transparent background
 *   - "contained": Button with filled background and border
 *   - "appbar": Special variant for AppBar navigation with white text and transparent background
 *   - "link": Link-style button with underline, no border, transparent background
 * @property onClick - Click handler function
 * @property disabled - Whether button is disabled
 * @property onMouseEnter - Mouse enter handler
 * @property onMouseLeave - Mouse leave handler
 * @property startIcon - Icon element to display at the start (left) of the button
 * @property endIcon - Icon element to display at the end (right) of the button
 * @property sx - Material-UI sx prop for custom styling
 * @property color - Button color theme ("primary" | "tertiary" | "error"). Only applies to "outlined" and "contained" variants.
 */
type ButtonProps = {
  children: ReactNode | string;
  type: "button" | "submit" | "reset";
  variant: "outlined" | "contained" | "appbar" | "link";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  onMouseEnter?: (event: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLButtonElement>) => void;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sx?: SxProps<Theme>;
  color?: "primary" | "tertiary" | "error";
};

const commonStyle = (): SxProps<Theme> => ({
  fontFamily: (theme: Theme) => theme.typography.fontFamily,
  position: "relative",
  textTransform: "none",
  borderRadius: "30px",
  fontWeight: 500,
  justifyContent: "center",
});

const outlinedStyle = (
  theme: Theme,
  color: ButtonProps["color"],
): SxProps<Theme> =>
  color === "error"
    ? {
        border: `2px solid ${theme.palette.error.main}`,
        color: theme.palette.error.main,
        backgroundColor: theme.palette.error.light,
        "&:hover": {
          backgroundColor: theme.palette.error.main,
          color: theme.palette.background.default,
        },
      }
    : color === "primary"
      ? {
          border: `2px solid ${theme.palette.primary.main}`,
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.background.default,
          "&:hover": {
            backgroundColor: theme.palette.secondary.main,
          },
        }
      : color === "tertiary"
        ? {
            border: `2px solid ${theme.palette.tertiary.main}`,
            color: theme.palette.tertiary.main,
            backgroundColor: theme.palette.tertiary.light,
            "&:hover": {
              backgroundColor: theme.palette.tertiary.main,
              color: theme.palette.background.default,
            },
          }
        : {};

const disabledStyle = (theme: Theme): SxProps<Theme> => ({
  border: `2px solid ${theme.palette.disabled.border}`,
  color: theme.palette.disabled.main,
  backgroundColor: theme.palette.disabled.background,
});

const appbarStyle = (theme: Theme): SxProps<Theme> => ({
  my: 2,
  px: 2,
  color: "white",
  display: "inline-block",
  position: "relative",
  backgroundColor: "transparent",
  boxShadow: "none",
  textTransform: "none",
  fontWeight: 500,
  fontFamily: theme.typography.fontFamily,
  fontSize: "14px",
  "&:hover": {
    color: theme.palette.secondary.main,
  },
});

const linkStyle = (theme: Theme): SxProps<Theme> => ({
  textTransform: "none",
  textDecoration: "underline",
  border: "none",
  padding: 0,
  minWidth: "auto",
  backgroundColor: "transparent",
  color: theme.palette.primary.main,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "underline",
    color: theme.palette.tertiary.main,
  },
});

const containedStyle = (
  theme: Theme,
  color: ButtonProps["color"],
): SxProps<Theme> =>
  color === "error"
    ? {
        border: `2px solid ${theme.palette.error.main}`,
        color: theme.palette.background.default,
        backgroundColor: theme.palette.error.main,
        "&:hover": {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        },
      }
    : color === "primary"
      ? {
          border: `2px solid ${theme.palette.primary.main}`,
          color: theme.palette.background.default,
          backgroundColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
          },
        }
      : color === "tertiary"
        ? {
            border: `2px solid ${theme.palette.tertiary.main}`,
            color: theme.palette.background.default,
            backgroundColor: theme.palette.tertiary.main,
            "&:hover": {
              backgroundColor: theme.palette.tertiary.light,
              color: theme.palette.tertiary.main,
            },
          }
        : {};

const getVariantStyle = (
  variant: "outlined" | "contained" | "appbar" | "link",
  theme: Theme,
  color: ButtonProps["color"],
  disabled: boolean,
) => {
  if (variant === "appbar") {
    return {
      ...commonStyle(),
      ...(disabled ? disabledStyle(theme) : appbarStyle(theme)),
    };
  }
  if (variant === "link") {
    return {
      ...commonStyle(),
      ...(disabled ? disabledStyle(theme) : linkStyle(theme)),
    };
  }
  if (variant === "outlined") {
    return {
      ...commonStyle(),
      ...(disabled ? disabledStyle(theme) : outlinedStyle(theme, color)),
    };
  }
  if (variant === "contained") {
    return {
      ...commonStyle(),
      ...(disabled ? disabledStyle(theme) : containedStyle(theme, color)),
    };
  }
  return {};
};

/**
 * Custom button component
 *
 * Reusable button component based on Material-UI with custom styling and behavior.
 * Supports different variants (outlined, contained, appbar, link), types, and interactive states.
 *
 * @param props - Component props
 * @returns The rendered button component
 */
const Button = ({
  children,
  type = "button",
  variant,
  onClick,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
  startIcon,
  endIcon,
  sx,
  color = "tertiary",
}: ButtonProps) => {
  const theme = useTheme();

  const variantStyles = useMemo(
    () => getVariantStyle(variant, theme, color, disabled),
    [variant, theme, color, disabled],
  );

  const defaultStyles: SxProps<Theme> = useMemo(
    () => ({
      padding: "10px 20px",
    }),
    [],
  );

  const sxStyles: SxProps<Theme> = useMemo(
    () => [variantStyles, defaultStyles, sx].filter(Boolean) as SxProps<Theme>,
    [variantStyles, defaultStyles, sx],
  );

  return (
    // eslint-disable-next-line front-end/use-conventional-component
    <MuiButton
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={sxStyles}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
