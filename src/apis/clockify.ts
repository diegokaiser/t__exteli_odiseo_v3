import { db } from '@/lib/firebase';
import { ClockifyDay, ClockifyRecord } from '@/types/clockify';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

const clockify = {
  GetRecord: async (userUid: string, recordUid: string): Promise<ClockifyDay | null> => {
    try {
      const ref = doc(db, `clockify/${userUid}/records/${recordUid}`);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return snap.data() as ClockifyDay;
    } catch (err) {
      console.error(`GetRecord error (${userUid}, ${recordUid}): ${err}`);
      throw err;
    }
  },
  GetRecords: async (userUid: string): Promise<ClockifyDay[]> => {
    try {
      const ref = collection(db, `clockify/${userUid}/records`);
      const snap = await getDocs(ref);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ClockifyDay),
      }));
    } catch (err) {
      console.error(`GetRecords error (${userUid}): ${err}`);
      throw err;
    }
  },
  GetRecordsByPeriod: async ({
    userUid,
    startDate,
    endDate,
  }: {
    userUid: string;
    startDate: string;
    endDate: string;
  }): Promise<ClockifyDay[]> => {
    try {
      const ref = collection(db, `clockify/${userUid}/records`);
      const q = query(ref, where('date', '>=', startDate), where('date', '<=', endDate));
      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ClockifyDay),
      }));
    } catch (err) {
      console.error(`GetRecordsByWeek error (${userUid}, ${startDate}, ${endDate}): ${err}`);
      throw err;
    }
  },
  GetRecordsByMonth: async ({
    userUid,
    year,
    month,
  }: {
    userUid: string;
    year: string;
    month: string;
  }): Promise<ClockifyDay[]> => {
    try {
      const ref = collection(db, `clockify/${userUid}/records`);
      const prefix = `${year}-${month.toString().padStart(2, '0')}`;
      const q = query(
        ref,
        where('date', '>=', `${prefix}-01`),
        where('date', '<=', `${prefix}-31`)
      );
      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ClockifyDay),
      }));
    } catch (err) {
      console.error(`GetRecordsByMonth error (${userUid}, ${year}, ${month}): ${err}`);
      throw err;
    }
  },
  PostRecord: async ({
    userUid,
    record,
  }: {
    userUid: string;
    record: ClockifyRecord;
  }): Promise<ClockifyRecord> => {
    try {
      const { date } = record;

      if (!date) {
        throw new Error('No date provided');
      }
      const dayRef = doc(db, 'clockify', userUid, 'records', date);
      const snap = await getDoc(dayRef);
      const now = Timestamp.now();

      const newRecord: ClockifyRecord = {
        ...record,
        registeredAt: record.registeredAt ?? now,
      };

      if (snap.exists()) {
        await updateDoc(dayRef, {
          records: arrayUnion(newRecord),
        });
      } else {
        await setDoc(dayRef, {
          date,
          records: [newRecord],
        });
      }

      return newRecord;
    } catch (err) {
      console.error(`PostRecord error (${record.date}): ${err}`);
      throw err;
    }
  },
  PatchRecord: async ({
    userUid,
    recordUid,
    record,
  }: {
    userUid: string;
    recordUid: string;
    record: Omit<ClockifyDay, 'id' | 'userUid' | 'date'>;
  }) => {
    try {
      const ref = doc(db, `clockify/${userUid}/records/${recordUid}`);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      await updateDoc(ref, record);
    } catch (err) {
      console.error(`PatchRecord error (${recordUid}): ${err}`);
      throw err;
    }
  },
};

export default clockify;
