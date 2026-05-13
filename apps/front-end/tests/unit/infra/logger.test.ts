import { afterEach, describe, expect, it, vi } from "vitest";

const noop = () => {};

describe("infra/logger", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = originalEnv;
    vi.resetModules();
  });

  it("log calls console.log in development", async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = "development";
    vi.resetModules();
    const logSpy = vi.spyOn(console, "log").mockImplementation(noop);
    const { log } = await import("@/infra/logger");
    log("hello");
    expect(logSpy).toHaveBeenCalledWith("hello");
    logSpy.mockRestore();
  });

  it("log does not call console.log in production", async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = "production";
    vi.resetModules();
    const logSpy = vi.spyOn(console, "log").mockImplementation(noop);
    const { log } = await import("@/infra/logger");
    log("hello");
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("warn calls console.warn in development", async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = "development";
    vi.resetModules();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(noop);
    const { warn } = await import("@/infra/logger");
    warn("warning");
    expect(warnSpy).toHaveBeenCalledWith("warning");
    warnSpy.mockRestore();
  });

  it("warn does not call console.warn in production", async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = "production";
    vi.resetModules();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(noop);
    const { warn } = await import("@/infra/logger");
    warn("warning");
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("error always calls console.error", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(noop);
    const { error } = await import("@/infra/logger");
    error("err");
    expect(errorSpy).toHaveBeenCalledWith("err");
    errorSpy.mockRestore();
  });

  it("debug calls console.debug in development", async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = "development";
    vi.resetModules();
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(noop);
    const { debug } = await import("@/infra/logger");
    debug("dbg");
    expect(debugSpy).toHaveBeenCalledWith("dbg");
    debugSpy.mockRestore();
  });

  it("debug does not call console.debug in production", async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = "production";
    vi.resetModules();
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(noop);
    const { debug } = await import("@/infra/logger");
    debug("dbg");
    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });
});
