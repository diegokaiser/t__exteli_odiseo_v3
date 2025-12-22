export interface CustomerData {
  createdAt: number;
  firstName: string;
  lastName: string;
  agent?: string;
  [key: string]: any;
}

export interface CustomerDocument {
  id: string;
  customer: CustomerData;
  status?: string;
}