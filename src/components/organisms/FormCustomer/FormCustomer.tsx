'use client';

import { Timestamp } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Loader } from '@/components/atoms';
import { useNationalities } from '@/hooks/useNationality';
import { usePacks } from '@/hooks/usePack';
import { useProcedures } from '@/hooks/useProcedure';
import { useUsers } from '@/hooks/useUsers';
import { constants } from '@/lib/constants/constants';
import { CustomerForm } from '@/types/customers';
import { daysSince, format90DaysStatus } from '@/utils/dateThreeMonths';

const FormCustomer = () => {
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

  const [checked, setChecked] = useState(false);

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
      createdAt: Timestamp.fromDate(new Date()),
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
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className="basis-[50%] min-w-[50%]">
        <div
          className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
          style={{ width: 'calc(100% + 24px' }}
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                    {...register('createdAt', { required: true })}
                    disabled={checked}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] flex items-center grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex items-center gap-x-2 mt-3">
              <Checkbox
                inputId="actualDate"
                checked={checked}
                onChange={(e) => setChecked(!checked)}
              />
              <label
                htmlFor="actualDate"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                ¿Registrar con la fecha actual?
              </label>
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
                    className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px]"
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
                    className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px]"
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
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
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                        className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                        className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                        {...register('procedure')}
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
                        className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                        {...register('servicePack')}
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
                        className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
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
              <Button type="submit" label="Guardar" severity="success" disabled={!isValid} />
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <Button label="Cancelar" severity="danger" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormCustomer;
