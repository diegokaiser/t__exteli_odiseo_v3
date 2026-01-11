import { db } from '@/lib/firebase';
import { Bill } from '@/types/bills';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

const bills = {
  GetBill: async (uid: string): Promise<Bill | null> => {
    try {
      const ref = doc(db, 'bills', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...(snap.data() as Bill),
      };
    } catch (err) {
      console.error(`GetBill error (${uid}): ${err}`);
      throw err;
    }
  },
  GetAllBills: async (): Promise<Bill[]> => {
    try {
      const billsRef = collection(db, 'bills');
      const snapshot = await getDocs(billsRef);

      const bills = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Bill),
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds ?? 0;
          const bTime = b.createdAt?.seconds ?? 0;
          return bTime - aTime;
        });
      return bills;
    } catch (err) {
      console.error(`GetAllBills error: ${err}`);
      throw err;
    }
  },
  GetBillsByStatus: async (status: string): Promise<Bill[]> => {
    try {
      const billsRef = collection(db, 'bills');
      const q = query(billsRef, where('status', '==', status));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Bill),
      }));
    } catch (err) {
      console.error(`GetBillsByStatus (${status}) error: ${err}`);
      throw err;
    }
  },
  GetBillsByAgent: async (agentuid: string): Promise<Bill[]> => {
    try {
      const billsRef = collection(db, 'bills');
      const q = query(billsRef, where('agentUid', '==', agentuid));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Bill),
      }));
    } catch (err) {
      console.error(`GetBillsByAgent (${agentuid}) error: ${err}`);
      throw err;
    }
  },
  GetLastBill: async (): Promise<Bill | null> => {
    try {
      const billsRef = collection(db, 'bills');
      const q = query(billsRef, orderBy('createdAt', 'desc'), limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      return {
        id: snapshot.docs[0].id,
        ...(snapshot.docs[0].data() as Bill),
      };
    } catch (err) {
      console.error(`GetLastBill error: ${err}`);
      throw err;
    }
  },
  PostBill: async (bill: Omit<Bill, 'createdAt'>): Promise<void> => {
    try {
      const billsRef = collection(db, 'bills');
      await addDoc(billsRef, {
        ...bill,
      });
    } catch (err) {
      console.error(`PostBill error: ${err}`);
      throw err;
    }
  },
  CancelBill: async (uid: string): Promise<void> => {
    try {
      const billRef = doc(db, 'bills', uid);
      await updateDoc(billRef, { status: 'cancelada' });
    } catch (err) {
      console.error(`CancelBill error (${uid}): ${err}`);
      throw err;
    }
  },
  PaidBill: async (uid: string): Promise<void> => {
    try {
      const billRef = doc(db, 'bills', uid);
      await updateDoc(billRef, { status: 'pagada' });
    } catch (err) {
      console.error(`PaidBill error (${uid}): ${err}`);
      throw err;
    }
  },
};

export default bills;
