import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import RangeSlider from "@/adapter/ui/components/basic/common/RangeSlider";

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("RangeSlider", () => {
  it("renders min and max inputs with value", () => {
    const onChange = vi.fn();
    render(
      wrap(
        <RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />,
      ),
    );
    const spinbuttons = screen.getAllByRole("spinbutton");
    expect(spinbuttons[0]).toHaveValue(20);
    expect(spinbuttons[1]).toHaveValue(80);
  });

  it("calls onChange when min input is blurred with new value", async () => {
    const onChange = vi.fn();
    render(
      wrap(
        <RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />,
      ),
    );
    const minInput = screen.getAllByRole("spinbutton")[0];
    await userEvent.clear(minInput);
    await userEvent.type(minInput, "30");
    minInput.blur();
    expect(onChange).toHaveBeenCalled();
  });
});
