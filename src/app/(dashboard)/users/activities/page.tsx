'use client';

import { Breadcrumbs } from '@/components/organisms';

const UserActivities = () => {
  return (
    <>
      <Breadcrumbs pageTitle="Actividades" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]"></div>
        </div>
      </div>
    </>
  );
};

export default UserActivities;
