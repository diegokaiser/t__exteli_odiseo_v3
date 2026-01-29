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

export interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  phoneSecondary: string;
  role: string;
  status: string;
  updatedAt?: Timestamp;
}

export interface UserAppwrite {
  $id: string;
  name: string;
  email: string;
  labels: string[];
  password: string;
  phone: string;
  status: string;
  registration: string;
  createdAt: string;
  updatedAt?: string;
}
