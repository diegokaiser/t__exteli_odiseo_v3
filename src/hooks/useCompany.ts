import apis from '@/apis';
import { Company } from '@/types/company';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCompany = (id: string) => {
  return useQuery<Company | null>({
    queryKey: ['company', id],
    queryFn: async () => {
      const company = await apis.company.GetCompany(id);
      if (!company) return null;
      return company;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCompanies = () => {
  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const companies = await apis.company.GetCompanies();
      if (!companies) return [];
      return companies;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const usePostCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Company, 'createdAt'>) => apis.company.PostCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
    },
  });
};

export const usePatchCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, company }: { id: string; company: Omit<Company, 'createdAt'> }) =>
      apis.company.PatchCompany(id, company),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
    },
    onError: (error) => {
      console.error('Error al actualizar datos de la empresa', error);
    },
  });
};
