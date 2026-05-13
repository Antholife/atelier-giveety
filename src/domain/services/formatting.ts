/**
 * Formatting utilities for domain services
 *
 * Provides utility functions for string and date formatting operations
 * used throughout the application.
 */

/**
 * Capitalizes the first letter of a string
 *
 * Safely handles null, undefined, or empty strings by returning an empty string.
 * Only the first character is capitalized; the rest of the string remains unchanged.
 *
 * @param str - String to capitalize (can be null or undefined)
 * @returns Capitalized string or empty string if input is falsy
 *
 * @example
 * ```typescript
 * capitalize("hello") // "Hello"
 * capitalize("HELLO") // "HELLO"
 * capitalize(null) // ""
 * capitalize(undefined) // ""
 * ```
 */
export function capitalize(str: string | null | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a date string to a localized date string
 *
 * Converts an ISO date string to a human-readable format using the specified locale.
 * The output format includes the day, full month name, and year.
 *
 * @param dateString - ISO date string to format (e.g., "2024-01-12")
 * @param locale - Locale string for formatting (e.g., "fr", "en", "en-US")
 * @returns Formatted date string in the specified locale (e.g., "12 janvier 2024" for "fr")
 *
 * @example
 * ```typescript
 * formatDate("2024-01-12", "fr") // "12 janvier 2024"
 * formatDate("2024-01-12", "en") // "January 12, 2024"
 * formatDate("2024-01-12", "en-US") // "January 12, 2024"
 * ```
 */
export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Converts a string to a URL-friendly slug
 *
 * Transforms a string into a URL-safe format by:
 * - Normalizing Unicode characters (removing accents)
 * - Converting to lowercase
 * - Replacing spaces with hyphens
 * - Removing special characters
 *
 * @param str - String to slugify
 * @returns URL-friendly slug (e.g., "Design Kit" → "design-kit")
 *
 * @example
 * ```typescript
 * slugify("Design Kit UI UX") // "design-kit-ui-ux"
 * slugify("Événements") // "evenements"
 * ```
 */
export function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}
