import { Timestamp } from 'firebase/firestore';

export interface Procedure {
  name: string;
  description: string;
  price: number;
  price1: number;
  registerdBy: string;
  status: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;

  [key: string]: any;
}
