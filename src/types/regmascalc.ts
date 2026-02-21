import { Timestamp } from 'firebase/firestore';

export interface RegMasCalc {
  cincoMeses: boolean;
  comentarios?: string;
  email: string;
  familia: boolean;
  fechaIngreso: boolean;
  fechaIngresoExacta?: string;
  name: string;
  nacionalidad: string;
  phone: string;
  provincia: string;
  situacion: string;
  createdAt: Timestamp;
  ua: object;

  [key: string]: any;
}
