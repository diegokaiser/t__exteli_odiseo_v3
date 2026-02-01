import { db } from '@/lib/firebase';
import { Accounting } from '@/types/accounting';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

const accounting = {
  GetAccounting: async (uid: string): Promise<Accounting | null> => {
    try {
      const ref = doc(db, 'accounting', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...(snap.data() as Accounting),
      };
    } catch (err) {
      console.error(`GetAccounting error: ${err}`);
      throw err;
    }
  },
  GetAllAcounting: async (): Promise<Accounting[]> => {
    try {
      const accountingRef = collection(db, 'accounting');
      const snapshot = await getDocs(accountingRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Accounting),
      }));
    } catch (err) {
      console.error(`GetAllAcounting error: ${err}`);
      throw err;
    }
  },
  GetAllAccountingToday: async (): Promise<Accounting[]> => {
    try {
      const accountingRef = collection(db, 'accounting');
      const snapshot = await getDocs(accountingRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Accounting),
      }));
    } catch (err) {
      console.error(`GetAllAccountingToday error: ${err}`);
      throw err;
    }
  },
  GetAllAccountingByPeriod: async () => {},
  GetAllAccountingByMonth: async () => {},
  GetAllAccountingByMonths: async () => {},
  GetAllAccountingBySemester: async () => {},
  PostAccounting: async (accounting: Omit<Accounting, 'createdAt'>): Promise<void> => {
    try {
      const accountingRef = doc(collection(db, 'accounting'));
      await setDoc(accountingRef, {
        accounting,
      });
    } catch (err) {
      console.error(`PostAccounting error: ${err}`);
      throw err;
    }
  },
  PatchAccounting: async (
    uid: string,
    updates: Partial<Omit<Accounting, 'createdAt'>>
  ): Promise<void> => {
    try {
      const accountingDocRef = doc(db, 'accounting', uid);
      await updateDoc(accountingDocRef, updates);
    } catch (err) {
      console.error(`PatchAccounting error (${uid}): ${err}`);
      throw err;
    }
  },
};

export default accounting;
