/**
 * Infrastructure i18n module
 *
 * Centralized exports for all internationalization configuration and utilities.
 * This module provides:
 * - Navigation utilities: Internationalized Link, redirect, and router hooks
 * - Request configuration: Server-side locale detection and message loading
 * - Routing configuration: Locale-aware routing setup with pathname generation
 *
 * @example
 * ```typescript
 * import { Link, useRouter, i18nRouting } from "@/infra/i18n";
 * import getRequestConfig from "@/infra/i18n";
 * ```
 */

export {
  getPathname,
  Link,
  redirect,
  usePathname,
  useRouter,
} from "./navigation";
export { default as getRequestConfig } from "./request";
export { i18nRouting } from "./routing";
