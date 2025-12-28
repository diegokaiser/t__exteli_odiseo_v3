import { Timestamp } from 'firebase/firestore';

export interface LineRegisterBy {
  uid: string;
  firstName?: string;
  lastName?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Line {
  comment: string;
  registerdBy: LineRegisterBy;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Timeline {
  lines: Line[];
  [key: string]: any;
}

export interface LineHook {
  comment: string;
  registerdByUid: string;
  registerdBy: string;
  firstName?: string;
  lastName?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
