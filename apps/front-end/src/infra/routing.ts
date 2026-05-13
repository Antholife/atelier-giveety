/**
 * Application routing configuration
 *
 * Defines the complete routing structure for the application using a hierarchical
 * route configuration. This module provides type-safe route keys that are used
 * throughout the application for navigation, metadata generation, and i18n routing.
 *
 * The routing structure supports nested routes, allowing for hierarchical
 * organization of application routes. Route keys are extracted as a union type
 * for type safety.
 */

/**
 * Route item type definition
 *
 * Represents either a simple string route or a nested route object with children
 * for hierarchical routing. This allows building complex route structures
 * while maintaining type safety.
 *
 * @example
 * ```typescript
 * // Simple route
 * "atelier-ui-ux"
 *
 * // Nested route
 * {
 *   name: "parent",
 *   children: [
 *     { name: "child", children: ["leaf"] }
 *   ]
 * }
 * ```
 */
export type RouteItem =
  | string
  | {
      readonly name: string;
      readonly children: readonly RouteItem[];
    };

/**
 * Complete route configuration
 *
 * Defines the hierarchical structure of all application routes.
 * This configuration is used to:
 * - Generate type-safe route keys
 * - Create i18n pathnames
 * - Generate metadata for pages
 *
 * The structure represents the actual URL hierarchy.
 */
export const routeKeys = ["atelier-ui-ux"] as const;

/**
 * Recursive route key type generator
 *
 * Generates a union type of all valid route keys from the route configuration
 * by recursively traversing the route structure. This utility type extracts
 * all route names (both from objects and strings) into a single union type.
 *
 * @template T - The route items array type
 */
type RecursiveRouteKey<T extends readonly RouteItem[]> =
  T[number] extends infer Item
    ? Item extends string
      ? Item
      : Item extends { readonly name: infer N; readonly children: infer C }
        ? N | (C extends readonly RouteItem[] ? RecursiveRouteKey<C> : never)
        : never
    : never;

/**
 * Route key type
 *
 * Union type of all valid route keys extracted from the route configuration.
 * This type is used throughout the application for type-safe route references.
 *
 * Currently includes: "atelier-ui-ux"
 *
 * @example
 * ```typescript
 * const route: RouteKey = "atelier-ui-ux"; // ✅ Valid
 * const invalid: RouteKey = "invalid"; // ❌ Type error
 * ```
 */
export type RouteKey = RecursiveRouteKey<typeof routeKeys>;
