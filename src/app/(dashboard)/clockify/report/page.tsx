'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { Nullable } from 'primereact/ts-helpers';
import { useEffect, useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { Breadcrumbs } from '@/components/organisms';
import { Report } from '@/components/wrappers';
import { withAuth } from '@/hocs/withAuth';
import { useGetRecordsByPeriod } from '@/hooks/useClockify';
import { useUserName } from '@/hooks/useUsers';

const ReportPage = () => {
  const { user } = useAuth();
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
  const {
    data: records,
    isLoading: loadingRecords,
    isError: errorRecords,
  } = useGetRecordsByPeriod({
    userUid: user?.$id || '',
    startDate: dates?.[0]?.toISOString().split('T')[0] || '',
    endDate: dates?.[1]?.toISOString().split('T')[0] || '',
  });
  const { data: userName } = useUserName(user?.$id || '');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    setStartDate(dates?.[0]?.toISOString().split('T')[0] || '');
    setEndDate(dates?.[1]?.toISOString().split('T')[0] || '');
  }, [dates]);

  console.log(userName);

  return (
    <>
      <Breadcrumbs pageTitle="Generar reporte" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[40%] grow-0 max-w-[40%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px] mb-5">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Generar</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="p-6">
              <div className="mt-4 w-8/12">
                <FloatLabel>
                  <Calendar
                    inputId="period_range"
                    className="w-full"
                    value={dates}
                    onChange={(e) => setDates(e.value)}
                    selectionMode="range"
                    readOnlyInput
                    hideOnRangeSelection
                  />
                  <label htmlFor="period_range">Seleccionar rango de fechas</label>
                </FloatLabel>
              </div>
            </div>
          </div>
        </div>
        <div className="box-border m-0 pl-5 pt-5 basis-[60%] grow-0 max-w-[60%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px] mb-5">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Previsualización</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="p-6">
              {records && userName && (
                <PDFViewer style={{ width: '100%', height: '800px' }}>
                  <Report
                    records={records}
                    startDate={startDate}
                    endDate={endDate}
                    userName={userName}
                  />
                </PDFViewer>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(ReportPage);
