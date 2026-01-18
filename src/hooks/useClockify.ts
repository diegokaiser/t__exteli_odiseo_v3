import apis from '@/apis';
import { ClockifyDay } from '@/types/clockify';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetRecords = (id: string) => {
  return useQuery<ClockifyDay[]>({
    queryKey: ['records', id],
    queryFn: async () => {
      const records = await apis.clockify.GetRecords(id);
      if (!records) return [];
      return records;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetRecordsByPeriod = ({
  userUid,
  startDate,
  endDate,
}: {
  userUid: string;
  startDate: string;
  endDate: string;
}) => {
  return useQuery<ClockifyDay[]>({
    queryKey: ['records-period', userUid, startDate, endDate],
    queryFn: () => apis.clockify.GetRecordsByPeriod({ userUid, startDate, endDate }),
    enabled: !!userUid && !!startDate && !!endDate,
  });
};

export const usePostRecord = () => {
  return useMutation({
    mutationFn: apis.clockify.PostRecord,
  });
};
