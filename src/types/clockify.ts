import { Timestamp } from 'firebase/firestore';

export interface ClockifyRecord {
  id?: string;
  registeredAt?: Timestamp;
  name: string;
  description?: string;
  registeredBy: string;
  updatedAt?: Timestamp;
  updatedBy?: string;
  type?: 'start' | 'pause' | 'resume' | 'end';
  date?: string;
}

export interface ClockifyDay {
  id?: string;
  date: string;
  records: ClockifyRecord[];
}

export type ClockifyDayWithUser = ClockifyDay & {
  id: string;
  userUid: string;
};

export type ClockifyRecordUI = {
  registeredAt: { seconds: number; nanoseconds: number };
  registeredAtFormated: string;
  type: string;
  name?: string;
  description?: string;
  updatedBy?: string;
};

export type ClockifyDayWithUserUI = {
  id: string;
  userUid: string;
  userFullName: string;
  date: string;
  records: ClockifyRecordUI[];
};

export type FirestoreTimestampLike =
  | { seconds: number; nanoseconds: number }
  | { toDate: () => Date };
