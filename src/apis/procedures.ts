import { db } from '@/lib/firebase';
import { Procedure } from '@/types/procedures';
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

const procedures = {
  GetProcedure: async (uid: string): Promise<Procedure | null> => {
    try {
      const ref = doc(db, 'procedures', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...(snap.data() as Procedure),
      };
    } catch (err) {
      console.error(`GetProcedure error: ${err}`);
      throw err;
    }
  },
  GetProcedures: async (): Promise<Procedure[]> => {
    try {
      const proceduresRef = collection(db, 'procedures');
      const snapshot = await getDocs(proceduresRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Procedure),
      }));
    } catch (err) {
      console.error(`GetProcedures error: ${err}`);
      throw err;
    }
  },
  PostProcedure: async (procedure: Omit<Procedure, 'createdAt'>): Promise<void> => {
    try {
      await addDoc(collection(db, 'procedures'), {
        ...procedure,
        createdAt: Date.now(),
      });
    } catch (err) {
      console.error(`PostProcedure error: ${err}`);
      throw err;
    }
  },
  PatchProcedure: async (
    uid: string,
    procedure: Partial<Omit<Procedure, 'createdAt'>>
  ): Promise<void> => {
    try {
      const procedureRef = doc(db, 'procedures', uid);
      await updateDoc(procedureRef, procedure);
    } catch (err) {
      console.error(`PatchProcedure error: ${err}`);
      throw err;
    }
  },
};

export default procedures;
