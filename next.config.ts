import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // `standalone` is only needed for Docker images (see Dockerfile prod stage).
  // Vercel handles its own runtime, so we opt-in via env var to avoid breaking
  // the Vercel build.
  ...(process.env.BUILD_STANDALONE === "true"
    ? { output: "standalone" as const }
    : {}),
  reactCompiler: true,
};

const withNextIntl = createNextIntlPlugin("./src/infra/i18n/request.ts");
export default withNextIntl(nextConfig);
