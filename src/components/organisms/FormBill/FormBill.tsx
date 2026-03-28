'use client';

import { useRouter } from 'next/navigation';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import { useBillRows } from '@/hooks/useBillRows';
import { useGetLastBill, usePostBill } from '@/hooks/useBills';
import { useCompanies } from '@/hooks/useCompany';
import { useCustomersSelect } from '@/hooks/useCustomer';
import { constants } from '@/lib/constants/constants';
import { BillForm, BillIrpf, BillIva } from '@/types/bills';
import { Customer } from '@/types/customers';
import { calculateBillTotals } from '@/utils/bill/calculations';
import { buildBillPayload } from '@/utils/bill/payload';

import {
  BillActionsSection,
  BillCustomerSection,
  BillItemsSection,
  BillMetaSection,
  BillObservationsSection,
  BillPreviewContent,
  BillSummarySection,
} from '@/components/molecules';

const FormBill = () => {
  const { user } = useAuth();
  const toast = useRef<any>(null);
  const router = useRouter();
  const initialCreateDate = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isRegisteredCustomer, setIsRegisteredCustomer] = useState(true);
  const billSerial = new Date().getFullYear().toString();
  const [billNumber, setBillNumber] = useState<string>('1');

  const [ivas, setIvas] = useState<BillIva[]>([]);
  const [irpfs, setIrpfs] = useState<BillIrpf[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [descuentos, setDescuentos] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const postBill = usePostBill();

  const {
    rows,
    addRow,
    deleteRow,
    updateConcept,
    updateBase,
    updateCantidad,
    updateDto,
    updateIva,
    updateIrpf,
  } = useBillRows();

  const { data: providers } = useCompanies();

  const { data: customers, isLoading: loadingCustomers } = useCustomersSelect();

  const { data: lastBillNumber, isLoading: loadingLastBillNumber } = useGetLastBill();

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
    getValues,
    trigger,
    formState: { isValid, errors, touchedFields },
  } = useForm<BillForm>({
    mode: 'onChange',
    defaultValues: {
      createDate: initialCreateDate,
      paymentMethod: '',
      notes: '',
      nonRegisteredCustomerName: '',
      nonRegisteredCustomerPhone: '',
      nonRegisteredCustomerEmail: '',
      description: rows,
    },
  });

  const toggleCustomerType = () => {
    setIsRegisteredCustomer(!isRegisteredCustomer);
  };

  const handleIncludeIVAinBASE = () => {
    if (!ivas.length) return;

    setSubtotal(subtotal - (subtotal * ivas[0].iva) / 100);
    setTotal(subtotal);
  };

  useEffect(() => {
    if (lastBillNumber) {
      const billNumber = (parseInt(lastBillNumber) + 1).toString().padStart(7, '0');
      setBillNumber(billNumber);
    }
  }, [lastBillNumber]);

  useEffect(() => {
    setValue('description', rows, { shouldValidate: true });
  }, [rows, setValue]);

  useEffect(() => {
    const { subtotal, descuentos, ivas, irpfs, total } = calculateBillTotals(rows);

    setSubtotal(subtotal);
    setDescuentos(descuentos);
    setIvas(ivas);
    setIrpfs(irpfs);
    setTotal(total);
  }, [rows]);

  useEffect(() => {
    trigger();
  }, [isRegisteredCustomer, trigger]);

  const showModal = () => {
    const formValues = getValues();

    confirmDialog({
      group: 'templating',
      header: 'Confirmación',
      message: (
        <BillPreviewContent
          billSerial={billSerial}
          billNumber={billNumber}
          provider={providers?.[0]}
          customerData={
            isRegisteredCustomer
              ? selectedCustomer?.name || ''
              : formValues.nonRegisteredCustomerName || ''
          }
          customerPhone={
            isRegisteredCustomer
              ? selectedCustomer?.phone || ''
              : formValues.nonRegisteredCustomerPhone || ''
          }
          customerEmail={
            isRegisteredCustomer
              ? selectedCustomer?.email || ''
              : formValues.nonRegisteredCustomerEmail || ''
          }
          createDate={formValues.createDate}
          rowsData={rows}
          subtotal={subtotal}
          descuentos={descuentos}
          ivas={ivas}
          irpfs={irpfs}
          total={total}
          notes={formValues.notes || ''}
          paymentMethod={formValues.paymentMethod}
          registeredBy={user?.name}
        />
      ),
      acceptLabel: 'Emitir factura',
      rejectLabel: 'Cancelar',
      accept: handleSubmit(onSubmit),
    });
  };

  const onSubmit = async (data: BillForm) => {
    setLoading(true);

    const bill = buildBillPayload({
      data,
      billSerial,
      billNumber,
      provider: providers?.[0],
      isRegisteredCustomer,
      selectedCustomer,
      rows,
      subtotal,
      descuentos,
      ivas,
      irpfs,
      total,
      registeredBy: user?.name,
    });

    try {
      console.log(bill);
      //await postBill.mutateAsync(bill);
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
      /*
      setTimeout(() => {
        router.push('/billing');
      }, 4000);
      */
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog group="templating" style={{ width: '70vw' }} />
      {loading && <LoadingScreen />}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6" autoComplete="off">
        <div className="basis-[50%] min-w-[50%]">
          <div
            className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
            style={{ width: 'calc(100% + 24px)' }}
          >
            <BillCustomerSection
              isRegisteredCustomer={isRegisteredCustomer}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              customers={customers}
              loadingCustomers={loadingCustomers}
              toggleCustomerType={toggleCustomerType}
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              selectedCustomerTemplate={selectedCustomerTemplate}
              customerOptionTemplate={customerOptionTemplate}
            />

            <BillMetaSection
              billSerial={billSerial}
              billNumber={billNumber}
              loadingLastBillNumber={loadingLastBillNumber}
              register={register}
            />

            <BillItemsSection
              rows={rows}
              register={register}
              onAddRow={addRow}
              onDeleteRow={deleteRow}
              onConceptChange={updateConcept}
              onBaseChange={updateBase}
              onCantidadChange={updateCantidad}
              onDtoChange={updateDto}
              onIvaChange={updateIva}
              onIrpfChange={updateIrpf}
            />

            <BillObservationsSection register={register} paymentMethods={paymentMethods} />

            <BillSummarySection
              subtotal={subtotal}
              descuentos={descuentos}
              ivas={ivas}
              irpfs={irpfs}
              total={total}
              rowsLength={rows.length}
              onIncludeIVAinBASE={handleIncludeIVAinBASE}
            />

            <BillActionsSection
              isValid={isValid}
              isRegisteredCustomer={isRegisteredCustomer}
              selectedCustomer={selectedCustomer}
              loading={loading}
              onPreview={showModal}
              onCancel={() => router.push('/bills')}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default FormBill;
