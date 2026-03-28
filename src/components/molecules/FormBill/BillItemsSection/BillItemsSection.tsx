import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import { BillDescriptionItem, BillForm } from '@/types/bills';

type BillItemsSectionProps = {
  rows: BillDescriptionItem[];
  register: UseFormRegister<BillForm>;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
  onConceptChange: (index: number, value: string) => void;
  onBaseChange: (index: number, value: string | number) => void;
  onCantidadChange: (index: number, value: string | number) => void;
  onDtoChange: (index: number, value: string | number) => void;
  onIvaChange: (index: number, value: string | number) => void;
  onIrpfChange: (index: number, value: string | number) => void;
};

const BillItemsSection = ({
  rows,
  register,
  onAddRow,
  onDeleteRow,
  onConceptChange,
  onBaseChange,
  onCantidadChange,
  onDtoChange,
  onIvaChange,
  onIrpfChange,
}: BillItemsSectionProps) => {
  return (
    <>
      <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Items</h3>

      {rows.map((row, index) => (
        <React.Fragment key={row.id}>
          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[40%] lg:min-w-[40%]">
            <div className="flex flex-col">
              <label
                htmlFor={`concept-${index}`}
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Concepto
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    type="text"
                    id={`concept-${index}`}
                    defaultValue={row.concept}
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register(`description.${index}.concept` as const)}
                    onChange={(e) => onConceptChange(index, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[10%] lg:min-w-[10%]">
            <div className="flex flex-col">
              <label
                htmlFor={`base-${index}`}
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                BASE
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    type="number"
                    step="0.01"
                    id={`base-${index}`}
                    defaultValue={row.base}
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register(`description.${index}.base` as const, {
                      required: true,
                      valueAsNumber: true,
                    })}
                    onChange={(e) => onBaseChange(index, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[10%] lg:min-w-[10%]">
            <div className="flex flex-col">
              <label
                htmlFor={`cant-${index}`}
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                CANT
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    type="text"
                    id={`cant-${index}`}
                    defaultValue={row.cantidad}
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register(`description.${index}.cantidad` as const, {
                      required: true,
                      valueAsNumber: true,
                    })}
                    onChange={(e) => onCantidadChange(index, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[10%] lg:min-w-[10%]">
            <div className="flex flex-col">
              <label
                htmlFor={`dto-${index}`}
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                DTO
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    type="number"
                    step="0.01"
                    id={`dto-${index}`}
                    defaultValue={row.dto}
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register(`description.${index}.dto` as const, {
                      valueAsNumber: true,
                    })}
                    onChange={(e) => onDtoChange(index, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[10%] lg:min-w-[10%]">
            <div className="flex flex-col">
              <label
                htmlFor={`iva-${index}`}
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                IVA
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    type="text"
                    id={`iva-${index}`}
                    defaultValue={row.iva}
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register(`description.${index}.iva` as const, {
                      valueAsNumber: true,
                    })}
                    onChange={(e) => onIvaChange(index, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[10%] lg:min-w-[10%]">
            <div className="flex flex-col">
              <label
                htmlFor={`irpf-${index}`}
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                IRPF
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    type="text"
                    id={`irpf-${index}`}
                    defaultValue={row.irpf}
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register(`description.${index}.irpf` as const, {
                      valueAsNumber: true,
                    })}
                    onChange={(e) => onIrpfChange(index, e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {rows.length > 1 && index != 0 && (
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[10%] lg:min-w-[10%]">
              <div className="flex flex-col mt-[23px]">
                <Button
                  className="p-[11px]!"
                  icon="pi pi-trash"
                  type="button"
                  severity="danger"
                  aria-label="Eliminar fila"
                  onClick={() => onDeleteRow(index)}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
        <div className="flex flex-col">
          <Button type="button" label="Agregar fila" onClick={onAddRow} />
        </div>
      </div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[75%] lg:min-w-[75%]"></div>
    </>
  );
};

export default BillItemsSection;
