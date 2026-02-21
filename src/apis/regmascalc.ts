import { db } from '@/lib/firebase';
import { RegMasCalc } from '@/types/regmascalc';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

const regmascalc = {
  GetCustomer: async (uid: string): Promise<RegMasCalc | null> => {
    try {
      const ref = doc(db, 'customers-calc', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...(snap.data() as RegMasCalc),
      };
    } catch (err) {
      console.error(`GetCustomer error (${uid}): ${err}`);
      throw err;
    }
  },
  GetCustomers: async (): Promise<RegMasCalc[]> => {
    try {
      const ref = collection(db, 'customers-calc');
      const q = query(ref, orderBy('name', 'desc'));
      const snap = await getDocs(q);

      const customers = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as RegMasCalc),
      }));

      return customers;
    } catch (err) {
      console.error(`GetCustomers error: ${err}`);
      throw err;
    }
  },
  PostCustomer: async (data: Omit<RegMasCalc, 'createdAt'>): Promise<void> => {
    console.log(data);
    try {
      const ref = collection(db, 'customers-calc');
      await addDoc(ref, data);
    } catch (err) {
      console.error(`PostCustomer error: ${err}`);
      throw err;
    }
  },
};

export default regmascalc;
