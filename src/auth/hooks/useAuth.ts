'use client';

import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuth = (
  redirectAuthenticated = '/dashboard',
  redirectUnauthenticated = '/login',
  allowUnauthenticated: string[] = []
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
        const isPublicRoute = allowUnauthenticated.includes(currentPath);

        if (isPublicRoute) {
          router.replace(redirectAuthenticated);
        }
      } catch (error: any) {
        if (error.code !== 401) console.error(error);
        setUser(null);

        const currentPath = window.location.pathname;
        const isPublicRoute = allowUnauthenticated.includes(currentPath);

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
    await account.deleteSession('current');
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
