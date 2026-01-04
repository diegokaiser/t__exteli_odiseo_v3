import apis from '@/apis';
import { Accounting } from '@/types/accounting';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAccounting = (id: string) => {
  return useQuery<Accounting | null>({
    queryKey: ['accounting', id],
    queryFn: async () => {
      const accounting = await apis.accounting.GetAccounting(id);
      if (!accounting) return null;
      return {
        id: accounting.id,
        ...accounting.accounting,
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAccountings = () => {
  return useQuery<Accounting[]>({
    queryKey: ['accountings'],
    queryFn: async () => {
      const response = await apis.accounting.GetAllAcounting();
      if (!response) return [];
      return response.map((item: any) => ({
        id: item.id,
        ...item.accounting,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const usePostAccounting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Accounting, 'createdAt'>) => apis.accounting.PostAccounting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accountings'],
      });
    },
  });
};
