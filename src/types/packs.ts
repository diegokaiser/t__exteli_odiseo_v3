import { Timestamp } from 'firebase/firestore';

export interface Pack {
  name: string;
  price: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;

  [key: string]: any;
}
