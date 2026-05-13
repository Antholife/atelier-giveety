/* eslint-disable no-console */

/**
 * Test Coverage Rules for Next.js Frontend
 * Ensures every source file in hexagonal layers has a corresponding test
 *
 * Intelligent detection: Analyzes file content to determine test type (Unit vs Functional)
 *
 * Rules:
 * - Domain layer → ALWAYS Unit tests (pure business logic)
 * - App layer → Unit OR Functional (based on React usage)
 * - Adapter layer → Unit OR Functional (based on React usage)
 * - Infra layer → Unit OR Functional (based on fetch/API usage)
 *
 * Detection logic:
 * - Unit: Pure TypeScript functions (no React, no fetch, no DOM)
 * - Functional: React components/hooks, API clients with fetch, DOM interactions
 */

import { readFileSync } from "fs";
import path from "path";
import { FileSystemUtils } from "../utils/FileSystemUtils.mjs";

// ANSI colors
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BLUE = "\x1b[34m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

export class TestCoverageRules {
  constructor(projectRoot) {
    this.name = "Test Coverage";
    this.projectRoot = projectRoot;
    this.violations = [];
    this.checked = 0;
    this.stats = {
      unit: 0,
      functional: 0,
    };
    this.layerSummaries = [];
  }

  /**
   * Analyze file content to determine test type (Unit vs Functional)
   *
   * Detection rules:
   * - Domain → ALWAYS Unit (pure business logic)
   * - Files with React (imports, useState, useEffect, JSX) → Functional
   * - Files with fetch/API calls → Functional
   * - Files with DOM APIs (document, window) → Functional
   * - Pure TypeScript functions → Unit
   */
  detectTestType(sourceFile, layerName) {
    // Domain is ALWAYS Unit (pure business logic)
    if (layerName === "domain") {
      return "Unit";
    }

    // Adapter pure logic (no React UI) → Unit
    const srcPath = FileSystemUtils.joinPath(this.projectRoot, "src");
    const relativeFromSrc = FileSystemUtils.getRelativePath(
      srcPath,
      sourceFile,
    );

    // EXCLUDES/SPECIAL CASES
    if (
      relativeFromSrc.includes("adapter" + path.sep + "ui" + path.sep + "theme")
    )
      return "Unit";
    if (
      relativeFromSrc.includes("adapter" + path.sep + "ui" + path.sep + "utils")
    )
      return "Unit";
    if (relativeFromSrc.includes("infra" + path.sep + "i18n")) return "Unit";
    if (relativeFromSrc.includes("infra" + path.sep + "services"))
      return "Unit";
    if (relativeFromSrc.includes("infra" + path.sep + "routing")) return "Unit";

    try {
      const content = readFileSync(sourceFile, "utf-8");

      // Check for React usage
      const hasReactImport = /import.*from\s+['"]react['"]/m.test(content);
      const hasReactHook =
        /(useState|useEffect|useContext|useRef|useMemo|useCallback|useReducer)/.test(
          content,
        );
      // JSX: <Component, <ComponentName, </Component, />, etc.
      const hasJSX =
        /<[A-Z][a-zA-Z0-9_]*|<\/[A-Z][a-zA-Z0-9_]*|<\/[a-z]+[A-Z]|\/>/.test(
          content,
        );
      const hasReactComponent =
        /export\s+(default\s+)?(function|const)\s+\w+\s*(\(|:|\()/.test(
          content,
        );

      // Check for API/network usage
      const hasFetch = /\bfetch\s*\(/.test(content);
      const hasUseApi = /use-api-(get|post|patch|mutation)/.test(content);
      const hasApiClient = /api\.(get|post|patch)/.test(content);

      // Check for DOM APIs (but exclude type declarations)
      const hasDOM =
        /(document\.|window\.|localStorage|sessionStorage)/.test(content) &&
        !/\btype\s+\w+\s*=\s*/.test(content); // Exclude type declarations

      // Check for "use client" directive (Next.js client component)
      const hasUseClient = /^['"]use client['"]/.test(content);

      // Check for React imports from external libraries
      const hasReactLibs =
        /from\s+['"](@mui|react-dom|next\/image|next\/link)/.test(content);

      // Functional if any React/API/DOM usage detected
      if (
        hasReactImport ||
        hasReactHook ||
        hasJSX ||
        hasReactComponent ||
        hasFetch ||
        hasUseApi ||
        hasApiClient ||
        hasDOM ||
        hasUseClient ||
        hasReactLibs
      ) {
        return "Functional";
      }

      // Otherwise, it's a pure TypeScript file → Unit
      return "Unit";
    } catch {
      // On error, default to Functional (safer assumption)
      console.warn(
        `${YELLOW}⚠️  Could not analyze ${sourceFile}, defaulting to Functional${RESET}`,
      );
      return "Functional";
    }
  }

  /**
   * Get expected test path for a source file
   */
  getExpectedTestPath(sourceFile, testType) {
    const srcPath = FileSystemUtils.joinPath(this.projectRoot, "src");
    const relativePath = FileSystemUtils.getRelativePath(srcPath, sourceFile);
    const parsed = FileSystemUtils.parsePath(relativePath);
    const testFileName = parsed.name + ".test" + parsed.ext;

    // Adapter ui/theme: tests live under tests/unit/theme/ (not adapter/ui/theme)
    // Normalize path separators to handle both Unix and Windows paths
    const normalizedPath = relativePath.replace(/\\/g, path.sep);
    const pathParts = normalizedPath.split(path.sep);
    if (
      pathParts[0] === "adapter" &&
      pathParts[1] === "ui" &&
      pathParts[2] === "theme" &&
      testType.toLowerCase() === "unit"
    ) {
      const restAfterTheme = pathParts.slice(2).join(path.sep);
      const restParsed = FileSystemUtils.parsePath(restAfterTheme);
      return FileSystemUtils.joinPath(
        this.projectRoot,
        "tests",
        "unit",
        restParsed.dir || "theme",
        restParsed.name + ".test" + restParsed.ext,
      );
    }

    // Default: tests/{unit|functional}/{layer}/{...subdirs}/{file.test.ext}
    const layer = pathParts[0];
    const subdirs = pathParts.slice(1, -1);
    return FileSystemUtils.joinPath(
      this.projectRoot,
      "tests",
      testType.toLowerCase(),
      layer,
      ...subdirs,
      testFileName,
    );
  }

  /**
   * Validate a single layer with intelligent test type detection
   */
  validateLayer(layerName, description) {
    const layerDir = FileSystemUtils.joinPath(
      this.projectRoot,
      "src",
      layerName,
    );

    if (!FileSystemUtils.directoryExists(layerDir)) {
      console.log(
        `${YELLOW}⚠️  ${description} not found (migration not started yet)${RESET}`,
      );
      return;
    }

    const sourceFiles = FileSystemUtils.getSourceFiles(layerDir);

    if (sourceFiles.length === 0) {
      console.log(`${YELLOW}⚠️  No source files in ${description} yet${RESET}`);
      return;
    }

    console.log(`\n${CYAN}${BOLD}Checking ${description}${RESET}`);
    console.log(`Found ${sourceFiles.length} source files`);

    const byTestType = { Unit: [], Functional: [] };

    for (const sourceFile of sourceFiles) {
      this.checked++;

      // Detect test type based on file content
      const testType = this.detectTestType(sourceFile, layerName);
      this.stats[testType.toLowerCase()]++;
      byTestType[testType].push({ file: sourceFile, testType });

      const testPath = this.getExpectedTestPath(sourceFile, testType);

      // Allow App hooks to be tested as Unit OR Functional
      // If Functional expected is missing, accept Unit path as an alternative
      if (!FileSystemUtils.fileExists(testPath)) {
        const srcPath = FileSystemUtils.joinPath(this.projectRoot, "src");
        const relativePath = FileSystemUtils.getRelativePath(
          srcPath,
          sourceFile,
        );
        const isAppHook =
          layerName === "app" &&
          relativePath.startsWith(`app${path.sep}hooks${path.sep}`);
        const hasUnitAlternative =
          testType === "Functional" &&
          isAppHook &&
          FileSystemUtils.fileExists(
            this.getExpectedTestPath(sourceFile, "Unit"),
          );

        if (hasUnitAlternative) {
          continue;
        }

        const relativeSource = FileSystemUtils.getRelativePath(
          this.projectRoot,
          sourceFile,
        );
        const relativeTest = FileSystemUtils.getRelativePath(
          this.projectRoot,
          testPath,
        );

        this.violations.push({
          file: relativeSource,
          expectedTest: relativeTest,
          layer: description,
          testType,
        });
      }
    }

    // Layer summary (for per-layer green/red output later)
    const missingForLayer = this.violations.filter(
      (v) => v.layer === description,
    );
    this.layerSummaries.push({
      layer: description,
      unit: byTestType.Unit.length,
      functional: byTestType.Functional.length,
      missing: missingForLayer,
    });

    // Print breakdown by test type
    if (byTestType.Unit.length > 0 || byTestType.Functional.length > 0) {
      console.log(
        `  ${BLUE}→${RESET} Unit: ${byTestType.Unit.length}, Functional: ${byTestType.Functional.length}`,
      );
    }
  }

  /**
   * Validate all hexagonal layers
   */
  validate() {
    console.log(`${CYAN}${BOLD}📋 TEST COVERAGE VALIDATION${RESET}`);
    console.log(`${"=".repeat(80)}\n`);

    console.log(
      `${CYAN}Validating test coverage for hexagonal architecture layers...${RESET}`,
    );
    console.log(
      `${CYAN}(Intelligent detection: Unit vs Functional based on file content)${RESET}\n`,
    );

    // Validate all layers (test type is auto-detected)
    this.validateLayer("domain", "Domain Layer");
    this.validateLayer("app", "App Layer");
    this.validateLayer("adapter", "Adapter Layer");
    this.validateLayer("infra", "Infra Layer");
  }

  /**
   * Get validation results
   */
  getResults() {
    return {
      checked: this.checked,
      violations: this.violations,
      passed: this.violations.length === 0,
    };
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`${BOLD}📊 TEST COVERAGE RESULTS${RESET}`);
    console.log(`${"=".repeat(80)}`);
    console.log(`\n${CYAN}Files checked: ${this.checked}${RESET}`);
    console.log(
      `  ${BLUE}→${RESET} Unit: ${this.stats.unit}, Functional: ${this.stats.functional}`,
    );

    if (this.checked === 0) {
      console.log(
        `\n${YELLOW}${BOLD}ℹ️  No hexagonal architecture files found yet${RESET}`,
      );
      console.log(
        `${YELLOW}This is expected if migration to hexagonal architecture hasn't started.${RESET}`,
      );
      console.log(
        `${GREEN}✅ Validation will enforce test coverage once migration begins.${RESET}`,
      );
      return true;
    }

    // Per-layer status output (green when good)
    if (this.layerSummaries.length > 0) {
      console.log(`\n${CYAN}${BOLD}Per-layer status:${RESET}`);
      for (const s of this.layerSummaries) {
        const ok = s.missing.length === 0 && s.unit + s.functional > 0;
        const icon = ok ? `${GREEN}✅${RESET}` : `${YELLOW}ℹ️${RESET}`;
        const status = ok ? `${GREEN}OK${RESET}` : `${YELLOW}CHECK${RESET}`;
        console.log(
          `  ${icon} ${s.layer}: ${status} (Unit: ${s.unit}, Functional: ${s.functional}, Missing: ${s.missing.length})`,
        );
      }
    }

    if (this.violations.length === 0) {
      console.log(
        `\n${GREEN}${BOLD}✅ All ${this.checked} files have corresponding tests!${RESET}`,
      );

      // Final summary: All passed
      const passRate = 100;
      console.log(`\n${"=".repeat(80)}`);
      console.log(`${BOLD}📊 FINAL SUMMARY${RESET}`);
      console.log(`${"=".repeat(80)}`);
      console.log(
        `\n${GREEN}✅ Passed: ${this.checked} file(s) with tests${RESET}`,
      );
      console.log(`   ${RED}❌ Failed: 0 file(s) missing tests${RESET}`);
      console.log(`   ${CYAN}📈 Coverage: ${passRate}%${RESET}`);
      console.log(
        `\n${GREEN}🎉 Perfect coverage! All files have tests.${RESET}`,
      );

      return true;
    }

    console.log(
      `\n${RED}${BOLD}❌ ${this.violations.length} file(s) missing tests${RESET}\n`,
    );

    // Group by layer and test type
    const byLayerAndType = {};
    for (const violation of this.violations) {
      const key = `${violation.layer}::${violation.testType}`;
      if (!byLayerAndType[key]) {
        byLayerAndType[key] = {
          layer: violation.layer,
          testType: violation.testType,
          violations: [],
        };
      }
      byLayerAndType[key].violations.push(violation);
    }

    // Print violations by layer and test type
    for (const { layer, testType, violations } of Object.values(
      byLayerAndType,
    )) {
      console.log(
        `\n${YELLOW}${BOLD}${layer} - ${testType} Tests (${violations.length} missing):${RESET}`,
      );

      for (const v of violations.slice(0, 5)) {
        console.log(`  ${RED}❌${RESET} ${v.file}`);
        console.log(`     ${CYAN}→${RESET} Expected: ${v.expectedTest}`);
      }

      if (violations.length > 5) {
        console.log(`  ${YELLOW}... and ${violations.length - 5} more${RESET}`);
      }
    }

    console.log(`\n${YELLOW}${BOLD}💡 Next Steps:${RESET}`);
    console.log(
      `  1. Create missing test files in tests/unit/ or tests/functional/`,
    );
    console.log(
      `  2. Follow the naming convention: SourceFile.ts → SourceFile.test.ts`,
    );
    console.log(
      `  3. Maintain directory structure: src/domain/services/ → tests/unit/domain/services/`,
    );
    console.log(`  4. Run: make test-frontend to verify`);

    console.log(`\n${CYAN}${BOLD}Intelligent Detection Logic:${RESET}`);
    console.log(`  • Domain → ALWAYS Unit (pure business logic)`);
    console.log(
      `  • App/Adapter/Infra → Unit if no React/fetch/DOM, Functional otherwise`,
    );
    console.log(
      `  • Detection based on file content analysis (React hooks, fetch, JSX, etc.)`,
    );

    // Final summary: Passed vs Failed
    const passed = this.checked - this.violations.length;
    const failed = this.violations.length;
    const passRate =
      this.checked > 0 ? Math.round((passed / this.checked) * 100) : 0;

    console.log(`\n${"=".repeat(80)}`);
    console.log(`${BOLD}📊 FINAL SUMMARY${RESET}`);
    console.log(`${"=".repeat(80)}`);
    console.log(`\n${GREEN}✅ Passed: ${passed} file(s) with tests${RESET}`);
    console.log(`   ${RED}❌ Failed: ${failed} file(s) missing tests${RESET}`);
    console.log(`   ${CYAN}📈 Coverage: ${passRate}%${RESET}`);

    if (failed > 0) {
      console.log(
        `\n${YELLOW}⚠️  ${failed} test file(s) need to be created${RESET}`,
      );
    } else {
      console.log(
        `\n${GREEN}🎉 Perfect coverage! All files have tests.${RESET}`,
      );
    }

    return false;
  }
}
