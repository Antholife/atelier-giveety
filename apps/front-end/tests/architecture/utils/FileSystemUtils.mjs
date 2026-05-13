/**
 * File System Utilities for Architecture Validation
 * Shared utilities for navigating and analyzing source files
 */

import fs from "fs";
import path from "path";

export class FileSystemUtils {
  /**
   * Get all TypeScript files in a directory recursively
   */
  static getSourceFiles(dir, extensions = [".ts", ".tsx"]) {
    const files = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const walk = (currentDir) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          if (entry.name === "types") continue; // skip types directories (type-only, no test required)
          walk(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          // Exclude test files, type definition files, index files, type-only files (*.types.ts/tsx)
          if (
            extensions.includes(ext) &&
            !entry.name.includes(".test.") &&
            !entry.name.includes(".spec.") &&
            !entry.name.endsWith(".d.ts") &&
            entry.name !== "index.ts" &&
            entry.name !== "index.tsx" &&
            !entry.name.startsWith("types.") &&
            !entry.name.endsWith(".types.ts") &&
            !entry.name.endsWith(".types.tsx")
          ) {
            files.push(fullPath);
          }
        }
      }
    };

    walk(dir);
    return files;
  }

  /**
   * Check if a file exists
   */
  static fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  /**
   * Check if a directory exists
   */
  static directoryExists(dirPath) {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }

  /**
   * Get all directories in a path
   */
  static getDirectories(dirPath) {
    if (!this.directoryExists(dirPath)) {
      return [];
    }

    return fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  }

  /**
   * Get relative path from project root
   */
  static getRelativePath(projectRoot, fullPath) {
    return path.relative(projectRoot, fullPath);
  }

  /**
   * Parse file path into components
   */
  static parsePath(filePath) {
    return path.parse(filePath);
  }

  /**
   * Join path segments
   */
  static joinPath(...segments) {
    return path.join(...segments);
  }
}
