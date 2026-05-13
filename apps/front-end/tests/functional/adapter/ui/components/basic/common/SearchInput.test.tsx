import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import SearchInput from "@/adapter/ui/components/basic/common/SearchInput";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("SearchInput", () => {
  it("renders with value and calls onChange when typing", async () => {
    const onChange = vi.fn();
    render(wrap(<SearchInput value="" onChange={onChange} />));
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "React");
    expect(onChange).toHaveBeenCalled();
  });

  it("displays placeholder from prop", () => {
    render(
      wrap(
        <SearchInput
          value=""
          onChange={() => {}}
          placeholder="Rechercher..."
        />,
      ),
    );
    expect(screen.getByPlaceholderText("Rechercher...")).toBeInTheDocument();
  });

  it("displays current value", () => {
    render(wrap(<SearchInput value="test" onChange={() => {}} />));
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });
});
