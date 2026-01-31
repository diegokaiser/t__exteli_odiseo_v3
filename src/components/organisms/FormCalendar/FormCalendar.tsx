'use client';

import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader, LoadingScreen } from '@/components/atoms';
import { useCalendarTodayHours, usePostCalendarEvent } from '@/hooks/useCalendar';
import { useUsers } from '@/hooks/useUsers';
import { constants } from '@/lib/constants/constants';
import { CalendarEvent } from '@/types/calendar';

const FormCalendar = () => {
  const { user } = useAuth();
  const toast = useRef<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [eventEnd, setEventEnd] = useState('');

  const postCalendarEvent = usePostCalendarEvent();

  const { data: allUsers, isLoading: loadingAllUsers, isError: errorAllUsers } = useUsers();
  const { officeLocations, documentType } = constants;

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
    setValue('start', today);
  }, [setValue]);

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
    setLoading(true);
    try {
      const userUid = user?.$id;

      const date = data.start;
      const hour = data.hour;

      const [h, m] = hour!.split(':').map(Number);

      const startDate = new Date(date);
      startDate.setHours(h, m, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + 30);

      const payload: CalendarEvent = {
        agent: data.agent,
        allDay: false,
        description: data.description,
        title: data.title,
        venue: data.venue,

        start: Timestamp.fromDate(startDate),
        end: Timestamp.fromDate(endDate),

        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        message: data.description,
        status: 'confirmed',
        paid: true,
        stripeSessionId: null,
      };
      console.log(payload);
      await postCalendarEvent.mutateAsync({ userUid: userUid!, event: payload });
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cita creada correctamente',
        life: 4000,
      });
    } catch (err: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Ocurrió un error al crear la cita',
        life: 4000,
      });
    } finally {
      setLoading(false);
      router.push('/calendar');
    }
  };

  return (
    <>
      <Toast ref={toast} />
      {loading && <LoadingScreen />}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="basis-[50%] min-w-[50%]">
          <div
            className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
            style={{ width: 'calc(100% + 24px)' }}
          >
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="title"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Título
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="title"
                      type="text"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="Asesoría para arraigo familiar"
                      {...register('title', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="venue"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Lugar de la cita
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <select
                      id="venue"
                      className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      {...register('venue', { required: true })}
                    >
                      <option value="">Seleccione</option>
                      {officeLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="agent"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Agente
                </label>
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

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="start"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Fecha de la cita
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="start"
                      type="date"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      {...register('start', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
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
                          className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
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

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
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
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="Juan"
                      {...register('name', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Apellido
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="lastName"
                      type="text"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="Pérez"
                      {...register('lastName', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
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
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="juan.perez@ejemplo.com"
                      {...register('email', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
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
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="+34 654321987"
                      {...register('phone', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="documentType"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Tipo de documento
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
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
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
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
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="Número del documento"
                      {...register('documentNumber', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="description"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Observaciones
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-[102px]">
                    <InputTextarea
                      autoResize
                      id="description"
                      className="border-0! box-border bg-none h-[100px] m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      {...register('description', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
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
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <Link
                  href="/calendar"
                  className="bg-[#ef4444] border-[2px] border-[#ef4444] flex font-medium justify-center px-[20px] py-[12px] rounded-[6px] text-white"
                >
                  Cancelar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default FormCalendar;
