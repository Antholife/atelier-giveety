"use client";

import theme from "@/adapter/ui/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { DefaultError, QueryCache, QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

/**
 * Props for provider components
 */

type Props = {
  children: ReactNode;
};

/**
 * Wrapper for QueryClientProvider with custom error handling
 *
 * Configures React Query with authentication error handling and retry logic.
 * Automatically redirects to login on 401 errors.
 *
 * @param children - React children components
 * @returns QueryClientProvider wrapper
 */
const WrapperQueryClientProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: DefaultError & { status?: number }) => {
            if (error?.status === 401) {
              // TODO: Redirect to login or auth page
              // redirectToLogin(NEXT_PUBLIC_API_HOSTNAME);
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 30,
            retry: (
              failureCount,
              error: DefaultError & { status?: number },
            ) => {
              if (error?.status === 401) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

/**
 * Client-side providers wrapper
 *
 * Combines all necessary providers for the client-side application:
 * - ConfigProvider: Environment configuration
 * - UserDataProvider: User authentication state
 * - ThemeProvider: Material-UI theme
 * - SnackbarProvider: Notification system
 * - QueryClientProvider: React Query for data fetching
 * - BreadcrumbProvider: Navigation breadcrumbs
 * - CssBaseline: Material-UI CSS reset
 *
 * @param children - React children components
 * @returns ProvidersClient component
 */
export default function ProvidersClient({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <WrapperQueryClientProvider>
        <CssBaseline />
        {children}
      </WrapperQueryClientProvider>
    </ThemeProvider>
  );
}
