import { Timestamp } from 'firebase/firestore';

export interface Accounting {
  amount: number;
  description: string;
  reference: string;
  registerdBy: string;
  type: string;
  createdAt: Timestamp;
  [key: string]: any;
}
