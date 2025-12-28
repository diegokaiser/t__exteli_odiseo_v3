import { useAuth } from '@/auth/hooks/useAuth';

export function useGlobalAuth() {
  return useAuth('/dashboard', '/login', ['/login', '/forgot-password']);
}
