import apis from '@/apis';
import { RegMasCalc } from '@/types/regmascalc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetCustomer = (id: string) => {
  return useQuery<RegMasCalc | null>({
    queryKey: ['customer-calc', id],
    queryFn: async () => {
      const customer = await apis.regmascalc.GetCustomer(id);
      if (!customer) return null;

      return {
        id: customer.id,
        fullName: `${customer.customer.firstName} ${customer.customer.lastName}`,
        ...customer.customer,
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetCustomers = () => {
  return useQuery<RegMasCalc[]>({
    queryKey: ['customers-calc'],
    queryFn: async () => {
      const response = await apis.regmascalc.GetCustomers();
      if (!response) return [];

      return response.map((item: any) => ({
        id: item.id,
        ...item,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const usePostCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<RegMasCalc, 'createdAt'>) => apis.regmascalc.PostCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-calc'] });
    },
  });
};
