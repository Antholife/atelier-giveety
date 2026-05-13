/**
 * Next-intl request configuration
 *
 * Configures how next-intl handles requests and locale detection on the server side.
 * Automatically loads the appropriate locale messages based on the request URL.
 * This configuration is used by next-intl to determine which locale to use and
 * which translation messages to load for each request.
 */
import { resolveLocale } from "@/domain/services";
import { getRequestConfig } from "next-intl/server";
import { i18nRouting } from "./routing";

/**
 * Request configuration for next-intl
 *
 * Handles server-side locale detection and message loading:
 * - Extracts the requested locale from the URL segment (typically `[locale]`)
 * - Validates the requested locale against supported locales (via domain resolveLocale)
 * - Falls back to the default locale if the requested locale is not supported
 * - Dynamically imports and returns the appropriate locale messages
 *
 * @param params - Configuration parameters from next-intl
 * @param params.requestLocale - The locale requested in the URL (async)
 * @returns Promise resolving to configuration object with:
 *   - `locale`: The validated locale to use
 *   - `messages`: The imported translation messages for the locale
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = resolveLocale(
    requested,
    i18nRouting.locales,
    i18nRouting.defaultLocale,
  );

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
