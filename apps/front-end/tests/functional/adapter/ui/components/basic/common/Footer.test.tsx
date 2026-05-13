import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import Footer from "@/adapter/ui/components/basic/common/Footer";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("Footer", () => {
  it("renders as footer with section titles (capitalized translation keys)", () => {
    render(wrap(<Footer />));
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("ExternalPages.aboutUs")).toBeInTheDocument();
    expect(screen.getByText("ExternalPages.ourServices")).toBeInTheDocument();
    expect(screen.getByText("ExternalPages.stayInTouch")).toBeInTheDocument();
  });

  it("renders legal links", () => {
    render(wrap(<Footer />));
    expect(screen.getByText("externalPages.faq")).toBeInTheDocument();
    expect(screen.getByText("externalPages.termsOfUse")).toBeInTheDocument();
  });
});
