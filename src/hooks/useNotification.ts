import apis from '@/apis';
import { Notification, NotificationDB } from '@/types/notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';

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
    mutationFn: ({ uid, data }: { uid: string; data: Partial<Notification> }) => {
      const parsedData = {
        ...data,
        hour: data.hour ? Timestamp.fromDate(new Date(data.hour)) : undefined,
      };
      return apis.notification.PatchNotification(uid, parsedData as Partial<NotificationDB>);
    },
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
