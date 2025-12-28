'use client';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import type { FC } from 'react';

type WithAuthOptions = {
  redirectAuthenticated: string;
  redirectUnauthenticated: string;
  allowUnauthenticated?: string[];
};

export function withAuth(Component: FC, options?: WithAuthOptions): FC {
  return function WithAuthWrapper() {
    const { user, loading } = useAuth(
      options?.redirectAuthenticated ?? '/dashboard',
      options?.redirectUnauthenticated ?? '/login',
      options?.allowUnauthenticated ?? ['/login', '/forgot-password']
    );

    if (loading) {
      return <LoadingScreen />;
    }

    return <Component />;
  };
}
