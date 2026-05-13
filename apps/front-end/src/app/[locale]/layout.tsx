import type { RootLayoutProps } from "@/domain/types";
import ProvidersClient from "@/adapter/providers/client";
import ProvidersServer from "@/adapter/providers/server";
import AppLayout from "@/adapter/ui/components/composite/AppLayout";
import { i18nRouting } from "@/infra/i18n/routing";
import { hasLocale } from "next-intl";
import { Mulish } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

/**
 * Mulish font configuration
 *
 * Loads the Mulish font family with multiple weights for use throughout
 * the application. The font variable is applied to the HTML element
 * for global CSS variable access.
 */
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-mulish",
  display: "swap",
});

/**
 * Global layout for all pages under /[locale]/...
 *
 * Provides the HTML structure, Mulish font, providers and AppLayout.
 * Validates the locale and renders the shared app shell.
 */
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(i18nRouting.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={mulish.variable}>
      <body>
        <ProvidersServer locale={locale}>
          <ProvidersClient>
            <AppLayout>{children}</AppLayout>
          </ProvidersClient>
        </ProvidersServer>
      </body>
    </html>
  );
}
