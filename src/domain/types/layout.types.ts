import type { ReactNode } from "react";

/**
 * Props for the root layout (app/[locale]/layout).
 *
 * Matches the Next.js App Router layout contract for the [locale] segment.
 */
export interface RootLayoutProps {
  /** Child route segments and pages */
  children: ReactNode;
  /** Route params — locale is resolved from the [locale] segment */
  params: Promise<{ locale: string }>;
}
