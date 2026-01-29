'use client';

import { useAuth } from '@/auth/hooks/useAuth';
import { useCalendarEventsToday } from '@/hooks/useCalendar';
import { calendarHourFormat } from '@/utils/calendarHourFormat';

const CardCalendar = () => {
  const { user } = useAuth();
  const {
    data: record,
    isLoading: loadingRecord,
    isError: errorRecord,
  } = useCalendarEventsToday(user?.$id || '');

  return (
    <>
      {record?.length === 0 ? (
        <>
          <div className="flex px-4 py-3">
            <div className="min-w-[34px] w-1/12">
              <div className="flex justify-center items-center h-[34px] w-[34px] rounded-[12px] border border-solid border-[#ef444480] bg-[#f5bebe80] text-[#ef4444]">
                <i className="pi pi-calendar"></i>
              </div>
            </div>
            <div className="flex items-center ml-3 w-11/12">
              <span className="block text-xs font-semibold">
                No tienes citas programadas para hoy
              </span>
            </div>
          </div>
        </>
      ) : (
        record?.map((event, index) => (
          <div className="flex px-4 py-3" key={index}>
            <div className="min-w-[34px] w-1/12">
              <div className="flex justify-center items-center h-[34px] w-[34px] rounded-[12px] border border-solid border-[#4680ff80] bg-[#E9F0FF80] text-[#4680ff]">
                <i className="pi pi-calendar"></i>
              </div>
            </div>
            <div className="flex flex-col items-start ml-3 w-11/12">
              <span className="block text-xs font-semibold">{event.title}</span>
              <span className="block text-xs font-light">
                {event.description} - {calendarHourFormat(event.start)}
              </span>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default CardCalendar;
