'use client';

import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader } from '@/components/atoms';
import { useCustomer } from '@/hooks/useCustomer';
import { useNationalities } from '@/hooks/useNationality';
import { constants } from '@/lib/constants/constants';
import { CustomerForm } from '@/types/customers';
import { Button } from 'primereact/button';

const { gender, documentType, messenger, status } = constants;

const DataCustomer = ({ customerId }: { customerId: string }) => {
  const { user } = useAuth();
  const isAdmin = user?.labels[0] === 'Administrador';

  const {
    data: customer,
    isLoading: loadingCustomer,
    isError: errorCustomer,
  } = useCustomer(customerId);
  const {
    data: allNationalities,
    isLoading: loadingAllNationalities,
    isError: errorAllNationalities,
  } = useNationalities();

  const [loading, setLoading] = useState(false);
  const [customerMessenger, setCustomerMessenger] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CustomerForm>({
    defaultValues: {},
  });

  useEffect(() => {
    setCustomerMessenger(customer?.messenger == 'Sí');
  }, [customer]);

  return (
    <form className="p-6">
      <div className="basis-[50%] min-w-[50%]">
        <div
          className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
          style={{ width: 'calc(100% + 24px' }}
        >
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
                    defaultValue={customer?.firstName}
                    disabled={!isAdmin}
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
                    defaultValue={customer?.lastName}
                    disabled={!isAdmin}
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
                    defaultValue={customer?.email}
                    disabled={!isAdmin}
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
                Genero
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <select
                    id="gender"
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                    defaultValue={customer?.gender}
                    disabled={!isAdmin}
                    {...register('gender', { required: true })}
                  >
                    {gender.map((gen) => (
                      <option key={gen} value={gen}>
                        {gen}
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                    defaultValue={customer?.birthday}
                    disabled={!isAdmin}
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
                        defaultValue={customer?.nationality}
                        disabled={!isAdmin}
                        {...register('nationality', { required: true })}
                      >
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
                Móvil
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="phone"
                    type="text"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                    defaultValue={customer?.phone}
                    disabled={!isAdmin}
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
                ¿Está habilitado para whatsapp?
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <select
                    id="messenger"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                    defaultValue={customer?.messenger}
                    disabled={!isAdmin}
                    {...register('messenger', { required: true })}
                  >
                    {messenger.map((value) => (
                      <option key={value} value={value}>
                        {value}
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
                htmlFor="documentType"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Tipo de documento
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <select
                    id="documentType"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                    defaultValue={customer?.documentType}
                    disabled={!isAdmin}
                    {...register('documentType', { required: true })}
                  >
                    {documentType.map((type) => (
                      <option key={type} value={type}>
                        {type}
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
                    defaultValue={customer?.documentNumber}
                    disabled={!isAdmin}
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
                Fecha de entrada a España
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="enterDate"
                    type="date"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                    defaultValue={customer?.enterDate}
                    disabled={!isAdmin}
                    {...register('enterDate', { required: true })}
                  />
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
                  <InputText
                    id="agent"
                    type="text"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                    defaultValue={customer?.agent}
                    disabled={!isAdmin}
                    {...register('agent', { required: true })}
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
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                    defaultValue={customer?.status}
                    disabled={!isAdmin}
                    {...register('status', { required: true })}
                  >
                    {status.map((stat) => (
                      <option key={stat} value={stat}>
                        {stat}
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
                htmlFor="registerdBy"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Registrado por
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="registerdBy"
                    type="text"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]"
                    defaultValue={customer?.registerdBy}
                    disabled={!isAdmin}
                    {...register('registerdBy', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col">
                <Button label="Actualizar" type="submit" className="w-full" disabled={!isAdmin} />
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default DataCustomer;
