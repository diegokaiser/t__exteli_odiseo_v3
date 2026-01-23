'use client';

import { Breadcrumbs } from '@/components/organisms';
import FormCalendar from '@/components/organisms/FormCalendar';
import { withAuth } from '@/hocs/withAuth';

const AddCalendar = () => {
  return (
    <>
      <Breadcrumbs labels={{ calendar: 'Calendario' }} pageTitle="Agregar cita" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border mx-auto my-0 pt-5 basis-[60%] grow-0 max-w-[60%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">
                  Agregar nueva cita
                </span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <FormCalendar />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(AddCalendar);
