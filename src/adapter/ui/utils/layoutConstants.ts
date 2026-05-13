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
 * the header. Matches Keycloak docker Giveety Navbar (mobile 50px, desktop 90px).
 */
export const MAIN_CONTENT_PADDING_TOP = {
  /** Mobile view: même hauteur que le header Keycloak Giveety docker (50px) */
  MOBILE: "50px",
  /** Desktop view: AppBar height = 90px */
  DESKTOP: "90px",
} as const;
