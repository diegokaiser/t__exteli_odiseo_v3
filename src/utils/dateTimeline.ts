import { Timestamp } from 'firebase/firestore';

export const dateTimeline = (timestamp: Timestamp) => {
  if (!timestamp) return '';

  const date = timestamp.toDate();

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
