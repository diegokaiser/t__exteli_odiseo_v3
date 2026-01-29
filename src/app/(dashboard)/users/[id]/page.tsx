'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { LoadingScreen } from '@/components/atoms';
import { Breadcrumbs, CardUser, DataUser } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { useUserName } from '@/hooks/useUsers';

const UserPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const userId = typeof id === 'string' ? id : '';

  const {
    data: userName,
    isLoading: loadingUserName,
    isError: errorUserName,
  } = useUserName(userId);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      {loading && <LoadingScreen />}
      <Breadcrumbs pageTitle={userName} />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[40%] grow-0 max-w-[40%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-start justify-center p-6">
              <div className="w-7/12">
                <CardUser userUid={userId} />
              </div>
            </div>
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
            <DataUser userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(UserPage);
