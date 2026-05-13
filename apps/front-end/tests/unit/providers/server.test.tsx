import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProvidersServer from "@/adapter/providers/server";

vi.mock("next-intl/server", () => ({
  getMessages: vi.fn(() => Promise.resolve({})),
}));

describe("ProvidersServer", () => {
  it("renders children when provided", async () => {
    const element = await ProvidersServer({
      children: <div data-testid="child">Child content</div>,
      locale: "fr",
    });
    render(element);
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("wraps children with NextIntlClientProvider for the given locale", async () => {
    const element = await ProvidersServer({
      children: <span>Test child</span>,
      locale: "en",
    });
    render(element);
    expect(screen.getByText("Test child")).toBeInTheDocument();
  });

  it("renders without crashing when children is null", async () => {
    const element = await ProvidersServer({
      children: null,
      locale: "fr",
    });
    const { container } = render(element);
    expect(container).toBeInTheDocument();
  });

  it("renders multiple children", async () => {
    const element = await ProvidersServer({
      children: (
        <>
          <span>First</span>
          <span>Second</span>
        </>
      ),
      locale: "fr",
    });
    render(element);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("calls getMessages once per render", async () => {
    const { getMessages } = await import("next-intl/server");
    const getMessagesSpy = vi.mocked(getMessages);
    getMessagesSpy.mockClear();

    const element = await ProvidersServer({
      children: <div>Content</div>,
      locale: "fr",
    });
    render(element);
    expect(getMessagesSpy).toHaveBeenCalledTimes(1);
  });
});
