import apis from '@/apis';
import { Customer } from '@/types/customers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type UpdatePayload = {
  id: string;
  updates: Partial<Omit<Customer, 'createdAt'>>;
};

export const useCustomer = (id: string) => {
  return useQuery<Customer | null>({
    queryKey: ['customer', id],
    queryFn: async () => {
      const customer = await apis.customers.GetCustomer(id);
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

export const useCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await apis.customers.GetAllCustomers();
      if (!response) return [];

      return response.map((item: any) => ({
        id: item.id,
        ...item.customer,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useCustomerName = (id: string) => {
  return useQuery<string>({
    queryKey: ['customer-name', id],
    queryFn: async () => {
      const response = await apis.customers.GetCustomerName(id);
      if (!response) return '';
      return response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCustomersByStatus = (status: string) => {
  return useQuery<Customer[]>({
    queryKey: ['customers', 'status', status],
    queryFn: () => apis.customers.GetCustomersByStatus(status),
    enabled: !!status,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCustomersByAgent = (agentUid: string) => {
  return useQuery<Customer[]>({
    queryKey: ['customers', 'agent', agentUid],
    queryFn: () => apis.customers.GetAllCustomersByAgent(agentUid),
    enabled: !!agentUid,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePostCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Customer, 'createdAt'>) => apis.customers.PostCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: UpdatePayload) => apis.customers.PatchCustomer(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
    },
  });
};
