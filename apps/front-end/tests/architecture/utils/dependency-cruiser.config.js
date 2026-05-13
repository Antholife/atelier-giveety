/**
 * Dependency Cruiser Configuration - Hexagonal Architecture Validation
 *
 * Validates that the frontend follows hexagonal architecture principles:
 * - Domain: Pure business logic (no dependencies on other layers)
 * - App: Application logic, hooks (depends on Domain only)
 * - Infra: Infrastructure implementations (depends on Domain, App)
 * - Adapter: UI/Presentation layer (depends on all layers)
 *
 * Architecture Flow:
 * Domain ← App ← Infra ← Adapter
 *   ↓       ↓      ↓        ↓
 *  (can be used by all layers)
 *
 * @see https://github.com/sverweij/dependency-cruiser
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /* ============================================================================
     * HEXAGONAL ARCHITECTURE RULES - Domain Layer
     * ============================================================================
     * Domain layer should NOT depend on any other layer
     * Domain = Pure TypeScript, no React, no Next.js, no external frameworks
     */
    {
      name: "domain-no-app",
      comment: "Domain layer should not depend on App layer",
      severity: "error",
      from: { path: "^src/domain" },
      to: { path: "^src/app" },
    },
    {
      name: "domain-no-infra",
      comment: "Domain layer should not depend on Infrastructure layer",
      severity: "error",
      from: { path: "^src/domain" },
      to: { path: "^src/infra" },
    },
    {
      name: "domain-no-adapter",
      comment: "Domain layer should not depend on Adapter/Presentation layer",
      severity: "error",
      from: { path: "^src/domain" },
      to: { path: "^src/adapter" },
    },
    {
      name: "domain-no-react",
      comment: "Domain layer should not use React (pure TypeScript only)",
      severity: "error",
      from: { path: "^src/domain" },
      to: { path: "^(react|react-dom)$" },
    },
    {
      name: "domain-no-nextjs",
      comment: "Domain layer should not use Next.js",
      severity: "error",
      from: { path: "^src/domain" },
      to: { path: "^(next|next-intl)$" },
    },
    {
      name: "domain-no-mui",
      comment: "Domain layer should not use Material-UI or UI libraries",
      severity: "error",
      from: { path: "^src/domain" },
      to: { path: "^@mui" },
    },

    /* ============================================================================
     * HEXAGONAL ARCHITECTURE RULES - App Layer
     * ============================================================================
     * App layer may depend on Domain, but NOT on Infrastructure or Adapter
     * App = Hooks, business logic orchestration
     */
    {
      name: "app-no-infra",
      comment:
        "App layer should not directly depend on Infrastructure layer (use Domain interfaces)",
      severity: "error",
      from: { path: "^src/app" },
      to: { path: "^src/infra" },
    },
    {
      name: "app-no-adapter",
      comment:
        "App layer should not depend on Adapter/Presentation layer (UI components)",
      severity: "error",
      from: { path: "^src/app" },
      to: { path: "^src/adapter" },
    },
    {
      name: "app-no-react-components",
      comment:
        "App hooks should not import React components (use Domain/App logic only)",
      severity: "error",
      from: { path: "^src/app" },
      to: { path: "^src/adapter/ui" },
    },
    {
      name: "app-no-mui",
      comment: "App layer should not use Material-UI (presentation concern)",
      severity: "error",
      from: { path: "^src/app" },
      to: { path: "^@mui" },
    },

    /* ============================================================================
     * HEXAGONAL ARCHITECTURE RULES - Infrastructure Layer
     * ============================================================================
     * Infrastructure implements Domain interfaces, may use App hooks
     * Infrastructure should NOT depend on Adapter/Presentation
     */
    {
      name: "infra-no-adapter",
      comment:
        "Infrastructure layer should not depend on Adapter/Presentation layer (UI)",
      severity: "error",
      from: { path: "^src/infra" },
      to: { path: "^src/adapter" },
    },
    {
      name: "infra-no-react-components",
      comment:
        "Infrastructure should not use React UI components (only context/providers if needed)",
      severity: "warn",
      from: { path: "^src/infra/api" },
      to: { path: "^src/adapter/ui/components" },
    },
    {
      name: "infra-no-mui",
      comment: "Infrastructure API layer should not use Material-UI",
      severity: "error",
      from: { path: "^src/infra/api" },
      to: { path: "^@mui" },
    },

    /* ============================================================================
     * HEXAGONAL ARCHITECTURE RULES - Adapter Layer
     * ============================================================================
     * Adapter may use all layers (Domain, App, Infra)
     * Adapter = UI/Presentation layer, React components
     */
    {
      name: "adapter-ui-direct-infra-api",
      comment:
        "Adapter UI components should use App hooks, not Infra API directly",
      severity: "warn",
      from: { path: "^src/adapter/ui" },
      to: { path: "^src/infra/api" },
    },

    /* ============================================================================
     * CIRCULAR DEPENDENCY RULES
     * ============================================================================
     */
    {
      name: "no-circular",
      comment: "No circular dependencies allowed between any modules",
      severity: "error",
      from: {},
      to: { circular: true },
    },

    /* ============================================================================
     * NEXT.JS APP ROUTER RULES
     * ============================================================================
     * App router pages can import from all layers (they orchestrate)
     */
    {
      name: "app-router-no-domain-direct",
      comment: "App router pages should use App hooks, not Domain directly",
      severity: "warn",
      from: { path: "^src/app/.*/(page|layout)\\.(tsx|ts)$" },
      to: { path: "^src/domain" },
    },

    /* ============================================================================
     * TEST ISOLATION RULES
     * ============================================================================
     */
    {
      name: "test-no-nextjs-pages",
      comment:
        "Test files should not import Next.js page/layout components directly",
      severity: "warn",
      from: { path: "^tests/" },
      to: { path: "^src/app/.*/(page|layout)\\.(tsx|ts)$" },
    },

    /* ============================================================================
     * DEPRECATED PACKAGES
     * ============================================================================
     */
    {
      name: "no-deprecated-packages",
      comment: "Do not use deprecated packages",
      severity: "error",
      from: {},
      to: { path: "^(moment|request|node-uuid)" },
    },
  ],

  options: {
    /* Which modules to skip */
    doNotFollow: {
      path: [
        "node_modules",
        ".next",
        "dist",
        "build",
        "coverage",
        "var",
        "tests",
      ],
      dependencyTypes: ["npm-dev", "npm-optional", "npm-peer", "npm-bundled"],
    },

    /* Which modules to include in validation */
    includeOnly: {
      path: "^src",
    },

    /* Focus validation on hexagonal directories */
    focus: {
      path: ["^src/domain", "^src/app", "^src/infra", "^src/adapter"],
    },

    /* Module resolution */
    tsPreCompilationDeps: false,

    /* Enhanced dependency resolution */
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
      mainFields: ["module", "main", "types", "typings"],
    },

    /* Reporting */
    reporterOptions: {
      dot: {
        collapsePattern: "^src/[^/]+",
      },
      archi: {
        collapsePattern: "^src/([^/]+)",
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
