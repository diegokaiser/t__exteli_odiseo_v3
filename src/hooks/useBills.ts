import apis from '@/apis';
import { Bill } from '@/types/bills';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useBill = (id: string) => {
  return useQuery<Bill | null>({
    queryKey: ['bill', id],
    queryFn: async () => {
      const bill = await apis.bills.GetBill(id);
      if (!bill) return null;
      return {
        id: bill.id,
        number: `${bill.billSerial}-${bill.billNumber}`,
        ...bill,
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBills = () => {
  return useQuery<Bill[]>({
    queryKey: ['bills'],
    queryFn: async () => {
      const response = await apis.bills.GetAllBills();
      if (!response) return [];
      return response.map((item: any) => ({
        id: item.id,
        number: `${item.billSerial}-${item.billNumber}`,
        ...item,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetLastBill = () => {
  return useQuery({
    queryKey: ['last-bill'],
    queryFn: async () => {
      const bill = await apis.bills.GetLastBill();
      if (!bill) return null;
      return bill.billNumber;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const usePostBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Bill, 'createdAt'>) => apis.bills.PostBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bills'],
      });
    },
  });
};

export const usePaidBill = () => {
  return useMutation({
    mutationFn: (id: string) => apis.bills.PaidBill(id),
  });
};

export const useCancelBill = () => {
  return useMutation({
    mutationFn: (id: string) => apis.bills.CancelBill(id),
  });
};
