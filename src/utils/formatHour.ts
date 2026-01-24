import { Timestamp } from 'firebase/firestore';

type DateLike = Date | Timestamp | string;

export const formatHour = (value: DateLike): string => {
  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (value instanceof Timestamp) {
    date = value.toDate();
  } else {
    throw new Error('Invalid date value passed to formatHour');
  }

  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');

  return `${h}:${m}`;
};
