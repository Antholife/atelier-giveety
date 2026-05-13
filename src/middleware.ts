import createMiddleware from "next-intl/middleware";
import { i18nRouting } from "@/infra/i18n/routing";

export default createMiddleware(i18nRouting);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
