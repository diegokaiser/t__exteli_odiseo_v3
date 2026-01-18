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
