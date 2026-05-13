"use client";

import theme from "@/adapter/ui/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Client-side providers wrapper
 *
 * Sets up the Material-UI theme and applies the CSS baseline.
 * Add other client-side providers here if needed in the future.
 */
export default function ProvidersClient({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
