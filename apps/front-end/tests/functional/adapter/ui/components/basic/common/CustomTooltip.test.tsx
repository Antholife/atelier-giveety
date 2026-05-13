import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import CustomTooltip from "@/adapter/ui/components/basic/common/CustomTooltip";

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("CustomTooltip", () => {
  it("renders children", () => {
    render(
      wrap(
        <CustomTooltip title="Info">
          <button type="button">Hover me</button>
        </CustomTooltip>,
      ),
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("wraps child with tooltip title", async () => {
    render(
      wrap(
        <CustomTooltip title="Contenu du tooltip">
          <span>Trigger</span>
        </CustomTooltip>,
      ),
    );
    await userEvent.hover(screen.getByText("Trigger"));
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Contenu du tooltip",
    );
  });
});
