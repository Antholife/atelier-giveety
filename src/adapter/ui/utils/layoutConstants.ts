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
 * Compensates for fixed header and stepper heights to prevent content
 * from being hidden behind fixed navigation elements.
 *
 * Values are calculated based on:
 * - Mobile: header height (70px) + stepper height (auto, ~80px) ≈ 150px
 * - Desktop: header height (90px) + stepper height (92px) = 182px
 */
export const MAIN_CONTENT_PADDING_TOP = {
  /** Mobile view: header (70px) + stepper (auto, ~80px) = ~150px */
  MOBILE: "150px",
  /** Desktop view: header (90px) + stepper (92px) = 182px */
  DESKTOP: "182px",
} as const;
