'use client';

import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import { useGetAllRecordsByDayWithUsers } from '@/hooks/useClockify';

const DataClockify = ({ day }: { day: string }) => {
  const toast = useRef<any>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    data: records,
    isLoading: loadingRecords,
    isError: errorRecords,
  } = useGetAllRecordsByDayWithUsers(day);

  return (
    <>
      <Toast ref={toast} />
      {loading && <LoadingScreen />}
      <div className="p-6">
        <div className="basis-[50%] min-w-[50%]">
          <div
            className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
            style={{ width: 'calc(100% + 24px)' }}
          >
            {records.length > 0 &&
              records.map((record, index) => (
                <React.Fragment key={index}>
                  <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">
                    {record.userFullName}
                  </h3>
                  <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6">
                    <div className="bg-[#f8f9fa] p-6 rounded-[12px]">
                      <div className="flex flex-col">
                        {record.records.map((record, index) => (
                          <div key={index}>
                            <div>
                              <strong>{record.name}: </strong>
                              <span>{record.registeredAtFormated}</span>
                            </div>
                            <p>{record.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DataClockify;
