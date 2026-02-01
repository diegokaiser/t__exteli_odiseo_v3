'use client';

import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import { usePostProcedure } from '@/hooks/useProcedure';
import { Procedure } from '@/types/procedures';

const FormProcedure = () => {
  const { user } = useAuth();
  const toast = useRef<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const postProcedure = usePostProcedure();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<Procedure>({
    mode: 'onChange',
  });

  const onSubmit = async (data: Procedure) => {
    setLoading(true);
    const payload = {
      ...data,
      registerBy: user?.$id,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };
    try {
      await postProcedure.mutateAsync(payload);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Trámite creado correctamente',
        life: 4000,
      });
    } catch (err: any) {
      console.error(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al crear el trámite',
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
      <form autoComplete="off" className="p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="basis-[50%] min-w-[50%]">
          <div
            className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
            style={{ width: 'calc(100% + 24px)' }}
          >
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
                      placeholder="Regularización migratoria"
                      {...register('name', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="price"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Precio
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="price"
                      type="number"
                      className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="200"
                      {...register('price', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="status"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Estado
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <select
                      id="status"
                      className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      {...register('status', { required: true })}
                    >
                      <option value="">Seleccione</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
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
                  Descripción
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="description"
                      type="text"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="Trámite de regularización migratoria 2026"
                      {...register('description', { required: true })}
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
          </div>
        </div>
      </form>
    </>
  );
};

export default FormProcedure;
