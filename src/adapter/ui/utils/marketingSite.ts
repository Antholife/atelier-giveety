/**
 * URLs du site marketing Giveety (header / footer).
 * Surcharge : NEXT_PUBLIC_MARKETING_BASE_URL (sans slash final), ex. prod `https://giveety.org`.
 */
export function getMarketingSiteBase(): string {
  const raw =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_MARKETING_BASE_URL : undefined;
  return (raw ?? "https://staging.giveety.org").replace(/\/+$/, "");
}

/** Chemin absolu sur le domaine marketing, sans préfixe locale (comportement KC). */
export function marketingAbsolute(path: string): string {
  const base = getMarketingSiteBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Chemin avec segment locale /{locale}/… (glossaire, CGU, etc.). */
export function marketingWithLocale(locale: string, path: string): string {
  const base = getMarketingSiteBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${locale}${p === "/" ? "" : p}`;
}
