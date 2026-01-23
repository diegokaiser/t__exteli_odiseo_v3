import { Timestamp } from 'firebase/firestore';

export function calendarDayFormat(timestamp: Timestamp | null | undefined): string | null {
  if (
    !timestamp ||
    typeof timestamp.seconds !== 'number' ||
    typeof timestamp.nanoseconds !== 'number'
  ) {
    return null;
  }

  const date = new Date(timestamp.seconds * 1000);
  const formattedDate = new Date(date.getTime() + timestamp.nanoseconds / 1e6 + 60 * 60 * 1000);

  return formattedDate.toISOString();
}
