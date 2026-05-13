import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import FieldDisplay from "@/adapter/ui/components/basic/common/FieldDisplay";

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("FieldDisplay", () => {
  it("renders label and value", () => {
    render(wrap(<FieldDisplay label="Nom" value="Dupont" />));
    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Dupont")).toBeInTheDocument();
  });

  it("renders empty value", () => {
    render(wrap(<FieldDisplay label="Email" value="" />));
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});
