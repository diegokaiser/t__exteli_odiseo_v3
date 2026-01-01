import { db } from '@/lib/firebase';
import { User } from '@/types/users';
import { collection, getDocs } from 'firebase/firestore';

const users = {
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
};

export default users;
