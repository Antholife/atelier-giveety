/**
 * Mock for next/navigation used in tests.
 */
export function usePathname() {
  return "/fr/atelier-ui-ux";
}

export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
  };
}

export function useSearchParams() {
  return new URLSearchParams();
}

/** Stub for notFound() — tests can override with vi.mocked() if needed. */
export function notFound() {
  throw new Error("next/navigation notFound() called");
}
