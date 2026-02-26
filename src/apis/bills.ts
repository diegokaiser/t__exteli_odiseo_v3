import { db } from '@/lib/firebase';
import { Bill, BillSearch } from '@/types/bills';
import { normalizeString } from '@/utils/normalizeString';
import {
  addDoc,
  collection,
  doc,
  endAt,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
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
  GetAllBillsByWeek: async (weekStart: Date, weekEnd: Date): Promise<Bill[]> => {
    try {
      const billsRef = collection(db, 'bills');
      const q = query(
        billsRef,
        where('createdAt', '>=', weekStart),
        where('createdAt', '<', weekEnd)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Bill),
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds ?? 0;
          const bTime = b.createdAt?.seconds ?? 0;
          return bTime - aTime;
        });
    } catch (err) {
      console.error(`GetAllBillsByWeek (${weekStart} - ${weekEnd}) error: ${err}`);
      throw err;
    }
  },
  GetAllBillsByMonth: async (month: number, year: number): Promise<Bill[]> => {
    try {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);

      const billsRef = collection(db, 'bills');
      const q = query(billsRef, where('createdAt', '>=', start), where('createdAt', '<', end));
      const snapshot = await getDocs(q);

      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Bill),
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds ?? 0;
          const bTime = b.createdAt?.seconds ?? 0;
          return bTime - aTime;
        });
    } catch (err) {
      console.error(`GetAllBillsByMonth (${month}, ${year}) error: ${err}`);
      throw err;
    }
  },
  // trae todas las facturas, necesita optimización
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
  GetBillsByStatusAndMonth: async (
    status: string,
    month: number,
    year: number
  ): Promise<Bill[]> => {
    try {
      const start = new Date(year, month, 1, 0, 0, 0);
      const end = new Date(year, month + 1, 1, 0, 0, 0);

      const billsRef = collection(db, 'bills');
      const q = query(
        billsRef,
        where('status', '==', status),
        where('createdAt', '>=', start),
        where('createdAt', '<', end)
      );
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
  GetBillsByStatusAndMonthCount: async (
    status: string,
    month: number,
    year: number
  ): Promise<number> => {
    try {
      const start = new Date(year, month, 1, 0, 0, 0);
      const end = new Date(year, month + 1, 1, 0, 0, 0);

      const billsRef = collection(db, 'bills');

      const q = query(
        billsRef,
        where('status', '==', status),
        where('createdAt', '>=', start),
        where('createdAt', '<', end)
      );
      const snapshot = await getCountFromServer(q);

      return snapshot.data().count;
    } catch (err) {
      console.error(`GetBillsByStatus (${status}) error: ${err}`);
      throw err;
    }
  },
  GetBillsByStatusDashboard: async (status: string): Promise<Bill[]> => {
    try {
      const billsRef = collection(db, 'bills');
      const q = query(
        billsRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
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
  ReturnBill: async (uid: string): Promise<void> => {
    try {
      const billRef = doc(db, 'bills', uid);
      await updateDoc(billRef, { status: 'devuelta' });
    } catch (err) {
      console.error(`ReturnBill error (${uid}): ${err}`);
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
  FindBills: async (params: BillSearch): Promise<Bill[]> => {
    try {
      let q;
      if (params.by === 'billNumber') {
        q = query(collection(db, 'bills'), where('billNumber', '==', params.value.trim()));
      } else if (params.by === 'customer') {
        q = query(
          collection(db, 'bills'),
          orderBy('customer'),
          startAt(params.value),
          endAt(params.value + '\uf8ff')
        );
        console.log(params.value);
        console.log(normalizeString(params.value));
      } else {
        q = query(collection(db, 'bills'), where('createDate', '==', params.value.trim()));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Bill),
      }));
    } catch (err) {
      console.error(`FindBills (${params.by}:${params.value}) error: ${err}`);
      throw err;
    }
  },
};

export default bills;
