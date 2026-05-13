/**
 * Layout constants for the application
 *
 * Defines spacing and sizing constants used across the UI layout components.
 * These constants ensure consistent spacing that accounts for fixed header
 * and navigation elements.
 */

/**
 * Main content padding top values
 *
 * Compensates for the fixed AppBar height so content is not hidden behind
 * the header. Values match the header height defined in `Header.tsx`.
 */
export const MAIN_CONTENT_PADDING_TOP = {
  /** Mobile view: AppBar height = 70px */
  MOBILE: "70px",
  /** Desktop view: AppBar height = 90px */
  DESKTOP: "90px",
} as const;
