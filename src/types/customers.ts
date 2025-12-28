import { Timestamp } from 'firebase/firestore';

import { constants } from '@/lib/constants/constants';

const { documentType, gender, status } = constants;

type DocumentType = (typeof documentType)[number];
type Gender = (typeof gender)[number];
type Status = (typeof status)[number];

export interface Customer {
  /** Datos personales */
  firstName: string;
  lastName: string;
  name: string; // nombre completo
  email: string;
  phone: string;
  gender?: Gender;
  birthday?: string; // YYYY-MM-DD
  nationality?: string;

  /** Documentación */
  documentType?: DocumentType;
  documentNumber?: string;

  /** Información comercial */
  agent?: string;
  servicePack?: string;
  procedure?: string;
  timeline?: string;
  status?: Status;

  /** Pagos */
  totalPrice?: string;
  paid?: string;
  threeMonths?: boolean;
  messenger?: string;

  /** Fechas */
  enterDate: string; // YYYY-MM-DD
  createdAt: Timestamp;
  updatedAt?: Timestamp;

  /** Auditoría */
  registerdBy?: string;

  /** Extensible */
  [key: string]: any;
}

export interface CustomerForm extends Customer {}
