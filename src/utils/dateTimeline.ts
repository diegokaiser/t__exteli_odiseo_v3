import { Timestamp } from 'firebase/firestore';

export const dateTimeline = (timestamp: Timestamp | { seconds: number; nanoseconds: number }) => {
  if (!timestamp) return '';

  let date: Date;

  if (typeof (timestamp as Timestamp).toDate === 'function') {
    date = (timestamp as Timestamp).toDate();
  } else {
    const { seconds, nanoseconds } = timestamp as { seconds: number; nanoseconds: number };
    date = new Date(seconds * 1000 + nanoseconds / 1e6);
  }

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
