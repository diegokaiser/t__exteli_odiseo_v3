import apis from '@/apis';
import { Pack } from '@/types/packs';
import { useQuery } from '@tanstack/react-query';

export const usePacks = () => {
  return useQuery<Pack[]>({
    queryKey: ['packs'],
    queryFn: async () => {
      const packs = await apis.packs.GetPacks();
      if (!packs) return [];

      return packs.map((item: any) => ({
        id: item.id,
        ...item.packs,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
