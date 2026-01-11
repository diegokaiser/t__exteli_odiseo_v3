'use client';

import { withAuth } from '@/hocs/withAuth';
import { Suspense } from 'react';

import { Breadcrumbs, CompanyData, CompanyLogo } from '@/components/organisms';
import { SkeletonCompanyData, SkeletonCompanyLogo } from '@/components/skeletons/organisms';

const CompanySettings = () => {
  return (
    <>
      <Breadcrumbs pageTitle="Datos fiscales" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[40%] grow-0 max-w-[40%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Logo</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <Suspense fallback={<SkeletonCompanyLogo />}>
              <CompanyLogo />
            </Suspense>
          </div>
        </div>
        <div className="box-border m-0 pl-5 pt-5 basis-[60%] grow-0 max-w-[60%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px] mb-5">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Información</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <Suspense fallback={<SkeletonCompanyData />}>
              <CompanyData />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(CompanySettings);
