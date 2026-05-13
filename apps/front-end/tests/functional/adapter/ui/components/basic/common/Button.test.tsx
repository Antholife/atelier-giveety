import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ProvidersClient from "@/adapter/providers/client";
import Button from "@/adapter/ui/components/basic/common/Button";

function wrap(ui: ReactElement) {
  return <ProvidersClient>{ui}</ProvidersClient>;
}

describe("Button", () => {
  it("renders children and calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(
      wrap(
        <Button type="button" variant="contained" onClick={onClick}>
          Enregistrer
        </Button>,
      ),
    );
    expect(
      screen.getByRole("button", { name: "Enregistrer" }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      wrap(
        <Button type="button" variant="outlined" onClick={onClick} disabled>
          Désactivé
        </Button>,
      ),
    );
    expect(screen.getByRole("button")).toBeDisabled();
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as submit type", () => {
    render(
      wrap(
        <Button type="submit" variant="contained">
          Soumettre
        </Button>,
      ),
    );
    expect(screen.getByRole("button", { name: "Soumettre" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("renders outlined variant with border style", () => {
    render(
      wrap(
        <Button type="button" variant="outlined" color="primary">
          Outlined
        </Button>,
      ),
    );
    const button = screen.getByRole("button", { name: "Outlined" });
    expect(button).toBeInTheDocument();
    const styles = window.getComputedStyle(button);
    expect(parseFloat(styles.borderWidth)).toBeGreaterThan(0);
  });

  it("renders contained variant with filled background", () => {
    render(
      wrap(
        <Button type="button" variant="contained" color="tertiary">
          Contained
        </Button>,
      ),
    );
    const button = screen.getByRole("button", { name: "Contained" });
    const styles = window.getComputedStyle(button);
    expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(styles.backgroundColor).not.toBe("transparent");
  });

  it("renders appbar variant with transparent background", () => {
    render(
      wrap(
        <Button type="button" variant="appbar">
          AppBar
        </Button>,
      ),
    );
    const button = screen.getByRole("button", { name: "AppBar" });
    expect(button).toBeInTheDocument();
    const styles = window.getComputedStyle(button);
    expect(styles.backgroundColor).toMatch(
      /transparent|rgba\(0,\s*0,\s*0,\s*0\)/,
    );
  });

  it("renders link variant with underline", () => {
    render(
      wrap(
        <Button type="button" variant="link">
          Lien
        </Button>,
      ),
    );
    const button = screen.getByRole("button", { name: "Lien" });
    expect(button).toBeInTheDocument();
    const styles = window.getComputedStyle(button);
    expect(styles.textDecoration).toMatch(/underline/);
  });

  it("renders outlined with color primary", () => {
    render(
      wrap(
        <Button type="button" variant="outlined" color="primary">
          Primary
        </Button>,
      ),
    );
    expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument();
  });

  it("renders outlined with color error", () => {
    render(
      wrap(
        <Button type="button" variant="outlined" color="error">
          Erreur
        </Button>,
      ),
    );
    expect(screen.getByRole("button", { name: "Erreur" })).toBeInTheDocument();
  });

  it("renders contained with color primary", () => {
    render(
      wrap(
        <Button type="button" variant="contained" color="primary">
          Primary filled
        </Button>,
      ),
    );
    expect(
      screen.getByRole("button", { name: "Primary filled" }),
    ).toBeInTheDocument();
  });

  it("renders contained with color error", () => {
    render(
      wrap(
        <Button type="button" variant="contained" color="error">
          Erreur filled
        </Button>,
      ),
    );
    expect(
      screen.getByRole("button", { name: "Erreur filled" }),
    ).toBeInTheDocument();
  });

  it("applies custom sx when provided", () => {
    render(
      wrap(
        <Button type="button" variant="contained" sx={{ marginTop: "12px" }}>
          Custom
        </Button>,
      ),
    );
    const button = screen.getByRole("button", { name: "Custom" });
    expect(button).toBeInTheDocument();
    const styles = window.getComputedStyle(button);
    expect(styles.marginTop).toBe("12px");
  });

  it("renders with startIcon and endIcon", () => {
    const StartIcon = () => <span data-testid="start-icon">S</span>;
    const EndIcon = () => <span data-testid="end-icon">E</span>;
    render(
      wrap(
        <Button
          type="button"
          variant="contained"
          startIcon={<StartIcon />}
          endIcon={<EndIcon />}
        >
          Avec icônes
        </Button>,
      ),
    );
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Avec icônes/ }),
    ).toBeInTheDocument();
  });
});
