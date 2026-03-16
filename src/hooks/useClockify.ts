import apis from '@/apis';
import {
  ClockifyDay,
  ClockifyDayWithUser,
  ClockifyDayWithUserUI,
  HoursYearDoc,
  PatchContext,
  PatchMonthVars,
} from '@/types/clockify';
import { clockifyRecordHour } from '@/utils/clockifyRecordHour';
import { clockifyToSecondsNanos } from '@/utils/ClockifyToSecondsNanos';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

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

export const useGetRecordsToday = (userUid: string) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return useQuery<ClockifyDay[]>({
    queryKey: ['records-today', userUid, formattedDate],
    queryFn: async () => {
      const records = await apis.clockify.GetRecordsByPeriod({
        userUid,
        startDate: formattedDate,
        endDate: formattedDate,
      });

      return records ?? [];
    },
    enabled: !!userUid,
  });
};

export const useGetAllRecordsByDay = (day: string) => {
  return useQuery<ClockifyDayWithUser[]>({
    queryKey: ['records-all-by-day', day],
    queryFn: async () => await apis.clockify.GetAllRecordsByDay(day),
    enabled: !!day,
    staleTime: 1000 * 60 * 5,
    select: (data) => [...data].sort((a, b) => a.userUid.localeCompare(b.userUid)),
  });
};

export const useGetAllRecordsByDayWithUsers = (day: string) => {
  const recordsQuery = useQuery<(ClockifyDay & { id: string; userUid: string })[]>({
    queryKey: ['records-all-by-day-with-users', day],
    queryFn: async () => (await apis.clockify.GetAllRecordsByDay(day)) ?? [],
    enabled: !!day,
    staleTime: 1000 * 60 * 5,
  });

  const userUids = useMemo(() => {
    const set = new Set<string>();
    (recordsQuery.data ?? []).forEach((d) => set.add(d.userUid));
    return Array.from(set);
  }, [recordsQuery.data]);

  const userNameQueries = useQueries({
    queries: userUids.map((uid) => ({
      queryKey: ['user-name', uid],
      queryFn: () => apis.users.GetUserName(uid),
      enabled: recordsQuery.isSuccess && !!uid,
      staleTime: 1000 * 60 * 30,
    })),
  });

  const userNameMap = useMemo(() => {
    const map = new Map<string, string>();
    userUids.forEach((uid, idx) => {
      const q = userNameQueries[idx];
      const fullName =
        (q?.data as any)?.fullName ??
        (q?.data as any)?.userFullName ??
        (q?.data as any)?.name ??
        '';
      if (fullName) map.set(uid, fullName);
    });
    return map;
  }, [userUids, userNameQueries]);

  const data: ClockifyDayWithUserUI[] = useMemo(() => {
    return (recordsQuery.data ?? []).map((dayDoc) => {
      return {
        id: dayDoc.id,
        userUid: dayDoc.userUid,
        userFullName: userNameMap.get(dayDoc.userUid) ?? '-',
        date: dayDoc.date,
        records: (dayDoc.records ?? []).map((r: any) => {
          const { seconds, nanoseconds } = clockifyToSecondsNanos(r.registeredAt);
          return {
            registeredAt: { seconds, nanoseconds },
            registeredAtFormated: clockifyRecordHour(seconds),
            type: r.type,
            name: r.name ?? '',
            description: r.description ?? '',
            updatedBy: r.updatedBy ?? '',
          };
        }),
      };
    });
  }, [recordsQuery.data, userNameMap]);

  const isLoadingUsers = userNameQueries.some((q) => q.isLoading);
  const isErrorUsers = userNameQueries.some((q) => q.isError);

  return {
    ...recordsQuery,
    data,
    isLoading: recordsQuery.isLoading || isLoadingUsers,
    isError: recordsQuery.isError || isErrorUsers,
  };
};

export const usePostRecord = () => {
  return useMutation({
    mutationFn: apis.clockify.PostRecord,
  });
};

export const useGetHoursByYear = (year: string, enabled: boolean) => {
  return useQuery<HoursYearDoc | null>({
    queryKey: ['hours-by-year', year],
    queryFn: () => apis.clockify.GetHoursByYear(year),
    enabled: enabled && Boolean(year),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

export const usePatchHoursByYear = () => {
  const qc = useQueryClient();

  return useMutation<
    boolean, // TData
    Error, // TError
    PatchMonthVars, // TVariables
    PatchContext // TContext
  >({
    mutationFn: ({ year, month, totalHours }) =>
      apis.clockify.PatchHoursByYear(year, month, totalHours),

    onMutate: async ({ year, month, totalHours }) => {
      const key = ['hours-by-year', year] as const;

      await qc.cancelQueries({ queryKey: key });

      const previous = qc.getQueryData<HoursYearDoc | null>(key);

      qc.setQueryData<HoursYearDoc | null>(key, (curr) => {
        if (!curr) return curr;

        return {
          ...curr,
          months: {
            ...curr.months,
            [month]: { totalHours },
          },
        };
      });

      return { previous }; // 👈 ahora TS sabe qué es
    },

    onError: (_err, vars, ctx) => {
      const key = ['hours-by-year', vars.year] as const;

      if (ctx?.previous !== undefined) {
        qc.setQueryData(key, ctx.previous);
      }
    },
  });
};
