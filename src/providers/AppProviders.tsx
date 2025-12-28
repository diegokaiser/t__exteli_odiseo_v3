'use client';

import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PrimeReactProvider } from 'primereact/api';

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useGlobalAuth();
  return (
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </PrimeReactProvider>
  );
};
