'use client';

import Link from 'next/link';
import { addLocale } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Loader } from '@/components/atoms';
import { useCalendarTodayHours, usePostCalendarEvent } from '@/hooks/useCalendar';
import { constants } from '@/lib/constants/constants';
import { CalendarEvent } from '@/types/calendar';
import { reservasDateTime } from '@/utils/reservasDateTime';
import { Timestamp } from 'firebase/firestore';

const ReservasCalendar = () => {
  const toast = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [eventEnd, setEventEnd] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const submittingRef = useRef(false);

  const postCalendarEvent = usePostCalendarEvent();

  const handleStripeCheckout = async (data: any) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      setLoading(true);

      const appointmentId = self.crypto?.randomUUID?.() || Date.now().toString();
      const [h, m] = data.hour.split(':').map(Number);
      const startDate = new Date(data.start);
      startDate.setHours(h, m, 0, 0);
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + 30);

      const { start, hour, ...rest } = data;

      const payload: CalendarEvent = {
        agent: 'np6Q466WIEW2ngYpPBbz7VxJHNY2',
        allDay: false,
        description: data.message,
        title: 'Reserva de Cita Online',
        venue: 'Puerto de Balbarán 15',

        start: Timestamp.fromDate(startDate),
        end: Timestamp.fromDate(endDate),

        status: 'pending',

        paid: false,
        stripeSessionId: appointmentId,
        ...rest,
      };

      console.log(payload);

      await postCalendarEvent.mutateAsync({
        userUid: 'np6Q466WIEW2ngYpPBbz7VxJHNY2',
        event: payload,
      });

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          serviceName: 'Reserva de cita',
          price: 50,
          customerEmail: data.email,
        }),
      });

      if (!res.ok) {
        throw new Error('No stripe response');
      }

      const result = await res.json();

      if (!result.url) {
        throw new Error('No stripe url');
      }

      localStorage.setItem('pendingReservation', JSON.stringify({ ...data, appointmentId }));

      if (window.top) {
        window.top.location.assign(result.url);
      } else {
        window.location.assign(result.url);
      }
    } catch (err: any) {
      console.error('Stripe error handleStripeCheckout', err);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al registrar la cita',
        life: 4000,
      });
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const { documentType } = constants;

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

  const onSubmit = async (data: any) => {
    if (!privacyPolicy || !termsAndConditions) {
      return;
    }

    await handleStripeCheckout(data);
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="flex justify-center">
          <div className="container flex justify-center gap-x-4">
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
              <div
                className="box-border flex flex-wrap ml-[-24px] text-[#5b6b79]"
                style={{ width: 'calc(100% + 24px)' }}
              >
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3 lg:basis-[50%] lg:min-w-[50%]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="name"
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
                          placeholder="Juan"
                          {...register('name', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3 lg:basis-[50%] lg:min-w-[50%]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastName"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Apellidos
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <InputText
                          id="lastName"
                          type="text"
                          className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                          placeholder="Pérez"
                          {...register('lastName', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3 lg:basis-[50%] lg:min-w-[50%]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Correo electrónico
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <InputText
                          id="email"
                          type="text"
                          className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                          placeholder="juan.perez@ejemplo.com"
                          {...register('email', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3 lg:basis-[50%] lg:min-w-[50%]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="phone"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Número de teléfono
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <InputText
                          id="phone"
                          type="text"
                          className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                          placeholder="+34 654321987"
                          {...register('phone', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3 lg:basis-[50%] lg:min-w-[50%]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="documentType"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Tipo de documento
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12 bg-white">
                        <select
                          id="documentType"
                          className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                          {...register('documentType', { required: true })}
                        >
                          <option value="">Seleccione</option>
                          {documentType.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3 lg:basis-[50%] lg:min-w-[50%]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="documentNumber"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Número de documento
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <InputText
                          id="documentNumber"
                          type="text"
                          className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                          placeholder="Número del documento"
                          {...register('documentNumber', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3">
                  <div className="flex flex-col">
                    <label
                      htmlFor="message"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      ¿Algo que nos ayude para nuestra reunión?
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-[102px]">
                        <InputTextarea
                          autoResize
                          id="message"
                          className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                          {...register('message', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3">
                  <div className="flex flex-col">
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0]">
                        <div className="flex flex-col gap-y-2 p-5">
                          <div className="flex items-center gap-x-2 text-sm">
                            <Checkbox
                              inputId="privacyPolicy"
                              name="privacyPolicy"
                              value={privacyPolicy}
                              onChange={() => setPrivacyPolicy(!privacyPolicy)}
                              checked={privacyPolicy}
                            />
                            <label htmlFor="privacyPolicy">
                              Acepto la{' '}
                              <Link
                                href="/politica-privacidad"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4680ff] font-normal"
                              >
                                Política de Privacidad
                              </Link>
                            </label>
                          </div>
                          <div className="flex items-center gap-x-2 text-sm">
                            <Checkbox
                              inputId="termsAndConditions"
                              name="termsAndConditions"
                              value={termsAndConditions}
                              onChange={() => setTermsAndConditions(!termsAndConditions)}
                              checked={termsAndConditions}
                            />
                            <label htmlFor="termsAndConditions">
                              Acepto los{' '}
                              <Link
                                href="/terminos-condiciones"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4680ff] font-normal"
                              >
                                Términos y Condiciones
                              </Link>
                            </label>
                          </div>
                          <div className="flex items-center gap-x-2 font-light mt-2 text-xs">
                            <i className="pi pi-info-circle"></i>
                            Al marcar estas casillas, confirma que ha leído y acepta nuestras
                            Políticas de Privacidad y Términos y Condiciones.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pt-3">
                <div className="flex flex-col">
                  {loading ? (
                    <div className="box-border inline-flex w-full relative rounded-[8px] border-[2px] border-solid border-[#bec8d0] h-[52px]">
                      <div className="border-0 box-border bg-none flex justify-center items-center m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]">
                        <Loader />
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      label="Reservar y pagar"
                      severity="success"
                      disabled={!isValid || loading || !privacyPolicy || !termsAndConditions}
                      className="disabled:bg-transparent! disabled:cursor-not-allowed! disabled:text-[#dbe0e5]! disabled:border-[#dbe0e5]! disabled:border-[2px]!"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="w-[260px]">
              <div className="p-5">
                <span className="m-0 text-xs font-semibold block uppercase">
                  Detalles de la reunión
                </span>
                <div className="flex m-0 mt-5 text-sm font-light block uppercase">
                  <div className="flex items-center w-2/12">
                    <i className="pi pi-credit-card"></i>
                  </div>
                  <div className="w-10/12">50.00 €</div>
                </div>
                <div className="flex m-0 mt-2 text-sm font-light block uppercase">
                  <div className="flex items-center w-2/12">
                    <i className="pi pi-clock"></i>
                  </div>
                  <div className="w-10/12">35 minutos</div>
                </div>
              </div>
              <hr className="border-[#dbe0e5a6]" />
              <div className="p-5">
                <span className="m-0 text-xs font-semibold block uppercase">Fecha y hora</span>
                <div className="flex m-0 mt-5 text-sm font-light block uppercase">
                  {eventDate && eventHour && eventEnd && (
                    <>
                      <div className="flex items-center w-2/12">
                        <i className="pi pi-calendar-clock"></i>
                      </div>
                      <div className="w-10/12">
                        {reservasDateTime(eventDate, eventHour, eventEnd)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ReservasCalendar;
