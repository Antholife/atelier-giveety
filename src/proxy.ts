/**
 * Next.js middleware for internationalization
 *
 * Handles internationalization routing via next-intl middleware.
 * Currently, authentication checks are disabled (commented out) but
 * the structure is preserved for future implementation.
 *
 * The middleware:
 * - Processes all routes except API routes, Next.js internal routes, and static files
 * - Applies internationalization routing based on the locale in the URL
 * - Can be extended with authentication checks when needed
 */
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { i18nRouting } from "./infra/i18n/routing";

/**
 * Next-intl middleware handler
 *
 * Creates a middleware instance for internationalization routing.
 * This middleware handles locale detection, pathname localization,
 * and routing based on the i18n configuration.
 */
const handleI18n = createMiddleware(i18nRouting);

/**
 * Main middleware function
 *
 * Processes incoming requests and applies internationalization routing.
 * Currently, authentication checks are commented out but can be enabled
 * by uncommenting the relevant code sections.
 *
 * @param req - Next.js request object containing URL, cookies, and headers
 * @returns NextResponse with i18n routing applied, or redirect if authentication is required
 *
 * @example
 * ```typescript
 * // Authentication check (currently disabled)
 * // const sessionCookie = req.cookies.get("session_state");
 * // if (!sessionCookie) {
 * //   return NextResponse.redirect(loginUrl);
 * // }
 * ```
 */
export async function proxy(req: NextRequest) {
  // Authentication check (currently disabled)
  // Uncomment the following code to enable authentication:
  /*
  const HTTPS_PORT = process.env.NEXT_PUBLIC_HTTPS_PORT;
  const portPart = HTTPS_PORT && HTTPS_PORT !== "443" ? `:${HTTPS_PORT}` : "";
  const BACKEND_URL = `https://${process.env.NEXT_PUBLIC_API_HOSTNAME}${portPart}`;
  const redirectParam = encodeURIComponent(req.nextUrl.pathname);

  const sessionCookie = req.cookies.get("session_state");
  if (!sessionCookie) {
    const redirectUrl = `${BACKEND_URL}/auth/login?redirect=${redirectParam}`;
    return NextResponse.redirect(redirectUrl);
  }
  */

  return handleI18n(req);
}

/**
 * Middleware configuration
 *
 * Defines which routes the middleware should handle using a regex pattern.
 * The matcher excludes:
 * - API routes (`/api/*`)
 * - Next.js internal routes (`/_next/*`)
 * - Static files (files with extensions like `.js`, `.css`, `.png`, etc.)
 *
 * @example
 * ```typescript
 * // Matches: /, /fr, /en
 * // Excludes: /api/users, /_next/static, /favicon.ico
 * ```
 */
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
