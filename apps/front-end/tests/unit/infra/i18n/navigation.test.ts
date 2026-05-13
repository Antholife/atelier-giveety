import {
  getPathname,
  Link,
  redirect,
  usePathname,
  useRouter,
} from "@/infra/i18n/navigation";
import { i18nRouting } from "@/infra/i18n/routing";
import { getLastCreateNavigationConfig } from "../../../mocks/next-intl-navigation";
import { describe, expect, it } from "vitest";

describe("infra/i18n/navigation", () => {
  it("calls createNavigation with i18nRouting", () => {
    expect(getLastCreateNavigationConfig()).toBe(i18nRouting);
  });

  it("exports Link, redirect, usePathname, useRouter, getPathname", () => {
    expect(Link).toBeDefined();
    expect(redirect).toBeDefined();
    expect(usePathname).toBeDefined();
    expect(useRouter).toBeDefined();
    expect(getPathname).toBeDefined();
  });

  it("exports are callable (functions or React components)", () => {
    expect(typeof redirect).toBe("function");
    expect(typeof usePathname).toBe("function");
    expect(typeof useRouter).toBe("function");
    expect(typeof getPathname).toBe("function");
    expect(typeof Link).toBe("function");
  });
});
