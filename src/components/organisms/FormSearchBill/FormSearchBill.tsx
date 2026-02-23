'use client';

import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

import { LoadingScreen } from '@/components/atoms';

const FormSearchBill = () => {
  const toast = useRef<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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
            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Buscar por número</h3>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6">
              <div className="bg-[#f8f9fa] p-6 rounded-[12px]">
                <div className="flex flex-col">
                  <label
                    htmlFor="paymentMethod"
                    className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                  >
                    Número o código de factura
                  </label>
                  <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                    <div className="bg-white box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                      <input type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Buscar por cliente</h3>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6">
              <div className="bg-[#f8f9fa] p-6 rounded-[12px]">
                <div className="flex flex-col">
                  <label
                    htmlFor="paymentMethod"
                    className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                  >
                    Nombre del cliente
                  </label>
                  <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                    <div className="bg-white box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                      <input type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Buscar por fecha</h3>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6">
              <div className="bg-[#f8f9fa] p-6 rounded-[12px]">
                <div className="flex flex-col">
                  <label
                    htmlFor="paymentMethod"
                    className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                  >
                    Fecha de cración de la factura
                  </label>
                  <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                    <div className="bg-white box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                      <input type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormSearchBill;
