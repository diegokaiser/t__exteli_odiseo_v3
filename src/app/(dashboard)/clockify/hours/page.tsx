'use client';

import { useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import { Breadcrumbs, DataMonthClockify } from '@/components/organisms';

const getMonthState = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
});

const HoursPage = () => {
  const { user } = useAuth();

  const currentDate = new Date();
  const currentMonthState = getMonthState(currentDate);

  const [selectedDate, setSelectedDate] = useState(currentDate);

  const selectedMonthState = getMonthState(selectedDate);

  const isCurrentMonth =
    selectedMonthState.year === currentMonthState.year &&
    selectedMonthState.month === currentMonthState.month;

  const handlePreviousMonth = () => {
    setSelectedDate((prevDate) => {
      return new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => {
      return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
    });
  };

  const selectedMonthLabel = new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(selectedDate);

  return (
    <>
      {user?.labels[0] === 'Administrador' ? (
        <>
          <Breadcrumbs pageTitle="Registro de fichaje por mes" />
          <div
            className="box-border flex flex-wrap justify-center"
            style={{ width: 'calc(100% + 28px)' }}
          >
            <div className="flex justify-between items-center w-full">
              <button
                className="bg-[#06b6d4] border border-[#06b6d4] rounded-[6px] cursor-pointer flex items-center gap-x-3 px-[12px] py-[4px] text-white hover:bg-[white] hover:text-[#06b6d4]"
                type="button"
                onClick={handlePreviousMonth}
              >
                <i className="pi pi-arrow-left"></i>
                <span>Mes anterior</span>
              </button>

              <p className="font-semibold capitalize">{selectedMonthLabel}</p>

              {!isCurrentMonth && (
                <button
                  className="bg-[#06b6d4] border border-[#06b6d4] rounded-[6px] cursor-pointer flex items-center gap-x-3 px-[12px] py-[4px] text-white hover:bg-[white] hover:text-[#06b6d4]"
                  type="button"
                  onClick={handleNextMonth}
                >
                  <span>Mes siguiente</span>
                  <i className="pi pi-arrow-right"></i>
                </button>
              )}
              {isCurrentMonth && <div></div>}
            </div>

            <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
              <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
                <div className="flex items-center p-5">
                  <div className="" style={{ flex: '1 1 auto' }}>
                    <span className="m-0 text-xs font-semibold block uppercase">
                      Registros del mes
                    </span>
                  </div>
                </div>
                <hr className="border-[#dbe0e5a6]" />
                <DataMonthClockify
                  year={String(selectedMonthState.year)}
                  month={String(selectedMonthState.month).padStart(2, '0')}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default HoursPage;
