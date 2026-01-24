import { db } from '@/lib/firebase';
import { Notification, NotificationDB } from '@/types/notification';
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

const collectionPath = 'settings/clockify/notifications';

const notifications = {
  GetNotification: (uid: string, callback: (data: Notification | null) => void) => {
    const ref = doc(db, collectionPath, uid);
    return onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as Notification);
      } else {
        callback(null);
      }
    });
  },
  GetNotifications: (callback: (data: { id: string; data: Notification }[]) => void) => {
    const ref = collection(db, collectionPath);
    return onSnapshot(ref, (querySnap) => {
      const notifications = querySnap.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as Notification,
      }));
      callback(notifications);
    });
  },
  PatchNotification: async (uid: string, data: Partial<NotificationDB>) => {
    const ref = doc(db, collectionPath, uid);
    return updateDoc(ref, data);
  },
  PostNotification: async (uid: string, data: NotificationDB) => {
    const ref = doc(db, collectionPath, uid);
    return setDoc(ref, data);
  },
  DeleteNotification: async (uid: string) => {
    const ref = doc(db, collectionPath, uid);
    return deleteDoc(ref);
  },
};

export default notifications;
