import apis from '@/apis';
import { Procedure } from '@/types/procedures';
import { useQuery } from '@tanstack/react-query';

export const useProcedure = (id: string) => {
  return useQuery<Procedure | null>({
    queryKey: ['procedure', id],
    queryFn: async () => {
      const procedure = await apis.procedures.GetProcedure(id);
      if (!procedure) return null;

      return {
        id: procedure.id,
        ...procedure,
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProcedures = () => {
  return useQuery<Procedure[]>({
    queryKey: ['procedures'],
    queryFn: async () => {
      const procedures = await apis.procedures.GetProcedures();
      if (!procedures) return [];

      return procedures.map((item: any) => ({
        id: item.id,
        ...item.procedure,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
