import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

const { mockHandler } = vi.hoisted(() => ({
  mockHandler: vi.fn((_req: NextRequest) =>
    Promise.resolve(new Response(null, { status: 200 })),
  ),
}));

vi.mock("next-intl/middleware", () => ({
  default: () => mockHandler,
}));

describe("proxy", () => {
  it("calls i18n middleware with the request and returns its result", async () => {
    mockHandler.mockClear();
    const req = {
      nextUrl: { pathname: "/fr/atelier-ui-ux" },
    } as NextRequest;
    const { proxy } = await import("@/proxy");
    const result = await proxy(req);
    expect(mockHandler).toHaveBeenCalledWith(req);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(200);
  });

  it("config has matcher excluding api, _next and static files", async () => {
    const { config } = await import("@/proxy");
    expect(config.matcher).toEqual(["/((?!api|_next|.*\\..*).*)"]);
  });
});
