import { FirestoreTimestampLike } from '@/types/clockify';

export const clockifyToSecondsNanos = (ts: FirestoreTimestampLike) => {
  if (typeof (ts as any)?.toDate === 'function') {
    const d = (ts as any).toDate() as Date;
    const seconds = Math.floor(d.getTime() / 1000);
    const nanoseconds = 0;
    return { seconds, nanoseconds };
  }

  return {
    seconds: (ts as any).seconds ?? 0,
    nanoseconds: (ts as any).nanoseconds ?? 0,
  };
};
