import apis from '@/apis';
import { Notification, NotificationDB } from '@/types/notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, data }: { uid: string; data: NotificationDB }) =>
      apis.notification.PostNotification(uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
};

export const usePatchNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, data }: { uid: string; data: Partial<Notification> }) =>
      apis.notification.PatchNotification(uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid }: { uid: string }) => apis.notification.DeleteNotification(uid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
};
