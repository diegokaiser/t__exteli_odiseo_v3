'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import { usePostNotification } from '@/hooks/useNotification';
import { NotificationDB, NotificationForm } from '@/types/notification';
import { Timestamp } from 'firebase/firestore';

const FormClockifyAlert = () => {
  const { user } = useAuth();
  const toast = useRef<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const postNotification = usePostNotification();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<NotificationForm>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      hour: undefined,
    },
  });

  const onSubmit = async (data: NotificationForm) => {
    setLoading(true);
    try {
      const payload: NotificationDB = {
        title: data.title,
        hour: Timestamp.fromDate(data.hour),
        enabled: true,
        days: [1, 2, 3, 4, 5],
      };
      await postNotification.mutateAsync({
        uid: crypto.randomUUID(),
        data: payload,
      });
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Notificación creada correctamente',
        life: 4000,
      });
    } catch (err: any) {
      console.log(err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al crear la notificacion',
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Toast ref={toast} />
      {loading && <LoadingScreen />}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="basis-[50%] min-w-[50%]">
          <div
            className="box-border flex flex-wrap mt-[-24px] ml-[-24px] text-[#5b6b79]"
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
                      placeholder="Hora de entrada"
                      {...register('title', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="title"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Hora
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <Calendar
                      id="hour"
                      value={watch('hour')}
                      timeOnly
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full bg-transparent"
                      onChange={(e) =>
                        setValue('hour', e.value as Date, {
                          shouldValidate: true,
                        })
                      }
                      showIcon
                    />
                  </div>
                </div>
              </div>
            </div>

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

export default FormClockifyAlert;
