'use client';

import { Breadcrumbs, ClockifyCalendar } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';

const ClockifyPage = () => {
  return (
    <>
      <Breadcrumbs pageTitle="Historial de tiempo" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <ClockifyCalendar />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(ClockifyPage);
