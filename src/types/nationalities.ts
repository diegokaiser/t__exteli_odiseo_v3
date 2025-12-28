import { Timestamp } from 'firebase/firestore';

export interface Nationality {
  country: string;
  iso3166: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;

  [key: string]: any;
}
