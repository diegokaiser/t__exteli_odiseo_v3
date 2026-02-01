import apis from '@/apis';
import { User } from '@/types/users';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type UpdatePayload = {
  id: string;
  updates: Partial<Omit<User, 'createdAt'>>;
};

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

/*
export const usePostUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<User, 'createdAt'>) => apis.users.PostUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
*/

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: UpdatePayload) => apis.users.PatchUser(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
};
