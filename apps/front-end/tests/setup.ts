import "@testing-library/jest-dom";
import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom does not implement these APIs — stubbed to avoid "Not implemented" in test output
if (typeof window !== "undefined") {
  window.scrollTo = vi.fn();
}
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Extend Vitest's expect with jest-dom matchers
expect.extend({
  // @testing-library/jest-dom matchers are automatically available
});
