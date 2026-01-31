import { db } from '@/lib/firebase';
import { User } from '@/types/users';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';

const DEFAULT_PASSWORD = '3MiJ6R2glGF2Ql';

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
      const q = query(usersRef, orderBy('firstName', 'asc'));
      const snapshot = await getDocs(q);

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
  /*
  PostUser: async (user: Omit<User, 'createdAt'>) => {
    try {
      const userRef = doc(db, 'users-test', user.uid);
      const createdAt = new Date();

      await setDoc(userRef, {
        ...user,
        createdAt,
        updatedAt: createdAt,
      });

      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      const userId = docSnap.id;

      const appwriteUserPayload = {
        userId: userId,
        email: data.email,
        password: DEFAULT_PASSWORD,
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        labels: [data.role, data.gender],
      };

      await sdk.users.create(
        appwriteUserPayload.userId,
        appwriteUserPayload.email,
        appwriteUserPayload.password,
        appwriteUserPayload.name
      );

      await sdk.users.updatePhone(userId, appwriteUserPayload.phone);
      await sdk.users.updateLabels(userId, { labels: appwriteUserPayload.labels });
    } catch (err) {
      console.error(`PostUser error: ${err}`);
      throw err;
    }
  },
  */
  PatchUser: async (uid: string, updates: Partial<Omit<User, 'createdAt'>>) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates);
    } catch (err) {
      console.error(`PatchUser error: ${err}`);
      throw err;
    }
  },
};

export default users;
