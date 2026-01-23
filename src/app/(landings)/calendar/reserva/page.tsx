'use client';

import { Timestamp } from 'firebase/firestore';
import { addLocale } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Loader } from '@/components/atoms';
import { useCalendarTodayHours, usePostCalendarEvent } from '@/hooks/useCalendar';
import { CalendarEvent } from '@/types/calendar';

const ReservasCalendar = () => {
  const [loading, setLoading] = useState(false);
  const [eventEnd, setEventEnd] = useState('');
  const [mischiefManaged, setMischiefManaged] = useState(false);
  const [reservedDate, setReservedDate] = useState<string | null>(null);

  const postCalendarEvent = usePostCalendarEvent();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });

  const eventDate = watch('start');
  const eventHour = watch('hour');

  const { data: todayHoursRaw = [], isLoading: loadingTodayHours } =
    useCalendarTodayHours(eventDate);

  const [availableHours, setAvailableHours] = useState<string[]>([]);

  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
    monthNamesShort: [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ],
    today: 'Hoy',
  });

  useEffect(() => {
    if (!eventDate) return;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    const filteredHours =
      eventDate === today
        ? todayHoursRaw.filter((hour: string) => hour > currentTime)
        : todayHoursRaw;

    setAvailableHours(filteredHours);
  }, [eventDate, todayHoursRaw]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!eventDate) {
      setValue('start', today);
    }
  }, [eventDate, setValue]);

  useEffect(() => {
    if (eventHour) {
      const [startHour, startMinute] = eventHour.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(startHour, startMinute + 30);
      const formattedEnd = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      setEventEnd(formattedEnd);
    }
  }, [eventHour]);

  useEffect(() => {
    const stored = localStorage.getItem('lastReservation');
    if (stored) {
      const { timestamp } = JSON.parse(stored);
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      if (now - timestamp < oneWeek) {
        setMischiefManaged(true);
      }
    }
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const userUid = 'np6Q466WIEW2ngYpPBbz7VxJHNY2';

    const date = data.start;
    const hour = data.hour;

    const [h, m] = hour!.split(':').map(Number);

    const startDate = new Date(date);
    startDate.setHours(h, m, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);
    try {
      const payload: CalendarEvent = {
        agent: userUid,
        allDay: false,
        description: `Cita registrada por la web para: ${data.name}`,
        title: `Cita: ${data.name}`,
        venue: 'Puerto de Balbarán 15',

        start: Timestamp.fromDate(startDate),
        end: Timestamp.fromDate(endDate),
      };
      console.log(payload);
      await postCalendarEvent.mutateAsync({ userUid: userUid!, event: payload });
      localStorage.setItem(
        'lastReservation',
        JSON.stringify({
          timestamp: Date.now(),
          date: startDate.toISOString(),
        })
      );
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
      setMischiefManaged(true);
      setReservedDate(
        startDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    }
  };

  return (
    <>
      {mischiefManaged ? (
        <div className="p-6">
          <div className="flex justify-center">
            <div className="container flex justify-center">
              <div className="w-[410px]">
                <div className="flex flex-col items-center">
                  <i className="pi pi-check-circle text-[60px]! text-green-500 mb-4"></i>
                  <h2 className="text-2xl font-bold mb-4">¡Reserva exitosa!</h2>
                  <p className="mb-4">Tu reserva ha sido registrada exitosamente.</p>
                  {reservedDate && (
                    <p className="mb-4">Recuerda que tu cita es el día: {reservedDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="flex justify-center">
            <div className="container flex justify-center">
              <div className="w-[410px]">
                <div className="flex justify-center w-full">
                  <Calendar
                    inline
                    disabledDays={[0, 6]}
                    locale="es"
                    onChange={(e) => {
                      if (!e.value) return;
                      const date = e.value.toISOString().split('T')[0];
                      setValue('start', date);
                    }}
                  />
                </div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pt-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="start"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Nombre
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <InputText
                          id="name"
                          type="text"
                          className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                          {...register('name', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pt-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="start"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Inicio del evento/Cita
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        {loadingTodayHours ? (
                          <>
                            <div className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]">
                              <Loader />
                            </div>
                          </>
                        ) : (
                          <>
                            <select
                              id="hour"
                              className="bg-white border-0! box-border bg-none m-0 block min-w-0 rounded-[8px] w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                              {...register('hour', { required: true })}
                            >
                              <option value="">Seleccione</option>
                              {availableHours?.map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pt-6">
                  <div className="flex flex-col">
                    <Button
                      type="submit"
                      label="Guardar"
                      severity="success"
                      disabled={!isValid || loading}
                      className="disabled:bg-transparent! disabled:cursor-not-allowed! disabled:text-[#dbe0e5]! disabled:border-[#dbe0e5]! disabled:border-[2px]!"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default ReservasCalendar;
