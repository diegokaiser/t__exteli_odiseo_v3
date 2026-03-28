import { BillDescriptionItem, BillForm, BillIrpf, BillIva } from '@/types/bills';
import { Company } from '@/types/company';
import { Customer } from '@/types/customers';

type BuildBillPayloadParams = {
  data: BillForm;
  billSerial: string;
  billNumber: string;
  provider?: Company;
  isRegisteredCustomer: boolean;
  selectedCustomer: Customer | null;
  rows: BillDescriptionItem[];
  subtotal: number;
  descuentos: number;
  ivas: BillIva[];
  irpfs: BillIrpf[];
  total: number;
  registeredBy?: string;
};

export const buildBillPayload = ({
  data,
  billSerial,
  billNumber,
  provider,
  isRegisteredCustomer,
  selectedCustomer,
  rows,
  subtotal,
  descuentos,
  ivas,
  irpfs,
  total,
  registeredBy,
}: BuildBillPayloadParams) => {
  return {
    billSerial,
    billNumber,
    provider,
    customer: isRegisteredCustomer ? selectedCustomer : data.nonRegisteredCustomerName,
    phone: isRegisteredCustomer
      ? selectedCustomer?.phone || ''
      : data.nonRegisteredCustomerPhone || '',
    email: isRegisteredCustomer
      ? selectedCustomer?.email || ''
      : data.nonRegisteredCustomerEmail || '',
    createDate: data.createDate,
    description: rows,
    subtotal,
    descuentos,
    ivas,
    irpfs,
    total,
    notes: data.notes || '',
    paymentMethod: data.paymentMethod,
    status: 'Pagado',
    registeredBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
