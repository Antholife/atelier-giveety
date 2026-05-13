/**
 * Internationalized routing configuration
 *
 * Defines routing configuration for next-intl with support for:
 * - Multiple locales (French and English)
 * - Dynamic pathname generation based on translations
 * - Slugified URLs for SEO-friendly paths
 * - Nested route support with dynamic segments
 */
import { slugify } from "@/domain/services";
import { RouteItem, RouteKey, routeKeys } from "@/infra/routing";
import { defineRouting } from "next-intl/routing";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

/**
 * Route translations mapping
 *
 * Maps route keys to their translated titles and descriptions
 * for both supported locales.
 */
const routeTranslations: Record<
  "fr" | "en",
  Record<RouteKey, { title: string; description: string }>
> = {
  fr: fr.pages,
  en: en.pages,
};

/**
 * Pathname tuple type for route generation
 *
 * Represents a route path with its localized pathnames.
 * The first element is the route key path, the second is an object
 * containing the localized slugified pathnames for each locale.
 */
type PathnameTuple = [string, { fr: string; en: string }];

/**
 * Generates pathnames for routes recursively
 *
 * Creates localized pathnames for all routes in the routing configuration.
 * Handles nested routes and dynamic segments by recursively processing
 * route items and their children. Each route's title is slugified and
 * combined with parent paths to create SEO-friendly URLs.
 *
 * @param items - Array of route items to process
 * @param parentPath - Parent path for nested routes (default: "")
 * @param parentSlugs - Parent slugs for nested routes in both locales (default: empty)
 * @returns Array of pathname tuples mapping route keys to localized pathnames
 */
function generatePathnames<T extends readonly RouteItem[]>(
  items: T,
  parentPath = "",
  parentSlugs = { fr: "", en: "" },
): PathnameTuple[] {
  let entries: PathnameTuple[] = [];

  for (const item of items) {
    const isObject = typeof item !== "string";
    const key = isObject ? item.name : item;

    const currentPath = parentPath ? `${parentPath}/${key}` : key;

    const routeKey = key as RouteKey;
    const currentSlugs = {
      fr: parentSlugs.fr
        ? `${parentSlugs.fr}/${slugify(routeTranslations.fr[routeKey].title)}`
        : `/${slugify(routeTranslations.fr[routeKey].title)}`,
      en: parentSlugs.en
        ? `${parentSlugs.en}/${slugify(routeTranslations.en[routeKey].title)}`
        : `/${slugify(routeTranslations.en[routeKey].title)}`,
    };

    entries.push([`/${currentPath}`, currentSlugs]);

    if (isObject && item.children?.length) {
      const childrenEntries = generatePathnames(
        item.children,
        currentPath,
        currentSlugs,
      );
      entries = entries.concat(childrenEntries);
    }
  }

  return entries;
}

/**
 * Generated pathnames for all routes
 *
 * Pathnames are generated from the route configuration by slugifying
 * the translated route titles. This creates SEO-friendly URLs that
 * reflect the content in the user's language.
 */
const pathnamesArray = generatePathnames(routeKeys);
const pathnames = Object.fromEntries(pathnamesArray);

/**
 * Internationalized routing configuration
 *
 * Defines the routing configuration for next-intl with:
 * - Supported locales: French (fr) and English (en)
 * - Default locale: French (fr)
 * - Generated pathnames for all routes based on translated titles
 *
 * This configuration is used by:
 * - Navigation utilities (Link, redirect, useRouter)
 * - Request configuration (locale detection)
 * - Next.js routing system
 *
 * @example
 * ```typescript
 * // The route "atelier-ui-ux" will generate:
 * // - French: "/fr/atelier-ui-ux"
 * // - English: "/en/ui-ux-lab"
 * ```
 */
export const i18nRouting = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  pathnames,
});
