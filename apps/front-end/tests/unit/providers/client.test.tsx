import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProvidersClient from "@/adapter/providers/client";

describe("ProvidersClient", () => {
  it("renders children when provided", () => {
    render(
      <ProvidersClient>
        <div data-testid="child">Child content</div>
      </ProvidersClient>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("wraps children with theme and query client providers", () => {
    render(
      <ProvidersClient>
        <span>Test child</span>
      </ProvidersClient>,
    );
    expect(screen.getByText("Test child")).toBeInTheDocument();
  });

  it("renders without crashing when children is null", () => {
    const { container } = render(<ProvidersClient>{null}</ProvidersClient>);
    expect(container).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <ProvidersClient>
        <span>First</span>
        <span>Second</span>
      </ProvidersClient>,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
