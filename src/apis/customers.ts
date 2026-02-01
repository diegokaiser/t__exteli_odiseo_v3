import { db } from '@/lib/firebase';
import { Customer } from '@/types/customers';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';

const customers = {
  GetCustomer: async (uid: string): Promise<Customer | null> => {
    try {
      const ref = doc(db, 'customers', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...(snap.data() as Customer),
      };
    } catch (err) {
      console.error(`GetCustomer error: ${err}`);
      throw err;
    }
  },
  GetAllCustomers: async (): Promise<Customer[]> => {
    try {
      const customersRef = collection(db, 'customers');
      const q = query(customersRef, orderBy('firstName', 'asc'));
      const snapshot = await getDocs(q);

      const customers = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Customer),
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds ?? 0;
          const bTime = b.createdAt?.seconds ?? 0;
          return aTime - bTime;
        });

      return customers;
    } catch (err) {
      console.error(`GetAllCustomers error: ${err}`);
      throw err;
    }
  },
  GetCustomersPage: async (
    limitValue: number,
    startAfterDoc?: QueryDocumentSnapshot
  ): Promise<{ customers: Customer[]; lastDoc: QueryDocumentSnapshot | null }> => {
    try {
      const customersRef = collection(db, 'customers');
      //let q = query(customersRef, orderBy('firstName', 'asc'), limit(limitValue));
      let q = query(customersRef, orderBy('firstName', 'asc'), limit(limitValue));

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const snapshot = await getDocs(q);

      const customers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Customer),
      }));

      const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

      return { customers, lastDoc };
    } catch (err) {
      console.error(`GetCustomersPage error: ${err}`);
      throw err;
    }
  },
  GetCustomerName: async (uid: string): Promise<string> => {
    try {
      const ref = doc(db, 'customers', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return '';

      return snap.data().customer.firstName;
    } catch (err) {
      console.error(`GetCustomerName error: ${err}`);
      throw err;
    }
  },
  GetCustomersByStatus: async (status: string): Promise<Customer[]> => {
    try {
      const customersRef = collection(db, 'customers');
      const q = query(customersRef, where('status', '==', status));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Customer),
      }));
    } catch (err) {
      console.error(`GetCustomersByStatus (${status}) error: ${err}`);
      throw err;
    }
  },
  GetAllCustomersByAgent: async (agentUid: string): Promise<Customer[]> => {
    try {
      const customersRef = collection(db, 'customers');
      const q = query(customersRef, where('agentUid', '==', agentUid));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Customer),
      }));
    } catch (err) {
      console.error(`GetAllCustomersByAgent (${agentUid}) error: ${err}`);
      throw err;
    }
  },
  PostCustomer: async (customer: Omit<Customer, 'createdAt'>): Promise<void> => {
    try {
      const customerRef = collection(db, 'customers');
      //const customerRef = collection(db, 'customers-test');
      await addDoc(customerRef, {
        customer,
      });
    } catch (err) {
      console.error(`PostCustomer error: ${err}`);
      throw err;
    }
  },
  PatchCustomer: async (
    uid: string,
    updates: Partial<Omit<Customer, 'createdAt'>>
  ): Promise<void> => {
    try {
      const customerDocRef = doc(db, 'customers', uid);
      //const customerDocRef = doc(db, 'customers-test', uid);
      await updateDoc(customerDocRef, updates);
    } catch (err) {
      console.error(`PatchCustomer error (${uid}): ${err}`);
      throw err;
    }
  },
};

export default customers;
