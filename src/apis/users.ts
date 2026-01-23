import { db } from '@/lib/firebase';
import { User } from '@/types/users';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const users = {
  GetUser: async (userUid: string) => {
    try {
      const userRef = doc(db, 'users', userUid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) return null;

      return {
        id: snap.id,
        ...(snap.data() as User),
      };
    } catch (err) {
      console.error(`GetUser error: ${err}`);
      throw err;
    }
  },
  GetUsers: async (): Promise<User[]> => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as User),
      }));
    } catch (err) {
      console.error(`GetUsers error: ${err}`);
      throw err;
    }
  },
  GetUserName: async (userUid: string) => {
    try {
      const userRef = doc(db, 'users', userUid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) return '';

      return {
        fullName: `${snap.data().firstName} ${snap.data().lastName}`,
      };
    } catch (err) {
      console.error(`GetUserName error: ${err}`);
      throw err;
    }
  },
};

export default users;
