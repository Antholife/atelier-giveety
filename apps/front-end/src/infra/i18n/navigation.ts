/**
 * Internationalized navigation utilities
 *
 * Lightweight wrappers around Next.js navigation APIs that consider
 * the routing configuration for internationalized URLs. These utilities
 * automatically handle locale prefixes and ensure navigation works
 * correctly with the i18n routing setup.
 *
 * Provides:
 * - Link: Internationalized Link component (replaces next/link)
 * - redirect: Internationalized redirect function (replaces next/navigation redirect)
 * - usePathname: Hook for current pathname with locale awareness
 * - useRouter: Hook for router with locale support (replaces next/navigation useRouter)
 * - getPathname: Function to get pathname with locale from server components
 */
import { createNavigation } from "next-intl/navigation";
import { i18nRouting } from "./routing";

/**
 * Internationalized navigation utilities
 *
 * Created using next-intl's createNavigation function, which wraps Next.js
 * navigation APIs to automatically handle locale prefixes in URLs.
 *
 * @example
 * ```typescript
 * // Client component
 * import { Link, useRouter } from "@/infra/i18n";
 *
 * function MyComponent() {
 *   const router = useRouter();
 *   return <Link href="/atelier-ui-ux">Go to UI/UX lab</Link>;
 * }
 * ```
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(i18nRouting);
