import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

/**
 * Vitest Configuration for Hexagonal Architecture (Clean React)
 *
 * Coverage organized by architectural layers:
 * - Domain: Business logic, entities, use cases
 * - Application: Hooks, state management, API clients
 * - Infrastructure: External services, API integration
 * - Presentation: Components, UI logic
 */
export default defineConfig({
  // Allow importing raw markdown files in tests (e.g., CHANGELOG.md)
  assetsInclude: ["**/*.md"],
  plugins: [react()] as any,
  test: {
    environment: "jsdom",
    globals: true,
    reporters: ["tree"],
    setupFiles: ["tests/setup.ts"],
    // Explicit test file patterns (optional - Vitest defaults would work too)
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/dist/**"],

    // Pool configuration for optimal performance with memory constraints
    // Using 'threads' is more memory-efficient than 'forks' and allows better parallelism
    pool: "threads",
    // Pool options (migrated from poolOptions in Vitest 4)
    maxWorkers: undefined, // 3 workers max: good balance between speed and memory (≈2-3GB per worker)
    isolate: true, // Isolate each test file in its own thread for stability

    // Test timeout configuration
    testTimeout: 10000, // 10s per test (reduce if tests are fast)

    // Coverage configuration aligned with PHPUnit standards
    coverage: {
      provider: "v8",

      // Multiple report formats for different uses
      reporter: [
        "text", // Console output
        "html", // Interactive HTML report
        "json", // Programmatic access
        "json-summary", // Quick summary
        "clover", // CI/CD integration
        "lcov", // GitLab/GitHub integration
        "cobertura", // Jenkins integration
      ],

      reportsDirectory: "../../var/coverage",

      // Thresholds - 80% minimum (WARNING mode)
      // WARNING mode: Shows alerts but doesn't fail build
      // Set autoUpdate: false for strict mode
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        autoUpdate: true, // WARNING mode
        perFile: false, // Global thresholds, not per file
      },

      // What to include - organized by hexagonal layers
      include: ["src/**/*.{ts,tsx}"],

      // What to exclude
      exclude: [
        // Test files
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "tests/**/*",

        // Next.js framework files (tested with E2E)
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/error.tsx",
        "src/app/**/not-found.tsx",
        "src/proxy.ts",

        // Type definitions
        "src/types/**/*.d.ts",
        "src/**/*.d.ts",

        // Configuration files
        "src/eslint-rules/**/*",
        "src/**/config.{ts,tsx}",

        // Build artifacts
        "**/node_modules/**",
        "**/.next/**",
        "**/dist/**",
        "**/build/**",

        // Storybook
        "src/**/*.stories.{ts,tsx}",
      ],

      // Skip full coverage for certain patterns
      skipFull: false,

      // Clean coverage directory before each run
      clean: true,
    },
  },
  resolve: {
    alias: {
      // Specific aliases for index files FIRST - they must come before general ones
      // Remove .ts extension to let Vite resolve automatically
      "@/adapter/ui/components/basic": path.resolve(
        __dirname,
        "src/adapter/ui/components/basic",
      ),
      "@/adapter/ui/components/composite": path.resolve(
        __dirname,
        "src/adapter/ui/components/composite",
      ),
      // General aliases - @/adapter must come after specific ones
      "@": path.resolve(__dirname, "src"),
      "@/adapter": path.resolve(__dirname, "src/adapter"),
      "@/app": path.resolve(__dirname, "src/app"),
      "@/domain": path.resolve(__dirname, "src/domain"),
      "@/infra": path.resolve(__dirname, "src/infra"),
      // Mock next/navigation for testing
      "next/navigation": path.resolve(
        __dirname,
        "tests/mocks/next-navigation.ts",
      ),
      // Mock next-intl/navigation to prevent it from importing next/navigation
      "next-intl/navigation": path.resolve(
        __dirname,
        "tests/mocks/next-intl-navigation.ts",
      ),
      // Mock next/image for component tests
      "next/image": path.resolve(__dirname, "tests/mocks/next-image.tsx"),
    },
  },
});
