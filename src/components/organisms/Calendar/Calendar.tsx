'use client';

import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog } from 'primereact/dialog';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader } from '@/components/atoms';
import { useCalendarAllEvents } from '@/hooks/useCalendar';
import { useUser, useUsers } from '@/hooks/useUsers';
import { calendarDateFormat } from '@/utils/calendarDateFormat';

const Calendar = ({ userUid }: { userUid: string }) => {
  const { user } = useAuth();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [eventDialog, setEventDialog] = useState({
    id: '',
    title: '',
    description: '',
    start: '',
    end: '',
    venue: '',
    client: '',
    agent: '',
    phone: '',
    email: '',
  });
  const calendarRef = useRef(null);
  const { data: events, isLoading: loadingEvents, isError: errorEvents } = useCalendarAllEvents();
  const { data: agentData, isLoading: loadingAgent } = useUser(agentId || '');
  const { data: allUsers, isLoading: loadingAllUsers, isError: errorAllUsers } = useUsers();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });

  const selectedAgent = watch('agent');

  const handleSelect = (selectInfo: any) => {
    let calendar = selectInfo.view.calendar;
    calendar.unselect();
  };
  const handleEventClick = (selectInfo: any) => {
    const event = selectInfo.event;

    setEventDialog({
      id: event.id,
      title: event.title,
      description: event.extendedProps.description,
      start: event.start,
      end: event.end,
      venue: event.extendedProps.venue,
      client: event.id,
      agent: event.extendedProps.agent,
      phone: event.extendedProps.phone || '',
      email: event.extendedProps.email || '',
    });
    setAgentId(event.extendedProps.agent);
    setVisibleDialog(true);
  };
  const handleCancelEvent = () => {};
  const handleEditEvent = (formData: any) => {
    const payload = {
      uid: userUid,
      eventUid: eventDialog.id,
      agentAssigned: formData.agent,
    };

    console.log(payload);
  };

  const headerDialog = <></>;
  const footerDialog = <></>;

  console.log(eventDialog);

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
            {eventDialog.phone && (
              <>
                <div className="w-1/12">
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                    <i className="pi pi-mobile"></i>
                  </div>
                </div>
                <div className="w-11/12">
                  <strong>Móvil:</strong>
                  <p>{eventDialog.phone}</p>
                </div>
              </>
            )}
            {eventDialog.email && (
              <>
                <div className="w-1/12">
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                    <i className="pi pi-envelope"></i>
                  </div>
                </div>
                <div className="w-11/12">
                  <strong>Correo electrónico:</strong>
                  <p className="lowercase">{eventDialog.email}</p>
                </div>
              </>
            )}
            <div className="w-1/12">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                <i className="pi pi-user"></i>
              </div>
            </div>
            <div className="w-11/12">
              <strong>Registrado para:</strong>
              <p>
                {loadingAgent ? 'Cargando...' : agentData?.firstName + ' ' + agentData?.lastName}
              </p>
            </div>
            {user?.labels[0] === 'Administrador' && (
              <>
                <div className="w-1/12">
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-gray-200">
                    <i className="pi pi-user-plus"></i>
                  </div>
                </div>
                <div className="w-11/12">
                  <strong>Asignar a colaborador:</strong>
                  <div className="flex">
                    <div className="box-border m-0 basis-[50%] grow-0 min-w-[50%]">
                      <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                        <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                          {loadingAllUsers ? (
                            <>
                              <div className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]">
                                <Loader />
                              </div>
                            </>
                          ) : (
                            <>
                              <select
                                id="agent"
                                className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                                {...register('agent', { required: true })}
                              >
                                <option value="">Seleccione</option>
                                {allUsers?.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName}
                                  </option>
                                ))}
                              </select>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-4 justify-center w-full">
                  <button className="bg-[#ef4444] font-bold h-[46px] mr-0! text-white px-4 py-2 rounded-md">
                    Cancelar evento
                  </button>
                  <button
                    disabled={!selectedAgent}
                    className="bg-[#22c55e] cursor-pointer font-bold h-[46px] mr-0! text-white px-4 py-2 rounded-md disabled:bg-transparent! disabled:cursor-not-allowed! disabled:text-[#dbe0e5]! disabled:border-[#dbe0e5]! disabled:border-[2px]!"
                    onClick={handleSubmit(handleEditEvent)}
                  >
                    Actualizar evento
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Calendar;
