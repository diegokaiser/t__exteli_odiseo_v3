'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

interface AuthContextType {
  user: Models.User<{}> | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<{}> | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error: any) {
      if (error.code !== 401) console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email: string, password: string, remember: boolean) => {
    await account.createEmailPasswordSession(email, password);
    if (remember) {
      localStorage.setItem('lastUser', JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem('lastUser');
    }
    await getSession();
  }

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  }

  useEffect(() => {
    getSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
