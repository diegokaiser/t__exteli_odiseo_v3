'use client';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader } from '@/components/atoms';
import { Breadcrumbs, Calendar } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { useUsers } from '@/hooks/useUsers';
import Link from 'next/link';

const CalendarPage = () => {
  const { user } = useAuth();
  const { data: allUsers, isLoading: loadingAllUsers, isError: errorAllUsers } = useUsers();

  return (
    <>
      <Breadcrumbs pageTitle="Agenda" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px] mb-5">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Agenda de citas</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="p-6">
              <div
                className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
                style={{ width: 'calc(100% + 24px)' }}
              >
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
                  <div className="w-6/12">
                    <div className="flex flex-col">
                      <label
                        htmlFor="agent"
                        className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                      >
                        Seleccionar agente
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
                                defaultValue={user?.$id}
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
                <div className="box-border m-0 basis-[100%] flex justify-end grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
                  <div className="flex items-end justify-end w-6/12">
                    <Link
                      href="/calendar/add"
                      className="bg-[#22c55e] font-bold h-[46px] text-white px-4 py-2 rounded-md"
                    >
                      Agregar cita
                    </Link>
                  </div>
                </div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6">
                  {user?.$id && <Calendar userUid={user?.$id} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(CalendarPage);
