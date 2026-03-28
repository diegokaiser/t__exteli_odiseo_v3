import { InputText } from 'primereact/inputtext';
import { UseFormRegister } from 'react-hook-form';

import { Loader } from '@/components/atoms';
import { BillForm } from '@/types/bills';

type BillMetaSectionProps = {
  billSerial: string;
  billNumber: string;
  loadingLastBillNumber: boolean;
  register: UseFormRegister<BillForm>;
};

const BillMetaSection = ({
  billSerial,
  billNumber,
  loadingLastBillNumber,
  register,
}: BillMetaSectionProps) => {
  return (
    <>
      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
        <div className="flex flex-col">
          <label
            htmlFor="billNumber"
            className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
          >
            Número de factura
          </label>
          <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
            <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
              {loadingLastBillNumber ? (
                <div className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px]">
                  <Loader />
                </div>
              ) : (
                <InputText
                  type="text"
                  id="billNumber"
                  value={`${billSerial}-${billNumber}`}
                  readOnly
                  className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
        <div className="flex flex-col">
          <label
            htmlFor="createDate"
            className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
          >
            Fecha de creación
          </label>
          <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
            <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
              <InputText
                type="date"
                id="createDate"
                className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                {...register('createDate')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>
    </>
  );
};

export default BillMetaSection;
