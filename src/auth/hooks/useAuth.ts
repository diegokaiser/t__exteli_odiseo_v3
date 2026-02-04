'use client';

import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ALLOW_UNAUTHENTICATED = ['/landings', '/calendar/reserva', '/api/stripe'];

export const useAuth = (
  redirectAuthenticated = '/dashboard',
  redirectUnauthenticated = '/login'
) => {
  const [user, setUser] = useState<Models.User<{}> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        const currentPath = window.location.pathname;
        const isPublicRoute = ALLOW_UNAUTHENTICATED.some((path) => currentPath.startsWith(path));

        if (isPublicRoute) {
          router.replace(redirectAuthenticated);
        }
      } catch (error: any) {
        if (error.code !== 401) console.error(error);
        setUser(null);

        const currentPath = window.location.pathname;
        const isPublicRoute = ALLOW_UNAUTHENTICATED.some((path) => currentPath.startsWith(path));

        if (!isPublicRoute) {
          router.replace(redirectUnauthenticated);
        }
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      await account.deleteSession('current');
    } catch (error: any) {
      if (error.code !== 401) console.error(error);
    }
    await account.createEmailPasswordSession(email, password);
    if (remember) {
      localStorage.setItem('lastUser', JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem('lastUser');
    }

    const currentUser = await account.get();
    setUser(currentUser);
    router.replace(redirectAuthenticated);
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('lastUser');
    setUser(null);
    router.push(redirectUnauthenticated);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};
