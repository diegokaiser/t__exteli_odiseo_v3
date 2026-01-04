import { Timestamp } from 'firebase/firestore';

import { constants } from '@/lib/constants/constants';

const { documentType, gender, messenger, status } = constants;

type DocumentType = (typeof documentType)[number];
type Gender = (typeof gender)[number];
type Messenger = (typeof messenger)[number];
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

export interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneSecondary?: string;
  gender?: Gender;
  birthday?: string;
  nationality?: string;

  documentType?: DocumentType;
  documentNumber?: string;

  agent?: string;
  servicePack?: string;
  procedure?: string;
  status?: Status;

  totalPrice?: string;
  paid?: string;
  threeMonths?: boolean;
  messenger?: Messenger;

  registerdBy?: string;
  timeline?: string;

  enterDate: string;
  createdAt: string;
  updatedAt?: string;
}
