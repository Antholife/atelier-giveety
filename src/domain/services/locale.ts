/**
 * Locale resolution utilities
 *
 * Pure logic for resolving which locale to use from a request,
 * without depending on next-intl or any infra.
 */

/**
 * Resolves the locale to use.
 * Returns requested if it is in supported locales, otherwise defaultLocale.
 *
 * @param requested - Locale from the URL (e.g. `[locale]` segment)
 * @param locales - Supported locale codes
 * @param defaultLocale - Fallback when requested is invalid or missing
 * @returns Resolved locale
 */
export function resolveLocale(
  requested: string | undefined,
  locales: readonly string[],
  defaultLocale: string,
): string {
  if (requested == null) return defaultLocale;
  return locales.includes(requested) ? requested : defaultLocale;
}
