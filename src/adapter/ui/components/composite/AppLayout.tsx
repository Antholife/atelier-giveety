"use client";

import { MAIN_CONTENT_PADDING_TOP } from "@/adapter/ui/utils/layoutConstants";
import { useIsMobile } from "@/adapter/ui/utils/mediaQueries";
import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Footer } from "../basic/common";
import Header from "./common/Header";

/**
 * Props for AppLayout component
 *
 * @property children - React children components to render
 */
type AppLayoutProps = {
  children: ReactNode;
};

/**
 * Application layout wrapper component
 *
 * Provides the main layout structure for the application including:
 * - Header navigation at the top
 * - Main content area with responsive padding
 * - Footer at the bottom
 *
 * Features:
 * - Responsive design with mobile/desktop padding adjustments
 * - Full-height layout with flexbox
 *
 * @param props - Component props
 * @returns The rendered application layout component
 */
export default function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();

  const containerSx = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      minHeight: "100vh",
    }),
    [],
  );

  const mainSx = useMemo(
    () => ({
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      paddingTop: isMobile
        ? MAIN_CONTENT_PADDING_TOP.MOBILE
        : MAIN_CONTENT_PADDING_TOP.DESKTOP,
    }),
    [isMobile],
  );

  return (
    <Box sx={containerSx}>
      <Header />
      <Box component="main" sx={mainSx}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
