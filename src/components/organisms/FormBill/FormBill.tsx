'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader, LoadingScreen } from '@/components/atoms';
import { Document } from '@/components/wrappers';
import { useGetLastBill, usePostBill } from '@/hooks/useBills';
import { useCompanies } from '@/hooks/useCompany';
import { useCustomersSelect } from '@/hooks/useCustomer';
import { constants } from '@/lib/constants/constants';
import { BillDescriptionItem, BillForm, BillIrpf, BillIva } from '@/types/bills';
import { Customer } from '@/types/customers';
import { parsePrice } from '@/utils/parsePrice';

const FormBill = () => {
  const { user } = useAuth();
  const toast = useRef<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isRegisteredCustomer, setIsRegisteredCustomer] = useState(true);
  const [registeredCustomer, setRegisteredCustomer] = useState(false);
  const [billSerial, setBillSerial] = useState<string>(new Date().getFullYear().toString());
  const [billNumber, setBillNumber] = useState<string>('1');
  const [createDate, setCreateDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rows, setRows] = useState<BillDescriptionItem[]>([
    { id: uuidv4(), concept: '', cantidad: 1, base: 0, iva: 21, irpf: 0, dto: 0, total: 0 },
  ]);

  const [ivas, setIvas] = useState<BillIva[]>([]);
  const [irpfs, setIrpfs] = useState<BillIrpf[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [descuentos, setDescuentos] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const postBill = usePostBill();

  const { data: providers, isLoading: loadingProviders, isError: errorProviders } = useCompanies();

  const {
    data: customers,
    isLoading: loadingCustomers,
    isError: errorCustomers,
  } = useCustomersSelect();

  const {
    data: lastBillNumber,
    isLoading: loadingLastBillNumber,
    isError: errorLastBillNumber,
  } = useGetLastBill();

  const selectedCustomerTemplate = (option: Customer, props: any) => {
    if (option) {
      return <div className="flex capitalize align-items-center">{option.name}</div>;
    }
    return <div className="flex capitalize align-items-center">{props.placeholder}</div>;
  };

  const customerOptionTemplate = (option: Customer) => {
    return <div className="flex capitalize align-items-center">{option.name}</div>;
  };

  const { paymentMethods } = constants;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<BillForm>({
    mode: 'onChange',
  });

  const toggleCustomerType = () => {
    setIsRegisteredCustomer(!isRegisteredCustomer);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: uuidv4(), concept: '', cantidad: 1, base: 0, iva: 21, irpf: 0, dto: 0, total: 0 },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleIncludeIVAinBASE = () => {
    setSubtotal(subtotal - (subtotal * ivas[0].iva) / 100);
    setTotal(subtotal);
  };

  const calculateSubtotal = (
    rows: BillDescriptionItem[],
    setSubtotal: (subtotal: number) => void
  ) => {
    const newTotal = rows.reduce((acc, row) => {
      const base = Number(row.base) || 0;
      const cantidad = Number(row.cantidad) || 1;
      return acc + base * cantidad;
    }, 0);
    setSubtotal(newTotal);
  };

  const calculateDtos = (rows: BillDescriptionItem[], setDescuentos: (value: number) => void) => {
    const totalDescuentos = rows.reduce((acc, row) => acc + (Number(row.dto) || 0), 0);
    setDescuentos(totalDescuentos);
  };

  const calculateIvas = (rows: BillDescriptionItem[], setIvas: (ivas: BillIva[]) => void) => {
    const uniqueIvas = [...new Set(rows.map((row) => Number(row.iva) || 0))];
    const ivas: BillIva[] = uniqueIvas.map((iva) => ({
      iva,
      value: rows.reduce((acc, row) => {
        const base = Number(row.base) || 0;
        const cantidad = Number(row.cantidad) || 1;
        const currentIva = Number(row.iva) || 0;
        return currentIva === iva ? acc + (base * cantidad * iva) / 100 : acc;
      }, 0),
    }));
    setIvas(ivas);
  };

  const calculateIRPFs = (rows: BillDescriptionItem[], setIRPFs: (irpf: BillIrpf[]) => void) => {
    const irpfs: BillIrpf[] = rows.map((row) => {
      const irpf = Number(row.irpf) || 0;
      const base = Number(row.base) || 0;
      const cantidad = Number(row.cantidad) || 1;
      return {
        irpf,
        value: (base * cantidad * irpf) / 100,
      };
    });
    setIRPFs(irpfs);
  };

  const calculateRowTotal = (base: number, cantidad: number, dto: number) => {
    return base * cantidad - dto;
  };

  const calculateTotal = () => {
    calculateDtos(rows, setDescuentos);
    const totalIva = ivas.reduce((acc, row) => acc + row.value, 0);
    const totalIrpf = irpfs.reduce((acc, row) => acc + row.value, 0);
    const total = subtotal - descuentos + totalIva - totalIrpf;
    setTotal(total);
  };

  useEffect(() => {
    if (lastBillNumber) {
      const billNumber = (parseInt(lastBillNumber) + 1).toString().padStart(7, '0');
      setBillNumber(billNumber);
    }
  }, [lastBillNumber]);

  useEffect(() => {
    setValue('description', rows);
  }, [rows]);

  useEffect(() => {
    calculateSubtotal(rows, setSubtotal);
    calculateIvas(rows, setIvas);
    calculateIRPFs(rows, setIrpfs);
  }, [rows]);

  useEffect(() => {
    calculateTotal();
  }, [subtotal, descuentos, ivas, irpfs]);

  const showModal = () => {
    console.log('modal');
    confirmDialog({
      group: 'templating',
      header: 'Confirmación',
      message: (
        <div className="w-full">
          <PDFViewer style={{ width: '100%', height: '800px' }}>
            <Document
              billSerial={billSerial}
              billNumber={billNumber}
              provider={providers![0]!}
              customerData={
                isRegisteredCustomer
                  ? selectedCustomer!.name!
                  : (document.getElementById('nonRegisteredCustomerName') as HTMLInputElement)
                      ?.value
              }
              customerPhone={selectedCustomer?.phone}
              createDate={createDate}
              rowsData={rows}
              subtotal={subtotal}
              descuentos={descuentos}
              ivas={ivas}
              irpfs={irpfs}
              total={total}
              notes={(document.getElementById('notes') as HTMLInputElement)?.value}
              paymentMethod={(document.getElementById('paymentMethod') as HTMLSelectElement)?.value}
              status={'emitted'}
            />
          </PDFViewer>
        </div>
      ),
      acceptLabel: 'Emitir factura',
      rejectLabel: 'Cancelar',
      accept: handleSubmit(onSubmit),
    });
  };

  const onSubmit = async (data: BillForm) => {
    setLoading(true);
    const bill = {
      billSerial,
      billNumber,
      provider: providers?.[0],
      customer: isRegisteredCustomer
        ? selectedCustomer
        : (document.getElementById('nonRegisteredCustomerName') as HTMLInputElement)?.value,
      phone: !isRegisteredCustomer
        ? (document.getElementById('nonRegisteredCustomerPhone') as HTMLInputElement)?.value
        : '',
      createDate,
      description: rows,
      subtotal,
      descuentos,
      ivas,
      irpfs,
      total,
      notes: (document.getElementById('notes') as HTMLInputElement)?.value,
      paymentMethod: (document.getElementById('paymentMethod') as HTMLSelectElement)?.value,
      status: 'pendiente',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    try {
      await postBill.mutateAsync(bill);
      toast.current.show({
        severity: 'success',
        summary: 'Factura emitida',
        detail: 'Factura emitida correctamente',
        life: 4000,
      });
    } catch (err: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Factura no emitida',
        detail: `Ocurrió un error al emitir la factura ${err}`,
        life: 4000,
      });
    } finally {
      setLoading(false);
      router.push('/billing');
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog group="templating" style={{ width: '70vw' }} />
      {loading && <LoadingScreen />}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="basis-[50%] min-w-[50%]">
          <div
            className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
            style={{ width: 'calc(100% + 24px)' }}
          >
            <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Datos de creación</h3>
            {isRegisteredCustomer ? (
              <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
                <div className="flex flex-col">
                  <label
                    htmlFor="customer"
                    className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                  >
                    Cliente
                  </label>
                  <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                    <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                      <Dropdown
                        loading={loadingCustomers}
                        value={selectedCustomer}
                        onChange={(e: DropdownChangeEvent) => setSelectedCustomer(e.value)}
                        options={customers}
                        optionLabel="name"
                        placeholder="Seleccionar cliente"
                        filter
                        filterDelay={400}
                        valueTemplate={selectedCustomerTemplate}
                        itemTemplate={customerOptionTemplate}
                        className="border-0! w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="nonRegisteredCustomerName"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Nombre
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <InputText
                          id="nonRegisteredCustomerName"
                          className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="nonRegisteredCustomerPhone"
                      className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                    >
                      Número de móvil
                    </label>
                    <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                      <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <InputText
                          id="nonRegisteredCustomerPhone"
                          className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
              <div className="flex flex-col mt-[23px]">
                <Button
                  className="px-[6px]! py-[11px]!"
                  type="button"
                  label={
                    isRegisteredCustomer
                      ? 'Cambiar a cliente no registrado'
                      : 'Cambiar a cliente registrado'
                  }
                  severity={isRegisteredCustomer ? 'info' : 'secondary'}
                  onClick={toggleCustomerType}
                />
              </div>
            </div>
            {isRegisteredCustomer ? (
              <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>
            ) : (
              <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]"></div>
            )}

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
                      defaultValue={createDate}
                      className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                      {...register('createDate')}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>

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
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[index].concept = e.target.value;
                            setRows(newRows);
                          }}
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
                          onChange={(e) => {
                            const base = Number(e.target.value) || 0;
                            const cantidad = rows[index].cantidad || 1;
                            const dto = rows[index].dto || 0;

                            const newRows = [...rows];
                            newRows[index] = {
                              ...newRows[index],
                              base,
                              total: calculateRowTotal(base, cantidad, dto),
                            };
                            setRows(newRows);
                          }}
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
                          onChange={(e) => {
                            const cantidad = Number(e.target.value) || 1;
                            const base = rows[index].base || 0;
                            const dto = rows[index].dto || 0;

                            const newRows = [...rows];
                            newRows[index] = {
                              ...newRows[index],
                              cantidad,
                              total: calculateRowTotal(base, cantidad, dto),
                            };
                            setRows(newRows);
                          }}
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
                          onChange={(e) => {
                            const dto = Number(e.target.value) || 0;
                            const base = rows[index].base || 0;
                            const cantidad = rows[index].cantidad || 1;

                            const newRows = [...rows];
                            newRows[index] = {
                              ...newRows[index],
                              dto,
                              total: calculateRowTotal(base, cantidad, dto),
                            };

                            setRows(newRows);
                          }}
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
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[index].iva = Number(e.target.value);
                            setRows(newRows);
                          }}
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
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[index].irpf = Number(e.target.value);
                            setRows(newRows);
                          }}
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
                        onClick={() => handleDeleteRow(index)}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
              <div className="flex flex-col">
                <Button type="button" label="Agregar fila" onClick={handleAddRow} />
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[75%] lg:min-w-[75%]"></div>

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

            {total != 0 && rows.length == 1 && (
              <>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[70%] lg:min-w-[70%]"></div>
                <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[30%] lg:min-w-[30%]">
                  <Button
                    type="button"
                    label="Inclur IVA en el precio"
                    severity="secondary"
                    className="w-full"
                    onClick={handleIncludeIVAinBASE}
                  />
                </div>
              </>
            )}

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
              <div className="flex flex-col">
                <Button
                  type="button"
                  label="Previsualizar"
                  disabled={!isValid || loading}
                  className="disabled:bg-transparent! disabled:cursor-not-allowed! disabled:text-[#dbe0e5]! disabled:border-[#dbe0e5]! disabled:border-[2px]!"
                  onClick={() => showModal()}
                />
              </div>
            </div>

            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
              <div className="flex flex-col">
                <Button label="Cancelar" severity="danger" disabled={loading} />
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>
          </div>
        </div>
      </form>
    </>
  );
};

export default FormBill;
