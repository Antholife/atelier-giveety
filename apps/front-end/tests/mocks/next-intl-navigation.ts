/**
 * Mock for next-intl/navigation (used by Vitest alias).
 * Prevents loading next/navigation in tests.
 * Records the config passed to createNavigation for assertions.
 */
let lastCreateNavigationConfig: unknown;

export function createNavigation(config: unknown) {
  lastCreateNavigationConfig = config;
  return {
    Link: function MockLink() {
      return null;
    },
    redirect: () => {},
    usePathname: () => "",
    useRouter: () => ({}),
    getPathname: () => "",
  };
}

export function getLastCreateNavigationConfig(): unknown {
  return lastCreateNavigationConfig;
}
