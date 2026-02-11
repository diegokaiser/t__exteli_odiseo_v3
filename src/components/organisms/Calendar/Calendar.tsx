'use client';

import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog } from 'primereact/dialog';
import { useRef, useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { useCalendarAllEvents } from '@/hooks/useCalendar';
import { useUser } from '@/hooks/useUsers';
import { calendarDateFormat } from '@/utils/calendarDateFormat';

const Calendar = ({ userUid }: { userUid: string }) => {
  const { user } = useAuth();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [eventDialog, setEventDialog] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    venue: '',
    client: '',
    agent: '',
  });
  const calendarRef = useRef(null);
  const { data: events, isLoading: loadingEvents, isError: errorEvents } = useCalendarAllEvents();
  const { data: agentData, isLoading: loadingAgent } = useUser(agentId || '');

  const headerDialog = <></>;
  const footerDialog = (
    <>
      {user?.labels[0] === 'Administrador' && (
        <div className="flex justify-center w-full">
          <button className="bg-[#ef4444] font-bold h-[46px] mr-0! text-white px-4 py-2 rounded-md">
            Cancelar evento
          </button>
        </div>
      )}
    </>
  );

  const handleSelect = (selectInfo: any) => {
    let calendar = selectInfo.view.calendar;
    calendar.unselect();
  };
  const handleEventClick = (selectInfo: any) => {
    const event = selectInfo.event;

    setEventDialog({
      title: event.title,
      description: event.extendedProps.description,
      start: event.start,
      end: event.end,
      venue: event.extendedProps.venue,
      client: event.id,
      agent: event.extendedProps.agent,
    });
    setAgentId(event.extendedProps.agent);
    setVisibleDialog(true);
  };
  const handleCancelEvent = () => {};
  const handleEditEvent = () => {};

  return (
    <>
      <FullCalendar
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
        slotDuration="00:30:00"
        navLinks={true}
        height="auto"
        droppable={true}
        selectable={true}
        selectMirror={true}
        editable={true}
        dayMaxEvents={true}
        handleWindowResize={true}
        select={handleSelect}
        eventClick={handleEventClick}
        events={events}
        initialView="dayGridMonth"
        locale={esLocale}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        timeZone="Europe/Madrid"
        slotMinTime="10:00:00"
        slotMaxTime="18:00:00"
        nowIndicator={true}
        ref={calendarRef}
      />
      <Dialog
        visible={visibleDialog}
        modal
        footer={footerDialog}
        style={{ width: '50vw' }}
        onHide={() => {
          if (!visibleDialog) return;
          setVisibleDialog(false);
        }}
      >
        <div className="w-full">
          <div className="flex flex-wrap gap-y-5">
            <div className="w-1/12">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                <i className="pi pi-crown"></i>
              </div>
            </div>
            <div className="w-11/12">
              <strong>Título:</strong>
              <p>{eventDialog.title}</p>
            </div>
            <div className="w-1/12">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                <i className="pi pi-map-marker"></i>
              </div>
            </div>
            <div className="w-11/12">
              <strong>Lugar:</strong>
              <p>{eventDialog.venue}</p>
            </div>
            <div className="w-1/12">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                <i className="pi pi-calendar"></i>
              </div>
            </div>
            <div className="w-11/12">
              <strong>Fecha:</strong>
              <p>{calendarDateFormat(eventDialog.start)}</p>
            </div>
            <div className="w-1/12">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                <i className="pi pi-align-left"></i>
              </div>
            </div>
            <div className="w-11/12">
              <strong>Descripción:</strong>
              <p>{eventDialog.description}</p>
            </div>
            <div className="w-1/12">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                <i className="pi pi-user"></i>
              </div>
            </div>
            <div className="w-11/12">
              <strong>Agente:</strong>
              <p>
                {loadingAgent ? 'Cargando...' : agentData?.firstName + ' ' + agentData?.lastName}
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Calendar;
