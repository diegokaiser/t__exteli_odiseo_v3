import apis from '@/apis';
import { User } from '@/types/users';
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => apis.users.GetUsers(),
    staleTime: 1000 * 60 * 5,
  });
};
