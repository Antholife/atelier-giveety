/**
 * Infrastructure metadata generation for Next.js.
 */
import { capitalize } from "@/domain/services";
import { RouteKey } from "@/infra/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Builds page metadata from the `pages` namespace and appends `- Giveety` to the title.
 *
 * @param key - Catalog key matching `routing.ts` RouteKey (e.g. `"design-kit"`)
 */
export async function createMetadataForPage(key: RouteKey): Promise<Metadata> {
  const t = await getTranslations("pages");
  return {
    title: `${capitalize(t(`${key}.title`))} - Giveety`,
    description: t(`${key}.description`),
  };
}
