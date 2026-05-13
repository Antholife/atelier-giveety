import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import CheckboxField from "@/adapter/ui/components/basic/common/CheckboxField";

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("CheckboxField", () => {
  it("renders label and calls onToggle when checkbox clicked", () => {
    const onToggle = vi.fn();
    const onChange = vi.fn();
    render(
      wrap(
        <CheckboxField
          checked={false}
          value=""
          label="Accepter les conditions"
          onToggle={onToggle}
          onChange={onChange}
        />,
      ),
    );
    expect(screen.getByText("Accepter les conditions")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows input when showInput is true", () => {
    render(
      wrap(
        <CheckboxField
          checked={true}
          value="valeur"
          label="Champ"
          onToggle={() => {}}
          onChange={() => {}}
          showInput
        />,
      ),
    );
    expect(screen.getByDisplayValue("valeur")).toBeInTheDocument();
  });

  it("shows helperText when provided", () => {
    render(
      wrap(
        <CheckboxField
          checked={false}
          value=""
          label="Champ"
          onToggle={() => {}}
          onChange={() => {}}
          helperText="Message d'aide"
        />,
      ),
    );
    expect(screen.getByText("Message d'aide")).toBeInTheDocument();
  });

  it("renders email input when inputType is email", () => {
    const { container } = render(
      wrap(
        <CheckboxField
          checked
          value=""
          label="Email"
          onToggle={() => {}}
          onChange={() => {}}
          inputType="email"
        />,
      ),
    );
    const input = container.querySelector('input[type="email"]');
    expect(input).toBeInTheDocument();
  });

  it("shows placeholder when provided", () => {
    render(
      wrap(
        <CheckboxField
          checked
          value=""
          label="Site"
          onToggle={() => {}}
          onChange={() => {}}
          placeholder="Ex. https://www.example.ch"
        />,
      ),
    );
    expect(
      screen.getByPlaceholderText("Ex. https://www.example.ch"),
    ).toBeInTheDocument();
  });
});
