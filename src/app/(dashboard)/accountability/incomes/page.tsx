'use client';

import { withAuth } from '@/hocs/withAuth';

const IncomesPage = () => {
  return (
    <>
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[33%] md:max-w-[33%] xl:basis-[33%] xl:max-w-[33%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas Pagadas del mes
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="py-2"></div>
          </div>
        </div>
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[33%] md:max-w-[33%] xl:basis-[33%] xl:max-w-[33%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas Pagadas del mes
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="py-2"></div>
          </div>
        </div>
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[33%] md:max-w-[33%] xl:basis-[33%] xl:max-w-[33%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas Pagadas del mes
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="py-2"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(IncomesPage);
