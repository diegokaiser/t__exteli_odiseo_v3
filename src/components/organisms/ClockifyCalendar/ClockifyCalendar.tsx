'use client';

import { useRouter } from 'next/navigation';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import { useGetRecords, usePostRecord } from '@/hooks/useClockify';
import { clockifyDaysInMonth } from '@/utils/clockifyDaysInMonth';
import { clockifyRecordDate } from '@/utils/clockifyRecordDate';

const ClockifyCalendar = () => {
  const { user } = useAuth();
  const days = clockifyDaysInMonth(new Date().getFullYear(), new Date().getMonth());
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { data: records, isLoading, isError } = useGetRecords(user?.$id || '');
  const postRecord = usePostRecord();

  const postRecordFn = async (record: any) => {
    setLoading(true);
    try {
      await postRecord.mutateAsync({
        userUid: user?.$id || '',
        record,
      });
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Registro guardado correctamente',
        life: 4000,
      });
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: `Ocurrió un error al guardar el registro ${err}`,
        detail: err.message,
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const confirmDialogStartDay = (day: any) => {
    const record = {
      name: 'Inicio del día',
      description: '',
      registeredBy: user?.$id,
      updatedBy: '',
      type: 'start',
      date: clockifyRecordDate(day.date),
    };
    confirmDialog({
      group: 'templating',
      header: 'Aviso',
      message: <div>¿Estás seguro de registrar el inicio del día?</div>,
      acceptLabel: 'Registrar',
      rejectLabel: 'Cancelar',
      accept() {
        postRecordFn(record);
      },
    });
  };

  const confirmDialogPause = (day: any) => {
    const record = {
      name: 'Pausa',
      description: '',
      registeredBy: user?.$id,
      updatedBy: '',
      type: 'pause',
      date: clockifyRecordDate(day.date),
    };
    confirmDialog({
      group: 'templating',
      header: 'Aviso',
      message: <div>¿Estás seguro de registrar una pausa?</div>,
      acceptLabel: 'Registrar',
      rejectLabel: 'Cancelar',
      accept() {
        postRecordFn(record);
      },
    });
  };

  const confirmDialogResume = (day: any) => {
    const record = {
      name: 'Regreso',
      description: '',
      registeredBy: user?.$id,
      updatedBy: '',
      type: 'resume',
      date: clockifyRecordDate(day.date),
    };
    confirmDialog({
      group: 'templating',
      header: 'Aviso',
      message: <div>¿Estás seguro de registrar un regreso de tu pausa?</div>,
      acceptLabel: 'Registrar',
      rejectLabel: 'Cancelar',
      accept() {
        postRecordFn(record);
      },
    });
  };

  const confirmDialogEndDay = (day: any) => {
    const record = {
      name: 'Cierre del día',
      description: '',
      registeredBy: user?.$id,
      updatedBy: '',
      type: 'end',
      date: clockifyRecordDate(day.date),
    };
    confirmDialog({
      group: 'templating',
      header: 'Aviso',
      message: <div>¿Estás seguro de registrar el cierre del día?</div>,
      acceptLabel: 'Registrar',
      rejectLabel: 'Cancelar',
      accept() {
        postRecordFn(record);
      },
    });
  };

  const getRecordForDate = (date: string) => {
    return records?.find((record) => record.id === date);
  };

  const hasRecordType = (record: any, type: string) => {
    return record?.records?.some((r: any) => r.type === type);
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog group="templating" />
      {loading && <LoadingScreen />}
      <div className="grid grid-cols-7 gap-x-2 gap-y-2 p-6">
        {days.map((day, index) => {
          const dateKey = clockifyRecordDate(day.date);
          const dayRecord = getRecordForDate(dateKey);
          const hasStart = hasRecordType(dayRecord, 'start');
          const hasEnd = hasRecordType(dayRecord, 'end');
          return (
            <React.Fragment key={index}>
              <div
                className={`box-border border border-solid border-[#bec8d0] min-h-[178px] rounded-[8px] ${day.isToday ? 'bg-white' : day.isEmpty ? 'bg-[#bec8d0]' : day.isWeekend ? 'bg-[#bec8d0]' : 'bg-gray-200'} p-4`}
              >
                <div className="capitalize font-bold mb-2">
                  {day.dayOfWeek} {day.dayNumber}
                </div>

                {dayRecord ? (
                  <>
                    <div className="flex flex-col gap-y-1 mb-2">
                      {dayRecord.records
                        .sort((a: any, b: any) => a.registeredAt?.seconds - b.registeredAt?.seconds)
                        .map((record: any, index: number) => (
                          <div key={index} className="text-xs w-full">
                            <span className="inline-block font-semibold w-5/12">
                              {record.type === 'start' && 'Inicio'}
                              {record.type === 'pause' && 'Pausa'}
                              {record.type === 'resume' && 'Regreso'}
                              {record.type === 'end' && 'Fin'}
                            </span>
                            {' - '}
                            {new Date(record.registeredAt.seconds * 1000).toLocaleString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        ))}
                    </div>

                    {!day.isEmpty &&
                      !day.isWeekend &&
                      day.isToday &&
                      (() => {
                        const hasStart = dayRecord.records.some((r: any) => r.type === 'start');
                        const pauseCount = dayRecord.records.filter(
                          (r: any) => r.type === 'pause'
                        ).length;
                        const resumeCount = dayRecord.records.filter(
                          (r: any) => r.type === 'resume'
                        ).length;
                        const hasPause = pauseCount > resumeCount;
                        const hasEnd = dayRecord.records.some((r: any) => r.type === 'end');

                        if (!hasEnd) {
                          return (
                            <div className="flex flex-col gap-y-2">
                              {!hasStart && (
                                <button
                                  type="button"
                                  className="bg-green-400 cursor-pointer font-semibold p-2 rounded-[4px] text-left text-xs tracking-[0.5px] uppercase w-full"
                                  onClick={() => confirmDialogStartDay(day)}
                                >
                                  Iniciar
                                </button>
                              )}
                              {hasPause ? (
                                <button
                                  type="button"
                                  className="bg-orange-400 cursor-pointer font-semibold p-2 rounded-[4px] text-left text-white text-xs tracking-[0.5px] uppercase w-full"
                                  onClick={() => confirmDialogResume(day)}
                                >
                                  Regreso
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="bg-sky-400 cursor-pointer font-semibold p-2 rounded-[4px] text-left text-xs tracking-[0.5px] uppercase w-full"
                                  onClick={() => confirmDialogPause(day)}
                                >
                                  Registrar pausa
                                </button>
                              )}
                              <button
                                type="button"
                                className="bg-red-400 cursor-pointer font-semibold p-2 rounded-[4px] text-left text-white tracking-[0.5px] text-xs uppercase w-full"
                                onClick={() => confirmDialogEndDay(day)}
                              >
                                Cierre
                              </button>
                            </div>
                          );
                        }

                        return null;
                      })()}
                  </>
                ) : (
                  !day.isEmpty &&
                  !day.isWeekend &&
                  day.isToday && (
                    <div className="flex flex-col gap-y-2">
                      <button
                        type="button"
                        className="bg-green-400 cursor-pointer font-semibold p-2 rounded-[4px] text-left text-xs tracking-[0.5px] uppercase w-full"
                        onClick={() => confirmDialogStartDay(day)}
                      >
                        Iniciar
                      </button>
                      <button
                        type="button"
                        className="bg-sky-400 cursor-pointer font-semibold p-2 rounded-[4px] text-left text-xs tracking-[0.5px] uppercase w-full"
                        onClick={() => confirmDialogPause(day)}
                      >
                        Registrar pausa
                      </button>
                      <button
                        type="button"
                        className="bg-red-400 cursor-pointer font-semibold p-2 rounded-[4px] text-left text-white tracking-[0.5px] text-xs uppercase w-full"
                        onClick={() => confirmDialogEndDay(day)}
                      >
                        Cierre
                      </button>
                    </div>
                  )
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default ClockifyCalendar;
