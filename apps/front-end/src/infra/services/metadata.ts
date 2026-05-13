/**
 * Infrastructure metadata generation service
 *
 * Server-side metadata generation utilities for Next.js pages.
 * This service handles the integration between domain formatting utilities
 * and infrastructure routing/i18n systems.
 */
import { capitalize } from "@/domain/services";
import { RouteKey } from "@/infra/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Creates metadata for a page using internationalized translations
 *
 * Generates Next.js Metadata object with translated title and description.
 * The title is capitalized and appended with " - Giveety" for branding consistency.
 * Translations are fetched from the "pages" namespace in the i18n configuration.
 *
 * @param key - Route key to generate metadata for (e.g., "atelier-ui-ux")
 * @returns Promise resolving to Metadata object with:
 *   - `title`: Capitalized translated title with " - Giveety" suffix
 *   - `description`: Translated description from the pages namespace
 */
export async function createMetadataForPage(key: RouteKey): Promise<Metadata> {
  const t = await getTranslations("pages");
  return {
    title: `${capitalize(t(`${key}.title`))} - Giveety`,
    description: t(`${key}.description`),
  };
}
