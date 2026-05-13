/* eslint-disable no-console */
/**
 * Src Directory Rules for Next.js Frontend
 * Validates that src directory follows hexagonal architecture
 *
 * Equivalent to PHPArkitect's SrcDirectoryRules.php
 *
 * Rules:
 * - All source files should be in hexagonal structure:
 *   domain/, application/, infrastructure/, presentation/
 * - Old structure files (components/, lib/, context/, etc.) are flagged
 * - Provides migration guidance
 *
 * @see apps/api/tests/Architecture/Arkitect/SrcDirectoryRules.php
 */

import { FileSystemUtils } from "../utils/FileSystemUtils.mjs";

// ANSI colors
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

export class SrcDirectoryRules {
  constructor(projectRoot, quiet = false) {
    this.projectRoot = projectRoot;
    this.violations = [];
    this.checked = 0;
    this.quiet = quiet;

    this.name = "Hexagonal Architecture";
    // Hexagonal layers (allowed)
    this.excludedLayers = ["data_tmp"];
    this.hexagonalLayers = ["adapter", "domain", "app", "infra"];
  }

  /**
   * Check if a directory is part of hexagonal structure
   */
  isHexagonalLayer(dirName) {
    return (
      this.hexagonalLayers.includes(dirName) ||
      this.excludedLayers.includes(dirName)
    );
  }

  /**
   * Validate src directory structure
   */
  validate() {
    console.log(`${CYAN}${BOLD}🏗️  SRC DIRECTORY STRUCTURE VALIDATION${RESET}`);
    console.log(`${"=".repeat(80)}\n`);

    console.log(
      `${CYAN}Validating hexagonal architecture in src directory...${RESET}`,
    );

    const srcPath = FileSystemUtils.joinPath(this.projectRoot, "src");

    if (!FileSystemUtils.directoryExists(srcPath)) {
      console.log(`${RED}❌ src/ directory not found${RESET}`);
      return;
    }

    const directories = FileSystemUtils.getDirectories(srcPath);

    console.log(
      `${CYAN}Found ${directories.length} top-level directories in src/${RESET}\n`,
    );

    for (const dir of directories) {
      this.checked++;

      if (this.isHexagonalLayer(dir)) {
        console.log(`${GREEN}✓ ${dir}/ - Hexagonal layer (correct!)${RESET}`);
        continue;
      }
      // Unknown directory
      console.log(`${RED}✗ ${dir}/ - Unknown directory${RESET}`);
      this.violations.push({
        directory: dir,
        fileCount: 0,
        suggestion: "Review and categorize",
        isUnknown: true,
      });
    }
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
    console.log(`${BOLD}📊 SRC DIRECTORY STRUCTURE RESULTS${RESET}`);
    console.log(`${"=".repeat(80)}`);
    console.log(`\n${CYAN}Directories checked: ${this.checked}${RESET}`);

    if (this.checked === 0) {
      console.log(`\n${YELLOW}${BOLD}ℹ️  No src/ directory found${RESET}`);
      return true;
    }

    if (this.violations.length === 0) {
      console.log(
        `\n${GREEN}${BOLD}✅ All directories follow hexagonal architecture!${RESET}`,
      );
      console.log(
        `${GREEN}Perfect structure with: ${this.hexagonalLayers.join(", ")}${RESET}`,
      );
      return true;
    }

    const unknownViolations = this.violations.filter((v) => v.isUnknown);

    console.log(
      `\n${RED}${BOLD}❌ ${this.violations.length} directory(ies) violate hexagonal architecture${RESET}\n`,
    );

    // Unknown violations
    if (unknownViolations.length > 0) {
      console.log(
        `\n${YELLOW}${BOLD}Unknown Directories (${unknownViolations.length}):${RESET}`,
      );

      for (const v of unknownViolations) {
        console.log(`\n${RED}  ✗ ${v.directory}/${RESET}`);
        console.log(`    ${YELLOW}→ ${v.suggestion}${RESET}`);
      }
    }
    return false;
  }
}
