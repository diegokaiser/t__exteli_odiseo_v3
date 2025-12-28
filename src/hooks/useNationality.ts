import apis from '@/apis';
import { Nationality } from '@/types/nationalities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useNationality = (id: string) => {
  return useQuery<Nationality | null>({
    queryKey: ['nationality', id],
    queryFn: () => apis.nationalities.GetNationality(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useNationalities = () => {
  return useQuery<Nationality[]>({
    queryKey: ['nationalities'],
    queryFn: async () => {
      const response = await apis.nationalities.GetAllNationalities();
      if (!response) return [];

      return response.map((item: any) => ({
        id: item.id,
        ...item.nationality,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const usePostNationality = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Nationality) => apis.nationalities.PostNationality(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['nationalities'],
      });
    },
  });
};
