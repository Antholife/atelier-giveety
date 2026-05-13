import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import Modal from "@/adapter/ui/components/basic/common/Modal";

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("Modal", () => {
  it("renders children when open", () => {
    render(
      wrap(
        <Modal open onClose={() => {}}>
          <p>Contenu du modal</p>
        </Modal>,
      ),
    );
    expect(screen.getByText("Contenu du modal")).toBeInTheDocument();
  });

  it("does not render content when closed", () => {
    render(
      wrap(
        <Modal open={false} onClose={() => {}}>
          <p>Contenu caché</p>
        </Modal>,
      ),
    );
    expect(screen.queryByText("Contenu caché")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      wrap(
        <Modal open onClose={onClose}>
          <p>Contenu</p>
        </Modal>,
      ),
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
