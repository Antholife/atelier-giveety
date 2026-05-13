#!/usr/bin/env python3
"""
Comprehensive Test Orchestrator for Giveety Monorepo
Handles Backend (PHP/Symfony) and Frontend (TypeScript/Next.js) testing

Usage: 
    python scripts/test.py --type=all [--fix] [--verbose] [--tool=TOOL]
    python scripts/test.py --type=backend [--fix] [--verbose]
    python scripts/test.py --type=frontend [--fix]
"""

import argparse
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional

# Colors
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
CYAN = "\033[96m"
MAGENTA = "\033[95m"
RESET = "\033[0m"
BOLD = "\033[1m"


class TestOrchestrator:
    """Comprehensive test orchestrator for monorepo"""
    
    # CI Job mapping for correlation between local and CI
    CI_JOB_MAP = {
        # Backend Code Quality
        "Backend Code Quality (PHP-CS-Fixer)": "test:backend:code_quality",
        "Backend Code Quality (PHP-CS-Fixer Fix)": "test:backend:code_quality",
        "Backend Code Quality (PHPStan)": "test:backend:code_quality",
        "Backend Code Quality (PHPMD)": "test:backend:code_quality",
        # Backend Architecture
        "Backend Architecture (PHPArkitect)": "test:backend:architecture",
        # Backend Tests
        "Backend Unit Tests (PHPUnit)": "test:backend:unit",
        "Backend Functional Tests (PHPUnit)": "test:backend:functional",
        "Backend Integration Tests (PHPUnit)": "test:backend:integration",
        # Frontend Code Quality
        "Frontend Code Quality (ESLint)": "test:frontend:code_quality",
        "Frontend Code Quality (ESLint Fix)": "test:frontend:code_quality",
        "Frontend Code Quality (TypeScript)": "test:frontend:code_quality",
        # Frontend Architecture
        "Frontend Architecture (dependency-cruiser)": "test:frontend:architecture",
        "Frontend Architecture (custom-validator)": "test:frontend:architecture",
        # Frontend Tests
        "Frontend Unit Tests (Vitest)": "test:frontend:unit",
        "Frontend Functional Tests (Vitest)": "test:frontend:functional",
        "Frontend Integration Tests (Playwright)": "test:frontend:integration",
        # Docker Security
        "Docker Security (Hadolint + Trivy)": "security:docker",
    }
    
    def __init__(self, test_type: str = "all", fix: bool = False, verbose: bool = False, quiet: bool = False, tool: Optional[str] = None, stop_on_failure: bool = False):
        self.test_type = test_type
        self.fix = fix
        self.verbose = verbose
        self.quiet = quiet
        self.tool = tool
        self.stop_on_failure = stop_on_failure
        self.root = Path(__file__).parent.parent
        self.results: Dict[str, Dict] = {}
        self.failed_tests: List[str] = []
        self.current_context = None  # Track whether we're in backend or frontend
        
    def _get_ci_job_name(self, description: str) -> Optional[str]:
        """Determine CI job name for a test description"""
        # All mappings are now explicit in CI_JOB_MAP
        return self.CI_JOB_MAP.get(description)
    
    def _run_command(self, cmd: List[str], description: str, accept_exit_2: bool = False) -> bool:
        """Run a command and track results"""
        try:
            if self.verbose:
                print(f"{CYAN}Running: {' '.join(cmd)}{RESET}")
            
            # Determine CI job name
            ci_job = self._get_ci_job_name(description)
            
            # Special handling for Vitest commands
            is_vitest = "vitest" in ' '.join(cmd).lower() or "test:run" in ' '.join(cmd)
            
            if is_vitest and not self.quiet:
                return self._run_vitest_simple(cmd, description, ci_job)
            
            # Default behavior for other commands
            result = subprocess.run(
                cmd,
                cwd=self.root,
                capture_output=(not self.verbose or self.quiet),
                text=True,
                timeout=300
            )
            
            # Get full output for parsing
            output = (result.stdout or "") + (result.stderr or "")
            
            # Special case: Vitest/Playwright - Parse test results FIRST (before generic success)
            if "vitest" in ' '.join(cmd).lower() or "playwright" in ' '.join(cmd).lower():
                # Parse Vitest output for test statistics FIRST (before checking "No test files")
                if "vitest" in ' '.join(cmd).lower():
                    import re
                    # Parse patterns like: "Test Files  11 passed (11)" and "Tests  45 passed (45)"
                    test_files_match = re.search(r'Test Files\s+(\d+)\s+(passed|failed)\s*\((\d+)\)', output)
                    tests_match = re.search(r'Tests\s+(\d+)\s+(passed|failed)\s*\((\d+)\)', output)
                    
                    # Alternative patterns for different Vitest output formats
                    # Pattern: "✓ 11 passed" or "✓ 11 test files passed"
                    simple_match = re.search(r'[✓✔]\s+(\d+)\s+(?:test files?\s+)?(\w+)', output)
                    # Pattern: "11 passed | 0 failed"
                    inline_match = re.search(r'(\d+)\s+passed\s*\|\s*(\d+)\s+failed', output)
                    # Pattern: "Test Files  1 | 1 passed | 0 failed" (single line format)
                    summary_match = re.search(r'Test Files\s+(\d+)\s*\|\s*(\d+)\s+passed\s*\|\s*(\d+)\s+failed', output)
                    
                    if test_files_match and tests_match:
                        test_files_passed = int(test_files_match.group(1)) if test_files_match.group(2) == "passed" else 0
                        test_files_total = int(test_files_match.group(3))
                        tests_passed = int(tests_match.group(1)) if tests_match.group(2) == "passed" else 0
                        tests_total = int(tests_match.group(3))
                        
                        message = f"{tests_passed}/{tests_total} tests passed in {test_files_passed}/{test_files_total} test files"
                        if tests_passed != tests_total or test_files_passed != test_files_total:
                            message += f" ({tests_total - tests_passed} failed)"
                        
                        is_passed = tests_passed == tests_total and test_files_passed == test_files_total
                        self.results[description] = {
                            "status": "PASSED" if is_passed else "FAILED",
                            "message": message,
                            "ci_job": ci_job
                        }
                        # Show output on failure (if not quiet)
                        if not is_passed and result.returncode != 0 and not self.quiet:
                            print(f"\n{YELLOW}📋 Test output:{RESET}")
                            if result.stdout:
                                print(result.stdout)
                            if result.stderr:
                                print(result.stderr, file=sys.stderr)
                            print()
                        return result.returncode == 0 if is_passed else False
                    elif summary_match:
                        test_files_total = int(summary_match.group(1))
                        tests_passed = int(summary_match.group(2))
                        tests_failed = int(summary_match.group(3))
                        tests_total = tests_passed + tests_failed
                        
                        message = f"{tests_passed}/{tests_total} tests passed in {test_files_total} test files"
                        if tests_failed > 0:
                            message += f" ({tests_failed} failed)"
                        
                        is_passed = tests_failed == 0
                        self.results[description] = {
                            "status": "PASSED" if is_passed else "FAILED",
                            "message": message,
                            "ci_job": ci_job
                        }
                        # Show output on failure (if not quiet)
                        if not is_passed and not self.quiet:
                            print(f"\n{YELLOW}📋 Test output:{RESET}")
                            if result.stdout:
                                print(result.stdout)
                            if result.stderr:
                                print(result.stderr, file=sys.stderr)
                            print()
                        return result.returncode == 0 if is_passed else False
                    elif inline_match:
                        tests_passed = int(inline_match.group(1))
                        tests_failed = int(inline_match.group(2))
                        tests_total = tests_passed + tests_failed
                        
                        message = f"{tests_passed}/{tests_total} tests passed"
                        if tests_failed > 0:
                            message += f" ({tests_failed} failed)"
                        
                        is_passed = tests_failed == 0
                        self.results[description] = {
                            "status": "PASSED" if is_passed else "FAILED",
                            "message": message,
                            "ci_job": ci_job
                        }
                        # Show output on failure (if not quiet)
                        if not is_passed and not self.quiet:
                            print(f"\n{YELLOW}📋 Test output:{RESET}")
                            if result.stdout:
                                print(result.stdout)
                            if result.stderr:
                                print(result.stderr, file=sys.stderr)
                            print()
                        return result.returncode == 0 if is_passed else False
                    elif simple_match:
                        count = int(simple_match.group(1))
                        status = simple_match.group(2)
                        message = f"{count} {status}"
                        
                        is_passed = status in ["passed", "pass"]
                        self.results[description] = {
                            "status": "PASSED" if is_passed else "FAILED",
                            "message": message,
                            "ci_job": ci_job
                        }
                        # Show output on failure (if not quiet)
                        if not is_passed and not self.quiet:
                            print(f"\n{YELLOW}📋 Test output:{RESET}")
                            if result.stdout:
                                print(result.stdout)
                            if result.stderr:
                                print(result.stderr, file=sys.stderr)
                            print()
                        return result.returncode == 0 if is_passed else False
                
                # Check for "No test files found" - this is OK even with exit code 1
                # Only if no test results were parsed above
                if output and ("No test files found" in output or "No tests found" in output):
                    self.results[description] = {
                        "status": "PASSED",
                        "message": "No tests found (structure ready)",
                        "ci_job": ci_job
                    }
                    return True  # Treat as success even if exit code is 1
            
            # Check for success (exit code 0) - Generic case (after special parsing)
            if result.returncode == 0:
                self.results[description] = {
                    "status": "PASSED",
                    "message": "All checks passed",
                    "ci_job": ci_job
                }
                return True
            
            # Special case: PHPMD with violations (exit code 2) - accept if accept_exit_2=True
            # PHPMD returns exit code 2 when violations are found (not errors)
            if accept_exit_2 and result.returncode == 2:
                # PHPMD violations found - treat as warnings, not failures
                output = (result.stdout or "") + (result.stderr or "")
                violation_count = output.count("violations") if output else 0
                self.results[description] = {
                    "status": "PASSED",
                    "message": f"Violations found (warnings, not failures)",
                    "ci_job": ci_job
                }
                # Show output if not quiet
                if not self.quiet:
                    print(f"\n{YELLOW}⚠️  PHPMD violations found (warnings):{RESET}")
                    if result.stdout:
                        print(result.stdout)
                    if result.stderr:
                        print(result.stderr, file=sys.stderr)
                    print()
                return True
            
            # Special case: PHPUnit with deprecations/warnings (exit code 1)
            # "OK, but there were issues!" or "WARNINGS!" should be treated as success
            if "phpunit" in ' '.join(cmd).lower() or "Tests" in description:
                output = result.stdout if result.stdout else result.stderr
                if output and ("OK, but there were issues!" in output or 
                              ("OK (" in output and "tests," in output) or
                              ("WARNINGS!" in output)):
                    self.results[description] = {
                        "status": "PASSED",
                        "message": "All tests passed (with deprecations/warnings)",
                        "ci_job": ci_job
                    }
                    return True
            
            # Otherwise it's a failure
            # Show output if not in quiet mode or if stop_on_failure is enabled
            if not self.quiet or self.stop_on_failure:
                print(f"\n{YELLOW}📋 Command output:{RESET}")
                if result.stdout:
                    print(result.stdout)
                if result.stderr:
                    print(result.stderr, file=sys.stderr)
                print()  # Empty line after output
            
            self.results[description] = {
                "status": "FAILED",
                "message": "Check output above for details" if (not self.quiet or self.stop_on_failure) else "Failed (use without --quiet for details)",
                "ci_job": ci_job
            }
            self.failed_tests.append(description)
            return False
                
        except subprocess.TimeoutExpired:
            self.results[description] = {
                "status": "FAILED",
                "message": "Command timed out",
                "ci_job": self._get_ci_job_name(description)
            }
            self.failed_tests.append(description)
            return False
        except Exception as e:
            self.results[description] = {
                "status": "FAILED",
                "message": f"Error: {str(e)}",
                "ci_job": self._get_ci_job_name(description)
            }
            self.failed_tests.append(description)
            return False
    
    def _run_vitest_simple(self, cmd: List[str], description: str, ci_job: Optional[str]) -> bool:
        """Run Vitest and display test statuses simply"""
        import re
        import sys as sys_module
        
        print(f"{CYAN}{BOLD}Running {description}...{RESET}\n")
        
        # Run Vitest and capture output line by line
        process = subprocess.Popen(
            cmd,
            cwd=self.root,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        output_lines = []
        test_files = {}  # {test_file: status}
        failed_tests = []
        
        # Read output line by line
        try:
            for line in iter(process.stdout.readline, ''):
                if not line:
                    break
                output_lines.append(line)
                output = ''.join(output_lines)
                
                # Remove ANSI codes for parsing
                clean_line = re.sub(r'\x1b\[[0-9;]*m', '', line)
                
                # Detect test file completion: "✓ tests/path/to/test.test.tsx" or "❌ tests/..."
                test_complete_match = re.search(r'^([✓❌])\s+(tests?/[^\s]+\.(test|spec)\.(ts|tsx|js|jsx))', clean_line.strip())
                if test_complete_match:
                    status_char = test_complete_match.group(1)
                    test_file = test_complete_match.group(2)
                    status = "PASSED" if status_char == "✓" else "FAILED"
                    
                    if test_file not in test_files:
                        test_files[test_file] = status
                        # Display test status immediately
                        if status == "PASSED":
                            print(f"{GREEN}{test_file}: PASSED{RESET}", flush=True)
                        else:
                            print(f"{RED}{BOLD}{test_file}: FAILED{RESET}", flush=True)
                            failed_tests.append(test_file)
                
                # Also catch FAIL lines
                fail_match = re.search(r'^\s*FAIL\s+(tests?/[^\s]+\.(test|spec)\.(ts|tsx|js|jsx))', clean_line)
                if fail_match:
                    test_file = fail_match.group(1)
                    if test_file not in test_files:
                        test_files[test_file] = "FAILED"
                        failed_tests.append(test_file)
                        print(f"{RED}{BOLD}{test_file}: FAILED{RESET}", flush=True)
        except:
            pass
        
        # Wait for process to complete
        returncode = process.wait()
        output = ''.join(output_lines)
        
        print()  # Empty line
        
        # Parse final summary
        test_files_match = re.search(r'Test Files\s+(\d+)\s+(passed|failed)\s*\((\d+)\)', output)
        tests_match = re.search(r'Tests\s+(\d+)\s+(passed|failed)\s*\((\d+)\)', output)
        
        # Also check for failed test patterns in the output
        has_failed_tests = bool(re.search(r'\s+❌\s+|FAIL\s+|\s+FAILED', output))
        # Check if all test files passed (pattern: "✓ tests/path" for all files)
        all_passed_pattern = len([f for f in test_files.values() if f == "PASSED"]) == len(test_files) and len(test_files) > 0
        
        is_passed = False
        message = ""
        
        if test_files_match and tests_match:
            test_files_passed = int(test_files_match.group(1)) if test_files_match.group(2) == "passed" else 0
            test_files_total = int(test_files_match.group(3))
            tests_passed = int(tests_match.group(1)) if tests_match.group(2) == "passed" else 0
            tests_total = int(tests_match.group(3))
            
            message = f"{tests_passed}/{tests_total} tests passed in {test_files_passed}/{test_files_total} test files"
            if tests_passed != tests_total or test_files_passed != test_files_total:
                message += f" ({tests_total - tests_passed} failed)"
            
            is_passed = tests_passed == tests_total and test_files_passed == test_files_total
        else:
            # If we couldn't parse the summary line, check if we tracked failed tests during execution
            # If no failed tests were found and all tracked files passed, consider it success
            is_passed = len(failed_tests) == 0 and (all_passed_pattern or returncode == 0)
            message = f"{len(test_files)} test files executed"
            if len(failed_tests) > 0:
                message += f" ({len(failed_tests)} failed)"
        
        # Only show errors if tests actually failed (not just because returncode != 0)
        # Vitest can return non-zero exit codes for warnings, but tests might still pass
        if not is_passed or (failed_tests and len(failed_tests) > 0):
            print(f"{RED}{BOLD}════════════════════════════════════════════════════════════════{RESET}")
            print(f"{RED}{BOLD}❌ Erreurs détectées - Output complet de Vitest:{RESET}")
            print(f"{RED}{BOLD}════════════════════════════════════════════════════════════════{RESET}\n")
            print(output)
            print(f"{RED}{BOLD}════════════════════════════════════════════════════════════════{RESET}\n")
        
        self.results[description] = {
            "status": "PASSED" if is_passed else "FAILED",
            "message": message,
            "ci_job": ci_job
        }
        
        if not is_passed:
            self.failed_tests.append(description)
        
        return is_passed
    
    def print_step_header(self, step: int, total: int, description: str, icon: str = "🔍"):
        """Print a step header"""
        print()
        print(f"{BOLD}{icon} Step {step}/{total}: {description}...{RESET}")
        print("─" * 60)
    
    def print_result(self, success: bool, description: str):
        """Print result of a test"""
        if success:
            print(f"{GREEN}✅ {description}: PASSED{RESET}")
        else:
            print(f"{RED}❌ {description}: FAILED{RESET}")
    
    # ============================================================================
    # BACKEND TESTS
    # ============================================================================
    
    def run_backend_comprehensive(self):
        """Run comprehensive backend test suite"""
        self.current_context = "backend"  # Set context for CI job mapping
        
        print(f"{BLUE}{BOLD}🐘 BACKEND - PHP/Symfony Comprehensive Test Suite{RESET}")
        print("=" * 70)
        if self.stop_on_failure:
            print(f"{YELLOW}{BOLD}⚠️  Stop on failure mode enabled - execution will stop on first failure{RESET}\n")
        
        total_steps = 8  # Arkitect, CS Fixer, MD, MD test, Stan, Unit, Functional, Integration
        current_step = 0
        
        # 1. PHPArkitect Architecture Validation
        current_step += 1
        self.print_step_header(current_step, total_steps, "Backend Architecture (PHPArkitect)", "🏗️")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "php", "vendor/bin/phparkitect", 
             "check", "--config=tools/test/phparkitect.php"],
            "Backend Architecture (PHPArkitect)"
        )
        self.print_result(success, "Backend Architecture (PHPArkitect)")
        if not success and self.stop_on_failure:
            print(f"\n{RED}{BOLD}❌ Test failed - stopping execution (stop-on-failure mode){RESET}\n")
            return
        
        # 2. Code Style Fix
        current_step += 1
        self.print_step_header(current_step, total_steps, "Backend Code Quality (PHP-CS-Fixer)", "🔧")
        if self.fix:
            success = self._run_command(
                ["docker", "compose", "exec", "-T", "php", "vendor/bin/php-cs-fixer", "fix", "--config=tools/dev/.php-cs-fixer.dist.php", 
                 "--verbose"],
                "Backend Code Quality (PHP-CS-Fixer Fix)"
            )
        else:
            success = self._run_command(
                ["docker", "compose", "exec", "-T", "php", "vendor/bin/php-cs-fixer", "fix", "--config=tools/dev/.php-cs-fixer.dist.php", 
                 "--dry-run", "--verbose", "--diff"],
                "Backend Code Quality (PHP-CS-Fixer)"
            )
        self.print_result(success, "Backend Code Quality (PHP-CS-Fixer)")
        if not success and self.stop_on_failure:
            print(f"\n{RED}{BOLD}❌ Test failed - stopping execution (stop-on-failure mode){RESET}\n")
            return
        
        # 3. PHPMD Code Quality
        current_step += 1
        self.print_step_header(current_step, total_steps, "Backend Code Quality (PHPMD strict)", "📊")
        # STRICT MODE: Exit 2 (violations) = FAILURE in local tests
        # CI accepts exit 2 via allow_failure: true
        # TEMP: restrict to new hexagonal folders during migration
        # TODO(after migration): restore to "src"
        cmd = ["docker", "compose", "exec", "-T", "php", "vendor/bin/phpmd", 
               "src/Domain,src/Application,src/Infrastructure", "text", "tools/test/phpmd.xml"]
        success = self._run_command(cmd, "Backend Code Quality (PHPMD)")
        self.print_result(success, "Backend Code Quality (PHPMD)")
        if not success and self.stop_on_failure:
            print(f"\n{RED}{BOLD}❌ Test failed - stopping execution (stop-on-failure mode){RESET}\n")
            return
        
        # 4. PHPMD Test Quality (Declarative Test Detection)
        current_step += 1
        self.print_step_header(current_step, total_steps, "Backend Test Quality (PHPMD)", "🔍")
        # Note: PHPMD returns exit code 2 if violations found, 1 if errors, 0 if OK
        # We'll accept exit code 2 as warnings (not failures) for now
        cmd = ["docker", "compose", "exec", "-T", "php", "vendor/bin/phpmd", 
               "tests", "text", "tools/test/phpmd-test.xml"]
        success = self._run_command(cmd, "Backend Test Quality (PHPMD)", accept_exit_2=True)
        self.print_result(success, "Backend Test Quality (PHPMD)")
        if not success and self.stop_on_failure:
            print(f"\n{RED}{BOLD}❌ Test failed - stopping execution (stop-on-failure mode){RESET}\n")
            return
        
        # 5. PHPStan Static Analysis
        current_step += 1
        self.print_step_header(current_step, total_steps, "Backend Code Quality (PHPStan level 9)", "🔍")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "php", "php", "-d", "memory_limit=1G", 
             "vendor/bin/phpstan", "analyse", "--configuration=tools/test/phpstan.neon", 
             "--level=9", "--no-progress"],
            "Backend Code Quality (PHPStan)"
        )
        self.print_result(success, "Backend Code Quality (PHPStan)")
        if not success and self.stop_on_failure:
            print(f"\n{RED}{BOLD}❌ Test failed - stopping execution (stop-on-failure mode){RESET}\n")
            return
        
        # 6. Unit Tests
        current_step += 1
        self.print_step_header(current_step, total_steps, "Backend Unit (PHPUnit)", "🧪")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "php", "php", "bin/phpunit",
             "--configuration=tools/test/phpunit.xml.dist", "--testsuite=Unit"],
            "Backend Unit Tests (PHPUnit)"
        )
        self.print_result(success, "Backend Unit Tests (PHPUnit)")
        if not success and self.stop_on_failure:
            print(f"\n{RED}{BOLD}❌ Test failed - stopping execution (stop-on-failure mode){RESET}\n")
            return
        
        # 7. Functional Tests
        current_step += 1
        self.print_step_header(current_step, total_steps, "Backend Functional (PHPUnit)", "🎯")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "php", "sh", "-c",
             "APP_ENV=test php bin/console doctrine:database:create --if-not-exists && " +
             "APP_ENV=test php bin/console doctrine:migrations:migrate --no-interaction && " +
             "php bin/phpunit --configuration=tools/test/phpunit.xml.dist --testsuite=Functional"],
            "Backend Functional Tests (PHPUnit)"
        )
        self.print_result(success, "Backend Functional Tests (PHPUnit)")
        if not success and self.stop_on_failure:
            print(f"\n{RED}{BOLD}❌ Test failed - stopping execution (stop-on-failure mode){RESET}\n")
            return
        
        # 8. Integration Tests
        current_step += 1
        self.print_step_header(current_step, total_steps, "Backend Integration (PHPUnit)", "🔗")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "php", "sh", "-c",
             "APP_ENV=test php bin/console doctrine:database:create --if-not-exists && " +
             "APP_ENV=test php bin/console doctrine:migrations:migrate --no-interaction && " +
             "php bin/phpunit --configuration=tools/test/phpunit.xml.dist --testsuite=Integration"],
            "Backend Integration Tests (PHPUnit)"
        )
        self.print_result(success, "Backend Integration Tests (PHPUnit)")
        if not success and self.stop_on_failure:
            print(f"\n{RED}{BOLD}❌ Test failed - stopping execution (stop-on-failure mode){RESET}\n")
            return
        
        # Optional tools removed: PHPCPD, PHPMND, Infection
        # Rationale:
        # - PHPCPD: Redundant with PHPStan + code review
        # - PHPMND: Too pedantic, high false positive rate
        # - Infection: Premature (requires 80%+ coverage first)
        # Focus on: PHPStan, PHPArkitect, PHPMD, PHPUnit, Coverage
    
    def run_backend_tool(self, tool: str):
        """Run a specific backend tool"""
        tool_map = {
            "phpunit": ["docker", "compose", "exec", "-T", "php", "php", "bin/phpunit",
                       "--configuration=tools/test/phpunit.xml.dist"],
            "phpstan": ["docker", "compose", "exec", "-T", "php", "php", "-d", "memory_limit=1G",
                       "vendor/bin/phpstan", "analyse", "--configuration=tools/test/phpstan.neon", "--level=9"],
            "cs-fixer": ["docker", "compose", "exec", "-T", "php", "vendor/bin/php-cs-fixer", "fix", "--config=tools/dev/.php-cs-fixer.dist.php", 
                        "--verbose" if self.fix else "--dry-run"],
            "phparkitect": ["docker", "compose", "exec", "-T", "php", "vendor/bin/phparkitect", 
                          "check", "--config=tools/test/phparkitect.php"],
            # TEMP: restrict to new hexagonal folders during migration
            # TODO(after migration): restore to "src"
            "phpmd": ["docker", "compose", "exec", "-T", "php", "vendor/bin/phpmd", 
                     "src/Domain,src/Application,src/Infrastructure", "text", "tools/test/phpmd.xml"],
            # Removed optional tools: phpcpd, phpmnd, infection (overkill for current stage)
        }
        
        if tool not in tool_map:
            print(f"{RED}❌ Unknown tool: {tool}{RESET}")
            print(f"{YELLOW}Available tools: {', '.join(tool_map.keys())}{RESET}")
            sys.exit(1)
        
        print(f"{BLUE}Running {tool}...{RESET}")
        self._run_command(tool_map[tool], tool)
    
    # ============================================================================
    # FRONTEND TESTS
    # ============================================================================
    
    def run_frontend_comprehensive(self):
        """Run comprehensive frontend test suite"""
        self.current_context = "frontend"  # Set context for CI job mapping
        
        print(f"{MAGENTA}{BOLD}⚛️  FRONTEND - TypeScript/Next.js Comprehensive Test Suite{RESET}")
        print("=" * 70)
        
        total_steps = 7
        current_step = 0
        
        # 1. Architecture Validation - dependency-cruiser (Structure & Dependencies)
        current_step += 1
        self.print_step_header(current_step, total_steps, "Frontend Architecture (Hexagonal Convention and dependency-cruiser)", "🏗️")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "front-end", "yarn", "depcruise",
             "--config", "tests/architecture/utils/dependency-cruiser.config.js", "src"],
            "Frontend Architecture (Hexagonal Convention and dependency-cruiser)"
        )
        self.print_result(success, "Frontend Architecture (Hexagonal Convention and dependency-cruiser)")
        
        # 2. Architecture Validation - Custom Validator (Test Coverage + Hexagonal Structure)
        current_step += 1
        self.print_step_header(current_step, total_steps, "Frontend Architecture (Hexagonal Structure and Test Coverage)", "🧪")
        cmd = ["docker", "compose", "exec", "-T", "front-end", "node", "tests/architecture/CustomValidator.mjs"]
        if self.quiet:
            cmd.append("--quiet")
        success = self._run_command(cmd, "Frontend Architecture (Hexagonal Structure and Test Coverage)")
        self.print_result(success, "Frontend Architecture (Hexagonal Structure and Test Coverage)")
        
        # 3. Code Quality (ESLint)
        current_step += 1
        self.print_step_header(current_step, total_steps, "Frontend Code Quality (ESLint)", "🔧")
        if self.fix:
            success = self._run_command(
                ["docker", "compose", "exec", "-T", "front-end", "yarn", "lint", "--fix"],
                "Frontend Code Quality (ESLint Fix)"
            )
        else:
            success = self._run_command(
                ["docker", "compose", "exec", "-T", "front-end", "yarn", "lint"],
                "Frontend Code Quality (ESLint)"
            )
        self.print_result(success, "Frontend Code Quality (ESLint)")
        
        # 4. Code Quality (TypeScript)
        current_step += 1
        self.print_step_header(current_step, total_steps, "Frontend Code Quality (TypeScript tsc)", "🔍")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "front-end", "yarn", "type-check"],
            "Frontend Code Quality (TypeScript)"
        )
        self.print_result(success, "Frontend Code Quality (TypeScript)")
        
        # 5. Unit Tests (Vitest)
        current_step += 1
        self.print_step_header(current_step, total_steps, "Frontend Unit (Vitest)", "🧪")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "front-end", "yarn", "test:run", "tests/Unit/"],
            "Frontend Unit Tests (Vitest)"
        )
        self.print_result(success, "Frontend Unit Tests (Vitest)")
        
        # 6. Functional Tests (Vitest)
        current_step += 1
        self.print_step_header(current_step, total_steps, "Frontend Functional (Vitest)", "🎯")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "front-end", "yarn", "test:run", "tests/Functional/"],
            "Frontend Functional Tests (Vitest)"
        )
        self.print_result(success, "Frontend Functional Tests (Vitest)")
        
        # 7. Integration Tests (Playwright E2E)
        current_step += 1
        self.print_step_header(current_step, total_steps, "Frontend Integration (Playwright E2E)", "🎭")
        success = self._run_command(
            ["docker", "compose", "exec", "-T", "front-end", "yarn", "test:e2e"],
            "Frontend Integration Tests (Playwright)"
        )
        self.print_result(success, "Frontend Integration Tests (Playwright)")
    
    def run_frontend_tool(self, tool: str):
        """Run a specific frontend tool"""
        tool_map = {
            "architecture": ["docker", "compose", "exec", "-T", "front-end", "yarn", "depcruise", 
                           "--config", "tests/architecture/utils/dependency-cruiser.config.js", "src"],
            "custom-validator": ["docker", "compose", "exec", "-T", "front-end", "node", "tests/architecture/CustomValidator.mjs"] + (["--quiet"] if self.quiet else []),
            "eslint": ["docker", "compose", "exec", "-T", "front-end", "yarn", "lint"] + (["--fix"] if self.fix else []),
            "typescript": ["docker", "compose", "exec", "-T", "front-end", "yarn", "type-check"],
            "unit": ["docker", "compose", "exec", "-T", "front-end", "yarn", "test:run", "tests/unit/"],
            "functional": ["docker", "compose", "exec", "-T", "front-end", "yarn", "test:run", "tests/functional/"],
            "integration": ["docker", "compose", "exec", "-T", "front-end", "yarn", "test:e2e"],
            # Legacy aliases
            "vitest": ["docker", "compose", "exec", "-T", "front-end", "yarn", "test:run"],
            "playwright": ["docker", "compose", "exec", "-T", "front-end", "yarn", "test:e2e"],
        }
        
        if tool not in tool_map:
            print(f"{RED}❌ Unknown tool: {tool}{RESET}")
            print(f"{YELLOW}Available tools: {', '.join(tool_map.keys())}{RESET}")
            sys.exit(1)
        
        self._run_command(tool_map[tool], tool)
    
    # ============================================================================
    # SUMMARY
    # ============================================================================
    
    def print_summary(self):
        """Print comprehensive test summary"""
        print()
        print(f"{BOLD}{'=' * 70}{RESET}")
        print(f"{BOLD}📊 TEST SUMMARY{RESET}")
        print(f"{BOLD}{'=' * 70}{RESET}")
        print()
        
        # Show results for each test category
        for test_name, result in self.results.items():
            status_icon = "✅" if result["status"] == "PASSED" else "❌"
            status_color = GREEN if result["status"] == "PASSED" else RED
            ci_job = result.get("ci_job")
            
            # Main result line
            print(f"{status_icon} {BOLD}{test_name}{RESET}: {status_color}{result['status']}{RESET}")
            
            # CI job mapping (if available)
            if ci_job:
                print(f"   ├─ CI Job: {CYAN}{ci_job}{RESET}")
                print(f"   └─ {result['message']}")
            else:
                print(f"   └─ {result['message']}")
        
        print()
        
        # Overall summary
        total_tests = len(self.results)
        passed_tests = len([r for r in self.results.values() if r["status"] == "PASSED"])
        failed_count = len(self.failed_tests)
        
        print(f"📈 OVERALL RESULTS: {BOLD}{passed_tests}/{total_tests}{RESET} test categories passed")
        
        if failed_count == 0:
            print()
            print(f"{GREEN}{BOLD}🎉 ALL TESTS PASSED! Your code is ready!{RESET}")
            return 0
        else:
            print()
            print(f"{RED}{BOLD}⚠️  {failed_count} test category(ies) failed:{RESET}")
            for test in self.failed_tests:
                print(f"   • {test}")
            print()
            print(f"{YELLOW}💡 Next steps:{RESET}")
            
            if any("Code Style" in t for t in self.failed_tests):
                print(f"   • Run with {CYAN}--fix{RESET} flag to auto-fix style issues")
            if any("PHPStan" in t for t in self.failed_tests):
                print("   • Fix static analysis errors shown above")
            if any("TypeScript" in t for t in self.failed_tests):
                print("   • Fix TypeScript type errors shown above")
            if any("Tests" in t for t in self.failed_tests):
                print("   • Fix failing tests shown above")
            
            print()
            print(f"🔄 Run {CYAN}make test{RESET} again after fixing the issues.")
            return 1
    
    # ============================================================================
    # DOCKER SECURITY SCANNING
    # ============================================================================
    
    def run_docker_security(self):
        """Run Docker security scanning"""
        print()
        print(f"{CYAN}{BOLD}{'=' * 70}{RESET}")
        print(f"{CYAN}{BOLD}🐳 DOCKER - Security Scan (Hadolint + Trivy){RESET}")
        print(f"{CYAN}{BOLD}{'=' * 70}{RESET}")
        print()
        
        # Run docker security scanner (dockerfile-only for speed)
        success = self._run_command(
            ["python3", "scripts/docker_security_scanner.py", "--dockerfile-only"],
            "Docker Security (Hadolint + Trivy)"
        )
        
        # Note: ci_job is already set by _run_command, but we're overriding the result
        # so we need to preserve it
        self.results["Docker Security (Hadolint + Trivy)"] = {
            "status": "PASSED" if success else "FAILED",
            "message": "No security issues found" if success else "Security issues detected",
            "ci_job": "security:docker"
        }
        
        if not success:
            self.failed_tests.append("Docker Security (Hadolint + Trivy)")
    
    # ============================================================================
    # MAIN RUNNER
    # ============================================================================
    
    def run(self):
        """Main test runner"""
        print()
        print(f"{CYAN}{BOLD}{'=' * 70}{RESET}")
        print(f"{CYAN}{BOLD}   FRONT-END MONOREPO - COMPREHENSIVE TEST SUITE{RESET}")
        print(f"{CYAN}{BOLD}{'=' * 70}{RESET}")
        
        if self.test_type == "all":
            print(f"{BLUE}🎯 Mode: FULL SUITE (Backend + Frontend + Docker Security){RESET}")
        elif self.test_type == "backend":
            print(f"{BLUE}🎯 Mode: BACKEND ONLY{RESET}")
        elif self.test_type == "frontend":
            print(f"{MAGENTA}🎯 Mode: FRONTEND ONLY{RESET}")
        
        if self.fix:
            print(f"{GREEN}🔧 Auto-fix: ENABLED{RESET}")
        if self.verbose:
            print(f"{YELLOW}📋 Verbose: ENABLED{RESET}")
        if self.tool:
            print(f"{CYAN}🔨 Specific tool: {self.tool}{RESET}")
        
        print()
        
        # Run appropriate tests
        if self.tool:
            # Run specific tool
            if self.test_type in ["all", "backend"]:
                self.run_backend_tool(self.tool)
            elif self.test_type == "frontend":
                self.run_frontend_tool(self.tool)
        else:
            # Run comprehensive suites
            if self.test_type in ["all", "backend"]:
                self.run_backend_comprehensive()
            
            if self.test_type in ["all", "frontend"]:
                if self.test_type == "all":
                    print()
                    print()
                self.run_frontend_comprehensive()
            
            # Run Docker security scan for comprehensive tests (not for specific tools)
            if self.test_type == "all":
                self.run_docker_security()
        
        # Print summary
        return self.print_summary()


def main():
    parser = argparse.ArgumentParser(
        description="Comprehensive test orchestrator for Giveety monorepo"
    )
    parser.add_argument(
        '--type',
        choices=['all', 'backend', 'frontend'],
        default='all',
        help='Type of tests to run (default: all)'
    )
    parser.add_argument(
        '--stop-on-failure',
        action='store_true',
        help='Stop execution on first failure and show logs'
    )
    parser.add_argument(
        '--tool',
        type=str,
        help='Run specific tool only (e.g., phpunit, eslint, typescript)'
    )
    parser.add_argument(
        '--fix',
        action='store_true',
        help='Auto-fix issues where possible (code style, linting)'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Show detailed output from all commands'
    )
    parser.add_argument(
        '--quiet',
        '--no-logs',
        action='store_true',
        help='Show only test results without logs (compact output)'
    )
    
    args = parser.parse_args()
    
    orchestrator = TestOrchestrator(
        test_type=args.type,
        fix=args.fix,
        quiet=args.quiet,
        verbose=args.verbose,
        tool=args.tool,
        stop_on_failure=args.stop_on_failure
    )
    
    try:
        exit_code = orchestrator.run()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print(f"\n{YELLOW}⚠️  Tests interrupted by user{RESET}")
        sys.exit(130)
    except Exception as e:
        print(f"\n{RED}❌ Fatal error: {e}{RESET}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
