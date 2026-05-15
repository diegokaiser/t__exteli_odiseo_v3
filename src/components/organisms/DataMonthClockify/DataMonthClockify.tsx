'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader, LoadingScreen } from '@/components/atoms';
import { useClockifyMonthSummary } from '@/hooks/useClockify';
import { useUsers } from '@/hooks/useUsers';
import { formatLongDate } from '@/utils/clockify/date';
import { formatMinutesToReadableHours } from '@/utils/clockify/time';

const DataMonthClockify = () => {
  const [loading] = useState(false);
  const { user } = useAuth();

  const { data: allUsers, isLoading: loadingAllUsers, isError: errorAllUsers } = useUsers();

  const [selectedUserUid, setSelectedUserUid] = useState('');

  useEffect(() => {
    if (user?.$id && !selectedUserUid) {
      setSelectedUserUid(user.$id);
    }
  }, [user?.$id, selectedUserUid]);

  const currentDate = new Date();

  const year = String(currentDate.getFullYear());
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');

  const { summary, isLoading, error } = useClockifyMonthSummary({
    userUid: selectedUserUid,
    year,
    month,
  });
  console.log(selectedUserUid);

  return (
    <>
      {(loading || isLoading) && <LoadingScreen />}

      <div className="p-6">
        <div className="basis-[50%] min-w-[50%]">
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
                        <div className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px]">
                          <Loader />
                        </div>
                      ) : (
                        <select
                          id="agent"
                          className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                          value={selectedUserUid}
                          onChange={(event) => {
                            setSelectedUserUid(event.target.value);
                          }}
                        >
                          <option value="">Seleccione</option>

                          {allUsers?.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.firstName} {user.lastName}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {errorAllUsers && (
                    <p className="text-sm text-red-500">Error cargando usuarios.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] flex justify-end grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
              <div className="flex flex-col w-full gap-2">
                {selectedUserUid === '' && <p>Selecciona un agente para ver sus registros.</p>}

                {error && <p className="text-sm text-red-500">Error cargando registros del mes.</p>}

                {selectedUserUid !== '' && summary && (
                  <>
                    {summary.days.map((day) => (
                      <div key={day.date} className="flex gap-4">
                        <span>{formatLongDate(day.date)}</span>
                        <span>{formatMinutesToReadableHours(day.totalMinutes)}</span>
                        <span>{day.isComplete ? 'Completo' : 'Incompleto'}</span>
                      </div>
                    ))}
                    <p>Total mensual: {summary.totalHours} horas</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataMonthClockify;
