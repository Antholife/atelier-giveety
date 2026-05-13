import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";

/**
 * Props for server-side provider components
 */
type Props = {
  children: ReactNode;
  locale: string;
};

/**
 * Server-side providers wrapper
 *
 * Provides internationalization support for server-side rendering.
 * Fetches messages for the specified locale and wraps children with NextIntlClientProvider.
 *
 * @param children - React children components
 * @param locale - Current locale string
 * @returns ProvidersServer component
 */
export default async function ProvidersServer({ children, locale }: Props) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
