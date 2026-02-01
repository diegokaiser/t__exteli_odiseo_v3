import apis from '@/apis';
import { Bill } from '@/types/bills';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Status = 'Pagado' | 'pendiente' | 'Cancelado';
type Period = 'actual' | 'anterior';

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

export const useGetBillsByStatus = (status: string) => {
  return useQuery({
    queryKey: ['bills-by-status', status],
    queryFn: async () => {
      const response = await apis.bills.GetBillsByStatus(status);
      if (!response) return [];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      return response.filter((bill: any) => {
        const createdAt = new Date(bill.createdAt.seconds * 1000);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      });
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetBillsByStatusDashboard = (status: string) => {
  return useQuery({
    queryKey: ['bills-by-status-dashboard', status],
    queryFn: async () => {
      const response = await apis.bills.GetBillsByStatusDashboard(status);
      if (!response) return [];
      return response;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetBillsByStatusRaw = (status: string) => {
  return useQuery({
    queryKey: ['bills-by-status-raw', status],
    queryFn: async () => {
      const response = await apis.bills.GetBillsByStatus(status);
      if (!response) return [];
      return response;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useMonthlyBillTotal = (status: Status, period: Period = 'actual') => {
  const now = new Date();

  const month = now.getMonth();
  const year = now.getFullYear();

  const isPrevious = period === 'anterior';

  const selectedMonth = isPrevious ? (month === 0 ? 11 : month - 1) : month;
  const selectedYear = isPrevious && month === 0 ? year - 1 : year;

  const query = useQuery({
    queryKey: ['bills-total-by-month', status, selectedMonth, selectedYear],
    queryFn: () => apis.bills.GetBillsByStatusAndMonth(status, selectedMonth, selectedYear),
    staleTime: 1000 * 60 * 10,
  });

  const total = query.data?.reduce((acc, bill) => acc + bill.total, 0) ?? 0;

  return {
    total,
    ...query,
  };
};

export const useMonthlyBillCount = (status: Status, period: Period = 'actual') => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const isPrevious = period === 'anterior';

  const selectedMonth = isPrevious ? (month === 0 ? 11 : month - 1) : month;
  const selectedYear = isPrevious && month === 0 ? year - 1 : year;

  const query = useQuery({
    queryKey: ['bills-count-by-month', status, selectedMonth, selectedYear],
    queryFn: () => apis.bills.GetBillsByStatusAndMonthCount(status, selectedMonth, selectedYear),
    staleTime: 1000 * 60 * 10,
  });

  return {
    count: query.data ?? 0,
    ...query,
  };
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
