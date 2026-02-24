import { Timestamp } from 'firebase/firestore';

import { Company } from '@/types/company';

export interface BillDescriptionItem {
  id?: string;
  concept: string;
  cantidad: number;
  base: number;
  iva: number;
  irpf: number;
  dto: number;
  total: number;
}

export interface BillIva {
  iva: number;
  value: number;
}

export interface BillIrpf {
  irpf: number;
  value: number;
}

export interface BillCustomerObject {
  enterDate: string;
  phoneSecondary?: string;
  phone: string;
  email: string;

  firstName: string;
  lastName: string;
  gender: 'Masculino' | 'Femenino' | string;
  birthday: string;

  nationality: string;
  documentType: 'DNI' | 'NIE' | 'Pasaporte' | string;
  documentNumber: string;

  status: 'Activo' | 'Inactivo' | string;
  messenger: 'Sí' | 'No' | string;

  agent: string;
  registerdBy: string;

  procedure: number;
  servicePack: string;
  totalPrice: string;
  paid: string;
  threeMonths?: boolean;

  timeline?: string;

  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type BillCustomer = string | { customer: BillCustomerObject };

export interface Bill {
  billSerial: string;
  billNumber: string;

  createDate: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;

  customer: BillCustomer;
  phone: string;

  description: BillDescriptionItem[];

  subtotal: number;
  descuentos: number;
  total: number;

  ivas: BillIva[];
  irpfs: BillIrpf[];

  notes: string;
  status: 'pendiente' | 'pagada' | 'cancelada' | 'devuelta';

  provider: Company;

  paymentMethod: 'Efectivo' | 'Bizum' | 'Tarjeta' | 'Transferencia bancaria' | string;

  registerdBy?: string;

  [key: string]: any;
}

export interface BillForm {
  billSerial: string;
  billNumber: string;

  createDate: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;

  customer: BillCustomer;
  phone: string;

  description: BillDescriptionItem[];

  subtotal: number;
  descuentos: number;
  total: number;

  ivas: BillIva[];
  irpfs: BillIrpf[];

  notes: string;
  status: 'pendiente' | 'pagada' | 'cancelada' | 'devuelta';

  provider: Company;

  paymentMethod: 'Efectivo' | 'Bizum' | 'Tarjeta' | 'Transferencia bancaria' | string;

  registerdBy?: string;
}

export type BillSearch =
  | { by: 'billNumber'; value: string }
  | { by: 'customer'; value: string }
  | { by: 'createDate'; value: string };

export type BillSearchBy = 'billNumber' | 'customer' | 'createDate';
