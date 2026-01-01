import { db } from '@/lib/firebase';
import { Pack } from '@/types/packs';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const packs = {
  GetPack: async (uid: string): Promise<Pack | null> => {
    try {
      const ref = doc(db, 'packs', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...(snap.data() as Pack),
      };
    } catch (err) {
      console.error(`GetPack error: ${err}`);
      throw err;
    }
  },
  GetPacks: async (): Promise<Pack[]> => {
    try {
      const packsRef = collection(db, 'packs');
      const snapshot = await getDocs(packsRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Pack),
      }));
    } catch (err) {
      console.error(`GetPacks error: ${err}`);
      throw err;
    }
  },
};

export default packs;
