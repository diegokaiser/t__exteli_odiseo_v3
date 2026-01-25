import apis from '@/apis';
import { User } from '@/types/users';
import { useQuery } from '@tanstack/react-query';

export const useUser = (userUid: string) => {
  return useQuery<User | null>({
    queryKey: ['user', userUid],
    queryFn: () => apis.users.GetUser(userUid),
    staleTime: 1000 * 60 * 5,
    enabled: !!userUid,
  });
};

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apis.users.GetUsers();
      if (!response) return [];
      return response.map((item: any) => ({
        id: item.uid,
        name: `${item.firstName} ${item.lastName}`,
        ...item,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserName = (userUid: string) => {
  return useQuery({
    queryKey: ['user-name', userUid],
    queryFn: async () => {
      const response = await apis.users.GetUser(userUid);
      if (!response) return '';
      return `${response.firstName} ${response.lastName}`;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!userUid,
  });
};
