import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import AppLayout from "@/adapter/ui/components/composite/AppLayout";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "fr",
}));

vi.mock("@/adapter/ui/utils/mediaQueries", () => ({
  useIsMobile: vi.fn(() => false),
}));

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("AppLayout", () => {
  it("renders Header", () => {
    render(
      wrap(
        <AppLayout>
          <span>Content</span>
        </AppLayout>,
      ),
    );
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header.querySelector('img[alt="Giveety Logo"]')).toBeInTheDocument();
  });

  it("renders main with children", () => {
    render(
      wrap(
        <AppLayout>
          <span data-testid="app-children">Page content</span>
        </AppLayout>,
      ),
    );
    expect(screen.getByTestId("app-children")).toBeInTheDocument();
    expect(screen.getByTestId("app-children")).toHaveTextContent(
      "Page content",
    );
  });

  it("renders main landmark", () => {
    render(
      wrap(
        <AppLayout>
          <div>Child</div>
        </AppLayout>,
      ),
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders Footer", () => {
    render(
      wrap(
        <AppLayout>
          <div>Child</div>
        </AppLayout>,
      ),
    );
    const footer =
      document.querySelector("footer") ?? screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });
});
