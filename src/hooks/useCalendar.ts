import apis from '@/apis';
import { CalendarEvent, CalendarEventUI } from '@/types/calendar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCalendarEvent = (eventUid: string) => {
  return useQuery<CalendarEvent | null>({
    queryKey: ['calendar-event', eventUid],
    queryFn: () => apis.calendar.GetEvent(eventUid),
    staleTime: 1000 * 60 * 5,
    enabled: !!eventUid,
  });
};

export const useCalendarTodayHours = (date: string) => {
  return useQuery({
    queryKey: ['calendar-availableHours', date],
    queryFn: () => apis.calendar.GetTodayHours(date),
    enabled: !!date,
  });
};

export const useCalendarEvents = (userUid: string) => {
  return useQuery<CalendarEventUI[]>({
    queryKey: ['calendar-events', userUid],
    queryFn: () => apis.calendar.GetEvents(userUid),
    staleTime: 1000 * 60 * 5,
    enabled: !!userUid,
  });
};

export const useCalendarEventsToday = (userUid: string) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return useQuery<CalendarEventUI[]>({
    queryKey: ['calendar-events-today', userUid, formattedDate],
    queryFn: async () => {
      const events = await apis.calendar.GetEvents(userUid);
      if (!events) return [];
      return events.filter((event) => {
        const eventDate = new Date(event.start);
        const eventDateStr = eventDate.toISOString().split('T')[0];
        return eventDateStr === formattedDate;
      });
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!userUid,
  });
};

export const usePostCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userUid: string; event: Omit<CalendarEvent, 'id'> }) =>
      apis.calendar.PostEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['calendar-events'],
      });
    },
  });
};
