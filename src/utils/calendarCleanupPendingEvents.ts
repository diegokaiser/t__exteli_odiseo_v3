import { db } from '@/lib/firebase';
import { collectionGroup, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';

export const calendarCleanupPendingEvents = async () => {
  const limitDate = Timestamp.fromMillis(Date.now() - 15 * 60 * 1000);

  const q = query(
    collectionGroup(db, 'events'),
    where('status', '==', 'pending'),
    where('createdAt', '<', limitDate)
  );

  const snapshot = await getDocs(q);

  const promises: Promise<any>[] = [];

  snapshot.forEach((docSnap) => {
    promises.push(
      updateDoc(docSnap.ref, {
        status: 'expired',
        paid: false,
      })
    );
  });

  await Promise.all(promises);
};
