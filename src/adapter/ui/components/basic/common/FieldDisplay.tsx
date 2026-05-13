"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";

/**
 * Props for FieldDisplay component
 *
 * @property label - Label text to display above the value
 * @property value - Value text to display
 */
type FieldDisplayProps = {
  label: string;
  value: string;
};

/**
 * Field display component
 *
 * Displays a label and value in a vertical layout.
 * Used for showing read-only field information in forms and recap sections.
 *
 * @param props - Component props
 * @returns The rendered field display component
 */
function FieldDisplay({ label, value }: FieldDisplayProps) {
  const theme = useTheme();

  const labelSx = useMemo(
    () => ({
      fontSize: "14px",
      fontWeight: 500,
      color: theme.palette.text.secondary,
    }),
    [theme.palette.text.secondary],
  );

  const valueSx = useMemo(
    () => ({
      fontSize: "16px",
      fontWeight: 500,
      color: theme.palette.primary.main,
    }),
    [theme.palette.primary.main],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography sx={labelSx}>{label}</Typography>
      <Typography sx={valueSx}>{value}</Typography>
    </Box>
  );
}

export default FieldDisplay;
