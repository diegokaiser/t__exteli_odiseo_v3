'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader, LoadingScreen } from '@/components/atoms';
import { useClockifyMonthSummary } from '@/hooks/useClockify';
import { useUsers } from '@/hooks/useUsers';
import { formatLongDate } from '@/utils/clockify/date';
import {
  formatMinutesToReadableHours,
  formatSignedMinutes,
  getDailyBalanceMinutes,
} from '@/utils/clockify/time';

type DataMonthClockifyProps = {
  year: string;
  month: string;
};

const DataMonthClockify = ({ year, month }: DataMonthClockifyProps) => {
  const [loading] = useState(false);
  const { user } = useAuth();

  const { data: allUsers, isLoading: loadingAllUsers, isError: errorAllUsers } = useUsers();

  const [selectedUserUid, setSelectedUserUid] = useState('');

  useEffect(() => {
    if (user?.$id && !selectedUserUid) {
      setSelectedUserUid(user.$id);
    }
  }, [user?.$id, selectedUserUid]);

  const { summary, isLoading, error } = useClockifyMonthSummary({
    userUid: selectedUserUid,
    year,
    month,
  });

  const totalBalanceMinutes =
    summary?.days.reduce((acc, day) => {
      const balanceMinutes = getDailyBalanceMinutes(day.date, day.totalMinutes);

      return acc + balanceMinutes;
    }, 0) ?? 0;

  return (
    <>
      {(loading || isLoading) && <LoadingScreen />}

      <div className="p-6">
        <div className="basis-[100%] min-w-[100%]">
          <div className="box-border flex mt-[-24px] text-[#5b6b79] w-full">
            <div className="flex flex-col gap-y-6 py-6 w-full">
              <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] lg:basis-[50%] lg:min-w-[50%]">
                <div className="w-3/12">
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

              <div className="box-border m-0 basis-[100%] flex justify-end grow-0">
                <div className="flex flex-col w-full gap-y-3">
                  {selectedUserUid === '' && <p>Selecciona un agente para ver sus registros.</p>}

                  {error && (
                    <p className="text-sm text-red-500">Error cargando registros del mes.</p>
                  )}

                  {selectedUserUid !== '' && summary && (
                    <>
                      {summary.days.map((day) => {
                        const balanceMinutes = getDailyBalanceMinutes(day.date, day.totalMinutes);

                        return (
                          <div key={day.date} className="flex gap-4 border-b border-[#dbe0e5] pb-2">
                            <div className="capitalize w-6/12">{formatLongDate(day.date)}</div>

                            <div className="w-2/12">
                              {formatMinutesToReadableHours(day.totalMinutes)}
                            </div>

                            <div
                              className={`font-bold w-2/12 ${
                                balanceMinutes >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {formatSignedMinutes(balanceMinutes)}
                            </div>

                            <div className="text-right w-2/12">
                              ({day.isComplete ? 'Completo' : 'Incompleto'})
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex gap-4 pt-4">
                        <div className="font-bold w-6/12">
                          Total mensual: {summary.totalHours} horas
                        </div>
                        <div className="flex gap-4 w-2/12"></div>
                        <div className="flex gap-4 w-4/12">
                          <div
                            className={`font-bold ${
                              totalBalanceMinutes >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            Balance mensual: {formatSignedMinutes(totalBalanceMinutes)}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataMonthClockify;
