import apis from '@/apis';
import { LineHook, Timeline } from '@/types/timelines';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useTimeline = (id: string) => {
  return useQuery<LineHook[] | null>({
    queryKey: ['timeline', id],
    queryFn: async () => {
      const data = await apis.timelines.GetLine(id);
      if (!data) return null;

      return data.map(({ registerdBy, ...rest }) => ({
        ...rest,
        registerdByUid: registerdBy?.uid ?? '',
        registerdBy: `${registerdBy?.firstName ?? ''} ${registerdBy?.lastName ?? ''}`,
        createdAt: registerdBy?.createdAt,
      }));
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTimelines = () => {
  return useQuery<Timeline[]>({
    queryKey: ['timelines'],
    queryFn: () => apis.timelines.GetLines(),
    staleTime: 1000 * 60 * 5,
  });
};

export const usePostTimeline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Timeline, 'createdAt'>) => apis.timelines.PostTimeline(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timelines'],
      });
    },
  });
};
