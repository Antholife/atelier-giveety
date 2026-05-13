"use client";

import { Tooltip, TooltipProps, useTheme } from "@mui/material";
import type { ReactElement } from "react";
import { useMemo } from "react";

/**
 * Props for CustomTooltip component
 *
 * @property title - The tooltip text content
 * @property children - The child element that triggers the tooltip
 * @property placement - Tooltip placement (default: "top")
 * @property arrow - Whether to show an arrow (default: true)
 * @property variant - Color variant (default: "primary")
 */
type CustomTooltipProps = {
  title: string;
  children: ReactElement;
  placement?: TooltipProps["placement"];
  arrow?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
};

/**
 * Custom tooltip component
 *
 * A reusable tooltip component with consistent styling across the application.
 * Supports primary, secondary, and tertiary color variants with the app theme font family.
 *
 * @param props - Component props
 * @returns The rendered custom tooltip component
 */
export default function CustomTooltip({
  title,
  children,
  placement = "top",
  arrow = true,
  variant = "primary",
}: CustomTooltipProps) {
  const theme = useTheme();

  const variantStyles = useMemo(() => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.background.default,
          "& .MuiTooltip-arrow": {
            color: theme.palette.secondary.main,
          },
        };
      case "tertiary":
        return {
          backgroundColor: theme.palette.tertiary.main,
          color: theme.palette.background.default,
          "& .MuiTooltip-arrow": {
            color: theme.palette.tertiary.main,
          },
        };
      case "primary":
      default:
        return {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.background.default,
          "& .MuiTooltip-arrow": {
            color: theme.palette.primary.main,
          },
        };
    }
  }, [variant, theme]);

  return (
    <Tooltip
      title={title}
      arrow={arrow}
      placement={placement}
      slotProps={{
        tooltip: {
          sx: {
            ...variantStyles,
            fontFamily: theme.typography.fontFamily,
            fontSize: "14px",
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
