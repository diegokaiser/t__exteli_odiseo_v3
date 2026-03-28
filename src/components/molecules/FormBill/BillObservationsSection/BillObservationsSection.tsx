import { InputTextarea } from 'primereact/inputtextarea';
import { UseFormRegister } from 'react-hook-form';

import { BillForm } from '@/types/bills';

type BillObservationsSectionProps = {
  register: UseFormRegister<BillForm>;
  paymentMethods: readonly string[];
};

const BillObservationsSection = ({ register, paymentMethods }: BillObservationsSectionProps) => {
  return (
    <>
      <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Observaciones</h3>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
        <div className="flex flex-col">
          <label
            htmlFor="paymentMethod"
            className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
          >
            Medio de pago
          </label>
          <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
            <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
              <select
                id="paymentMethod"
                className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                {...register('paymentMethod', { required: true })}
              >
                <option value="">Seleccione</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[75%] lg:min-w-[75%]"></div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
        <div className="flex flex-col">
          <label
            htmlFor="notes"
            className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
          >
            Notas para el receptor
          </label>
          <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
            <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-[102px]">
              <InputTextarea
                autoResize
                id="notes"
                className="border-0! box-border bg-none h-[100px] m-0 block min-w-0 w-full p-[14px] bg-transparent"
                {...register('notes')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>
    </>
  );
};

export default BillObservationsSection;
