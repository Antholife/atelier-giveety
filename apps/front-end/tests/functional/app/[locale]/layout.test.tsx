import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "@/app/[locale]/layout";

vi.mock("next/font/google", () => ({
  Mulish: () => ({ variable: "--font-mulish" }),
}));

vi.mock("next-intl", () => {
  const t = (key: string) => key;
  (t as unknown as { rich: (key: string) => string }).rich = (key: string) =>
    key;
  return {
    hasLocale: () => true,
    useTranslations: () => t,
    useLocale: () => "fr",
  };
});

vi.mock("@/adapter/providers/server", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactElement }) => <>{children}</>,
}));

vi.mock("@/adapter/ui/components/composite/AppLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactElement }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

describe("Root layout (app/[locale]/layout)", () => {
  it("renders AppLayout and children when locale is valid", async () => {
    const children = <div data-testid="layout-child">Page content</div>;
    const params = Promise.resolve({ locale: "fr" });
    const el = await RootLayout({ children, params });
    render(el as ReactElement);

    expect(screen.getByTestId("app-layout")).toBeInTheDocument();
    expect(screen.getByTestId("layout-child")).toBeInTheDocument();
    expect(screen.getByTestId("layout-child")).toHaveTextContent(
      "Page content",
    );
  });
});
