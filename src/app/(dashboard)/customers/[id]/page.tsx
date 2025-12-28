'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

import { LoadingScreen } from '@/components/atoms';
import { Breadcrumbs, CardCustomer, DataCustomer, TimelineCustomer } from '@/components/organisms';
import {
  SkeletonCardCustomer,
  SkeletonDataCustomer,
  SkeletonTimeline,
} from '@/components/skeletons/organisms';
import { useCustomerName } from '@/hooks/useCustomer';

const CustomerPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const customerId = typeof id === 'string' ? id : '';

  const {
    data: customerName,
    isLoading: loadingCustomerName,
    isError: errorCustomerName,
  } = useCustomerName(customerId);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      {loading && <LoadingScreen />}
      <Breadcrumbs pageTitle={customerName} />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[35%] grow-0 max-w-[35%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-start justify-center p-6">
              <div className="w-7/12">
                <Suspense fallback={<SkeletonCardCustomer />}>
                  <CardCustomer customerId={customerId} />
                </Suspense>
              </div>
            </div>
          </div>
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] mt-[20px] rounded-[12px]">
            <div className="flex items-start justify-center p-6">
              <div className="w-full">
                <Suspense fallback={<SkeletonTimeline />}>
                  <TimelineCustomer customerId={customerId} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        <div className="box-border m-0 pl-5 pt-5 basis-[65%] grow-0 max-w-[65%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px] mb-5">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Información</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <Suspense fallback={<SkeletonDataCustomer />}>
              <DataCustomer customerId={customerId} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerPage;
