import { Timestamp } from 'firebase/firestore';

import { constants } from '@/lib/constants/constants';

const { companyDocumentType } = constants;

type DocumentType = (typeof companyDocumentType)[number];

export interface Company {
  id?: string;
  name: string;
  email: string;
  document: string;
  documentType: DocumentType;
  address: string;
  city: string;
  country: string;
  zipcode: string;
  agentUid?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  logo?: string;
}
