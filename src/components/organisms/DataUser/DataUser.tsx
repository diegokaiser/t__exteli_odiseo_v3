'use client';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { useUser } from '@/hooks/useUsers';
import { constants } from '@/lib/constants/constants';
import { UserForm } from '@/types/users';
import { dateTimeline } from '@/utils/dateTimeline';

const { gender, userRoles, userStatus } = constants;

const DataUser = ({ userId }: { userId: string }) => {
  const { user } = useAuth();
  const isAdmin = user?.labels[0] === 'Administrador';

  const { data: userData, isLoading: loadingUserData, isError: errorUserData } = useUser(userId);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UserForm>({
    defaultValues: {},
  });

  console.log(userData);

  return (
    <form className="p-6">
      <div className="basis-[50%] min-w-[50%]">
        <div
          className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
          style={{ width: 'calc(100% + 24px)' }}
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
                    className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px] bg-transparent"
                    defaultValue={userData?.firstName}
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
                    className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px] bg-transparent"
                    defaultValue={userData?.lastName}
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
                    type="text"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    defaultValue={userData?.email}
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
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    defaultValue={userData?.phone}
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
                htmlFor="gender"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Rol
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <select
                    id="role"
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                    defaultValue={userData?.role}
                    disabled={!isAdmin}
                    {...register('role', { required: true })}
                  >
                    {userRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
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
                htmlFor="gender"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Genero
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <select
                    id="gender"
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                    defaultValue={userData?.gender}
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
                    defaultValue={userData?.status}
                    disabled={!isAdmin}
                    {...register('status', { required: true })}
                  >
                    {userStatus.map((stat) => (
                      <option key={stat} value={stat}>
                        {stat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>

          <div className="box-border m-0 basis-[100%] text-xs grow-0 min-w-[100%] pl-6 pt-6">
            Creado el: {dateTimeline(userData?.createdAt!)}
          </div>

          <div className="box-border m-0 basis-[100%] text-xs grow-0 min-w-[100%] pl-6 pt-6">
            Actualizado el: {dateTimeline(userData?.updatedAt!)}
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <Button label="Actualizar" type="submit" className="w-full" disabled={loading} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DataUser;
