'use client';

import { Breadcrumbs } from '@/components/organisms';
import FormSearchBill from '@/components/organisms/FormSearchBill/FormSearchBill';
import { withAuth } from '@/hocs/withAuth';

const SearchPage = () => {
  return (
    <>
      <Breadcrumbs labels={{ customers: 'Facturación' }} pageTitle="Buscar factura" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border mx-auto my-0 pt-5 basis-[90%] grow-0 max-w-[90%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Buscar factura</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <FormSearchBill />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(SearchPage);
