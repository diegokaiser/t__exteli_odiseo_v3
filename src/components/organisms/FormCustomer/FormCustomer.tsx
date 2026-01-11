'use client';

import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader, LoadingScreen } from '@/components/atoms';
import { usePostAccounting } from '@/hooks/useAccounting';
import { usePostCustomer } from '@/hooks/useCustomer';
import { useNationalities } from '@/hooks/useNationality';
import { usePacks } from '@/hooks/usePack';
import { useProcedures } from '@/hooks/useProcedure';
import { usePostTimeline } from '@/hooks/useTimeline';
import { useUsers } from '@/hooks/useUsers';
import { constants } from '@/lib/constants/constants';
import { CustomerForm } from '@/types/customers';
import { daysSince, format90DaysStatus } from '@/utils/dateThreeMonths';

const FormCustomer = () => {
  const { user } = useAuth();
  const toast = useRef<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const postAccounting = usePostAccounting();
  const postTimeline = usePostTimeline();
  const postCustomer = usePostCustomer();

  const {
    data: allNationalities,
    isLoading: loadingAllNationalities,
    isError: errorAllNationalities,
  } = useNationalities();
  const {
    data: allProcedures,
    isLoading: loadingAllProcedures,
    isError: errorAllProcedures,
  } = useProcedures();
  const { data: allPacks, isLoading: loadingAllPacks, isError: errorAllPacks } = usePacks();
  const { data: allUsers, isLoading: loadingAllUsers, isError: errorAllUsers } = useUsers();

  const { gender, documentType, messenger, status } = constants;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<CustomerForm>({
    mode: 'onChange',
    defaultValues: {
      createdAt: '',
      updatedAt: '',
      firstName: '',
      lastName: '',
      email: '',
      gender: undefined,
      birthday: '',
      nationality: '',
      phone: '',
      phoneSecondary: '',
      messenger: undefined,
      documentType: undefined,
      documentNumber: '',
      enterDate: '',
      procedure: '',
      servicePack: '',
      totalPrice: '',
      paid: '',
      status: undefined,
      agent: '',
      timeline: '',
    },
  });

  const selectedProcedure = watch('procedure');
  const selectedPack = watch('servicePack');

  const onSubmit = async (data: CustomerForm) => {
    setLoading(true);
    const timeline = {
      registerdBy: user?.$id,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };
    const accounting = {
      type: 'ingreso',
      amount: data.paid,
      description: `${data.firstName} ${data.lastName}`,
      reference: data.procedure ? data.procedure : data.servicePack,
      registerdBy: user?.$id,
      createdAt: Timestamp.fromDate(new Date()),
    };
    try {
      const timelineRef = await postTimeline.mutateAsync(timeline);
      const timelineId = timelineRef?.id;
      if (data.paid !== '') {
        await postAccounting.mutateAsync(accounting);
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se registro el pago correctamente',
          life: 4000,
        });
      }
      const payload = {
        ...data,
        timeline: timelineId,
        createdAt: Timestamp.fromDate(new Date(data.createdAt)),
        updatedAt: Timestamp.fromDate(new Date()),
      };
      await postCustomer.mutateAsync(payload);

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cliente creado correctamente',
        life: 4000,
      });
    } catch (err: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Ocurrió un error al crear el cliente',
        life: 4000,
      });
    } finally {
      setLoading(false);
      router.push('/dashboard/customers');
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
            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Datos de creación</h3>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="createdAt"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Fecha de creación
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="createdAt"
                      type="date"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      {...register('createdAt', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Datos personales</h3>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Nombre
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="firstName"
                      type="text"
                      className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="John"
                      {...register('firstName', { required: true })}
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
                  Apellidos
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="lastName"
                      type="text"
                      className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="Doe"
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
                      type="email"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      placeholder="john.doe@example.com"
                      {...register('email', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="gender"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Género
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <select
                      id="gender"
                      className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      {...register('gender', { required: true })}
                    >
                      <option value="">Seleccione</option>
                      {gender.map((item) => (
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
                  htmlFor="birthday"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Fecha de nacimiento
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="birthday"
                      type="date"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      {...register('birthday', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="nationality"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Nacionalidad
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    {loadingAllNationalities ? (
                      <>
                        <div className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]">
                          <Loader />
                        </div>
                      </>
                    ) : (
                      <>
                        <select
                          id="nationality"
                          className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                          {...register('nationality', { required: true })}
                        >
                          <option value="">Seleccione</option>
                          {allNationalities?.map((nationality) => (
                            <option key={nationality.country} value={nationality.country}>
                              {nationality.country}
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
                  htmlFor="phone"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Móvil principal
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="phone"
                      type="text"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      placeholder="654 32 19 87"
                      {...register('phone', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="messenger"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  ¿Whatsapp?
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <select
                      id="messenger"
                      className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      {...register('messenger', { required: true })}
                    >
                      <option value="">Seleccione</option>
                      {messenger.map((item) => (
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
                  htmlFor="phoneSecondary"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Móvil secundario
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="phoneSecondary"
                      type="text"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      placeholder="654 32 19 88"
                      {...register('phoneSecondary', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Datos migratorios</h3>
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
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      placeholder="1234567890"
                      {...register('documentNumber', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="enterDate"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Fecha de ingreso a España
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="enterDate"
                      type="date"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      placeholder="dd/mm/yyyy"
                      {...register('enterDate', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="threeMonths"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  ¿Cumple 90 días en España?
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <div className="p-[12px]">
                      <span className="text-[14px]">
                        {format90DaysStatus(watch('enterDate'))}, días transcurridos:{' '}
                        {daysSince(watch('enterDate'))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Datos del servicio</h3>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="procedure"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Trámite o servicio
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    {loadingAllProcedures ? (
                      <>
                        <div className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]">
                          <Loader />
                        </div>
                      </>
                    ) : (
                      <>
                        <select
                          id="procedure"
                          className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                          {...register('procedure')}
                          disabled={!!selectedPack}
                        >
                          <option value="">Seleccione</option>
                          {allProcedures?.map((procedure) => (
                            <option key={procedure.id} value={procedure.name}>
                              {procedure.name}
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
                  htmlFor="servicePack"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Pack
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    {loadingAllPacks ? (
                      <>
                        <div className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]">
                          <Loader />
                        </div>
                      </>
                    ) : (
                      <>
                        <select
                          id="servicePack"
                          className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                          {...register('servicePack')}
                          disabled={!!selectedProcedure}
                        >
                          <option value="">Seleccione</option>
                          {allPacks?.map((pack) => (
                            <option key={pack.id} value={pack.name}>
                              {pack.name}
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
                  htmlFor="totalPrice"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Valor total
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="totalPrice"
                      type="text"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      placeholder="300.00"
                      {...register('totalPrice', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <label
                  htmlFor="paid"
                  className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                >
                  Pago inicial
                </label>
                <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                  <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                    <InputText
                      id="paid"
                      type="text"
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                      placeholder="100.00"
                      {...register('paid', { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Datos del sistema</h3>
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
                      {status.map((item) => (
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
                <Button label="Cancelar" severity="danger" disabled={loading} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default FormCustomer;
