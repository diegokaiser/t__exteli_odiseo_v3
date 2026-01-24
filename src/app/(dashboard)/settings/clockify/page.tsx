'use client';

import { Breadcrumbs, CardNotification, FormClockifyAlert } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';

const SettingsClockify = () => {
  return (
    <>
      <Breadcrumbs pageTitle="Alertas" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[50%] grow-0 max-w-[50%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Alertas Creadas</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <CardNotification />
          </div>
        </div>

        <div className="box-border m-0 pl-5 pt-5 basis-[50%] grow-0 max-w-[50%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Crear Alerta</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <FormClockifyAlert />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(SettingsClockify);
