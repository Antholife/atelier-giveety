/**
 * Domain services module
 *
 * Centralized exports for all domain service utilities.
 * This module provides:
 * - Formatting utilities: String, date, and slug formatting functions
 * - Locale resolution: resolveLocale for request locale fallback
 *
 * @example
 * ```typescript
 * import { capitalize, formatDate, slugify, resolveLocale } from "@/domain/services";
 * ```
 */

export * from "./formatting";
export * from "./locale";
