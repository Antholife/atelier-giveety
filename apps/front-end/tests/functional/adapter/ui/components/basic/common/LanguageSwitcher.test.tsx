import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import LanguageSwitcher from "@/adapter/ui/components/basic/common/LanguageSwitcher";

vi.mock("next-intl", () => ({
  useLocale: () => "fr",
}));

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("LanguageSwitcher", () => {
  it("renders combobox with current locale FR", () => {
    render(wrap(<LanguageSwitcher />));
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("FR")).toBeInTheDocument();
  });

  it("opens dropdown on click and shows options", async () => {
    render(wrap(<LanguageSwitcher />));
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "FR" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "EN" })).toBeInTheDocument();
  });
});
