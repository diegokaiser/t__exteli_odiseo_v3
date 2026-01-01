import { Timestamp } from 'firebase/firestore';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  phoneSecondary: string;
  role: string;
  status: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;

  [key: string]: any;
}
