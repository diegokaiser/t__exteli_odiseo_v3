'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import { Breadcrumbs, DataMonthClockify } from '@/components/organisms';

const HoursPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  return (
    <>
      {user?.labels[0] === 'Administrador' ? (
        <>
          <Breadcrumbs pageTitle="Registro de fichaje por mes" />
          <div
            className="box-border flex flex-wrap justify-center"
            style={{ width: 'calc(100% + 28px)' }}
          >
            <div className="flex justify-between w-full">
              <button
                className="bg-[#06b6d4] border border-[#06b6d4] rounded-[6px] cursor-pointer flex items-center gap-x-3 px-[12px] py-[4px] text-white hover:bg-[white] hover:text-[#06b6d4]"
                type="button"
              >
                <i className="pi pi-arrow-left"></i>
                <span>Día Anterior</span>
              </button>
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
                <DataMonthClockify />
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
