import { db } from '@/lib/firebase';
import { collectionGroup, getDocs, query, Timestamp, where } from 'firebase/firestore';

export async function calendarCheckSlotAvailability(
  start: Timestamp,
  end: Timestamp
): Promise<boolean> {
  const q = query(
    collectionGroup(db, 'events'),
    where('status', 'in', ['pending', 'confirmed']),
    where('start', '<', end),
    where('end', '>', start)
  );

  const snap = await getDocs(q);

  return snap.empty;
}
