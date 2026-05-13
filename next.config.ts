import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
};

const withNextIntl = createNextIntlPlugin("./src/infra/i18n/request.ts");
export default withNextIntl(nextConfig);
