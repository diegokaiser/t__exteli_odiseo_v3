import { db } from '@/lib/firebase';
import { Nationality } from '@/types/nationalities';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';

const nationalities = {
  GetNationality: async (uid: string): Promise<Nationality | null> => {
    try {
      const ref = doc(db, 'nationalities', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...(snap.data() as Nationality),
      };
    } catch (err) {
      console.error(`GetNationality error: ${err}`);
      throw err;
    }
  },
  GetAllNationalities: async (): Promise<Nationality[]> => {
    try {
      const nationalitiesRef = collection(db, 'nationalities');
      const snapshot = await getDocs(nationalitiesRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Nationality),
      }));
    } catch (err) {
      console.error(`GetAllNationalities error: ${err}`);
      throw err;
    }
  },
  PostNationality: async (
    nationality: Omit<Nationality, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> => {
    try {
      await addDoc(collection(db, 'nationalities'), {
        ...nationality,
        createdAt: Date.now(),
      });
    } catch (err) {
      console.error(`PostNationality error: ${err}`);
      throw err;
    }
  },
};

export default nationalities;
