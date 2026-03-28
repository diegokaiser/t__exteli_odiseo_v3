import { Button } from 'primereact/button';

import { BillIrpf, BillIva } from '@/types/bills';
import { parsePrice } from '@/utils/parsePrice';

type BillSummarySectionProps = {
  subtotal: number;
  descuentos: number;
  ivas: BillIva[];
  irpfs: BillIrpf[];
  total: number;
  rowsLength: number;
  onIncludeIVAinBASE: () => void;
};

const BillSummarySection = ({
  subtotal,
  descuentos,
  ivas,
  irpfs,
  total,
  rowsLength,
  onIncludeIVAinBASE,
}: BillSummarySectionProps) => {
  return (
    <>
      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[70%] lg:min-w-[70%]"></div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[30%] lg:min-w-[30%]">
        <div className="flex flex-col">
          <div className="bg-[#e5e7eb] rounded-[6px] px-4 py-3">
            {subtotal !== 0 && (
              <>
                <div className="flex">
                  <div className="font-bold w-6/12">Subtotal: </div>
                  <div className="text-right w-6/12">
                    <>{parsePrice(subtotal)} €</>
                  </div>
                </div>

                {ivas.map(
                  (iva, index) =>
                    iva.iva !== 0 && (
                      <div className="flex" key={index}>
                        <div className="font-bold w-6/12">IVA {iva.iva} %: </div>
                        <div className="text-right w-6/12">
                          <>{parsePrice(iva.value)} €</>
                        </div>
                      </div>
                    )
                )}

                {irpfs.map(
                  (irpf, index) =>
                    irpf.irpf !== 0 && (
                      <div className="flex" key={index}>
                        <div className="font-bold w-6/12">IRPF {irpf.irpf} %: </div>
                        <div className="text-right w-6/12">
                          <>-{parsePrice(irpf.value)} €</>
                        </div>
                      </div>
                    )
                )}
              </>
            )}

            {descuentos !== 0 && (
              <div className="flex">
                <div className="font-bold w-6/12">Descuentos: </div>
                <div className="w-6/12">
                  <>{parsePrice(descuentos)} €</>
                </div>
              </div>
            )}

            <div className="flex">
              <div className="font-bold w-6/12">Total: </div>
              <div className="text-right w-6/12">
                <>{parsePrice(total)} €</>
              </div>
            </div>
          </div>
        </div>
      </div>

      {total != 0 && rowsLength == 1 && (
        <>
          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[70%] lg:min-w-[70%]"></div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[30%] lg:min-w-[30%]">
            <Button
              type="button"
              label="Inclur IVA en el precio"
              severity="secondary"
              className="w-full"
              onClick={onIncludeIVAinBASE}
            />
          </div>
        </>
      )}
    </>
  );
};

export default BillSummarySection;
