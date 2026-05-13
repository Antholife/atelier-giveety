"use client";

import { Box, Typography, useTheme } from "@mui/material";
import type { ReactNode } from "react";

type WireframeSectionLabelProps = {
  children: ReactNode;
};

export default function WireframeSectionLabel({
  children,
}: WireframeSectionLabelProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <Typography
        component="span"
        sx={{
          fontSize: 10,
          color: "primary.main",
          lineHeight: 1,
        }}
      >
        ◆
      </Typography>
      <Typography
        variant="overline"
        sx={{
          letterSpacing: "0.14em",
          fontWeight: 700,
          color: "primary.main",
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
