'use client';

import { Breadcrumbs } from '@/components/organisms';
import DataHours from '@/components/organisms/DataHours/DataHours';
import { withAuth } from '@/hocs/withAuth';

const HoursPage = () => {
  return (
    <>
      <Breadcrumbs pageTitle="Horas por mes" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">
                  Total de horas por mes
                </span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <DataHours />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(HoursPage);
