import { Timestamp } from 'firebase/firestore';

export interface Notification {
  title: string;
  hour: string;
  enabled: boolean;
  days: number[];
}

export interface NotificationDB {
  title: string;
  hour: Timestamp;
  enabled: boolean;
  days: number[];
}

export interface NotificationForm {
  title: string;
  hour: Date;
}
