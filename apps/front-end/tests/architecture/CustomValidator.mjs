#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Custom Validator for Next.js Frontend (Hexagonal Architecture)
 * Main orchestrator that runs all architecture validation rules
 *
 * Validates:
 * 1. Test Coverage: Every source file has corresponding tests (TestCoverageRules)
 * 2. Src Structure: Directory follows hexagonal architecture (SrcDirectoryRules)
 *
 * Mirrors backend PHPArkitect structure:
 * - apps/api/tests/Architecture/Arkitect/*.php
 *
 * @see apps/api/tools/test/phparkitect.php (main orchestrator)
 * @see apps/api/tests/Architecture/Arkitect/
 */

import path from "path";
import { fileURLToPath } from "url";
import { SrcDirectoryRules } from "./rules/SrcDirectoryRules.mjs";
import { TestCoverageRules } from "./rules/TestCoverageRules.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

// ANSI colors
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

/**
 * Main Custom Validator
 * Orchestrates all architecture validation rules
 */
class CustomValidator {
  constructor(quiet = false) {
    this.projectRoot = projectRoot;
    this.rules = [];
    this.results = [];
    this.quiet = quiet;
  }

  /**
   * Add validation rule
   */
  addRule(rule) {
    this.rules.push(rule);
  }

  /**
   * Run all validation rules
   */
  run() {
    console.log(
      `${CYAN}${BOLD}╔═══════════════════════════════════════════════════════════════════╗${RESET}`,
    );
    console.log(
      `${CYAN}${BOLD}║  FRONTEND ARCHITECTURE VALIDATION (Hexagonal Architecture)       ║${RESET}`,
    );
    console.log(
      `${CYAN}${BOLD}╚═══════════════════════════════════════════════════════════════════╝${RESET}\n`,
    );

    console.log(
      `${CYAN}Running ${this.rules.length} validation rule(s)...${RESET}`,
    );

    let allPassed = true;

    // Run each rule
    for (const rule of this.rules) {
      rule.validate();
      const passed = rule.printResults();

      this.results.push({
        rule: rule.name,
        passed: passed,
        results: rule.getResults(),
      });

      if (!passed) {
        allPassed = false;
      }

      console.log("\n");
    }

    // Print final summary
    this.printFinalSummary();

    return allPassed;
  }

  /**
   * Print final validation summary
   */
  printFinalSummary() {
    console.log(`${"=".repeat(80)}`);
    console.log(`${BOLD}🎯 FINAL ARCHITECTURE VALIDATION SUMMARY${RESET}`);
    console.log(`${"=".repeat(80)}\n`);

    let passedCount = 0;
    let failedCount = 0;

    for (const result of this.results) {
      const icon = result.passed ? `${GREEN}✅${RESET}` : `${RED}❌${RESET}`;
      const status = result.passed
        ? `${GREEN}PASSED${RESET}`
        : `${RED}FAILED${RESET}`;

      console.log(`${icon} ${result.rule}: ${status}`);

      if (result.passed) {
        passedCount++;
      } else {
        failedCount++;
      }
    }

    console.log(`\n${CYAN}Total Rules: ${this.results.length}${RESET}`);
    console.log(`${GREEN}Passed: ${passedCount}${RESET}`);
    console.log(`${RED}Failed: ${failedCount}${RESET}`);

    if (failedCount === 0) {
      console.log(
        `\n${GREEN}${BOLD}🎉 ALL ARCHITECTURE VALIDATIONS PASSED!${RESET}`,
      );
      console.log(
        `${GREEN}Your frontend follows hexagonal architecture principles!${RESET}`,
      );
    } else {
      console.log(
        `\n${YELLOW}${BOLD}⚠️  ${failedCount} VALIDATION(S) FAILED${RESET}`,
      );
    }

    console.log(`\n${CYAN}${BOLD}Reference:${RESET}`);
    console.log(`  Backend: apps/api/tests/architecture/Arkitect/`);
    console.log(`  Frontend: apps/front-end/tests/architecture/rules/`);
  }
}

// Main execution
const quiet = process.argv.includes("--quiet");
const validator = new CustomValidator(quiet);

validator.addRule(new SrcDirectoryRules(projectRoot, quiet));
validator.addRule(new TestCoverageRules(projectRoot));

const success = validator.run();

process.exit(success ? 0 : 1);
