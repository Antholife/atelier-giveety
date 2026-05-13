/**
 * Internationalized routing configuration
 *
 * Defines the routing configuration for next-intl with supported locales
 * (French and English) and the default locale. The single page of the app
 * is served at the locale root (`/[locale]`), so no pathname translation
 * is required.
 */
import { defineRouting } from "next-intl/routing";

export const i18nRouting = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
});
