import type { ClockifyDay, FirestoreTimestampLike } from '@/types/clockify';

export type ClockifyDaySummary = {
  date: string;
  startTime?: string;
  endTime?: string;
  workedMinutes: number;
  pauseMinutes: number;
  totalMinutes: number;
  isComplete: boolean;
  hasErrors: boolean;
};

export type ClockifyMonthSummary = {
  year: string;
  month: string;
  days: ClockifyDaySummary[];
  totalWorkedMinutes: number;
  totalPauseMinutes: number;
  totalHours: number;
};

const timestampToMs = (timestamp?: FirestoreTimestampLike) => {
  if (!timestamp) return null;

  if ('toDate' in timestamp) {
    return timestamp.toDate().getTime();
  }

  return timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1_000_000);
};

const minutesBetween = (startMs: number, endMs: number) => {
  return Math.max(0, Math.floor((endMs - startMs) / 60000));
};

const formatMinutesToHours = (minutes: number) => {
  return Number((minutes / 60).toFixed(2));
};

export const calculateDaySummary = (day: ClockifyDay): ClockifyDaySummary => {
  const records = [...day.records]
    .filter((record) => record.registeredAt)
    .sort((a, b) => {
      const aMs = timestampToMs(a.registeredAt);
      const bMs = timestampToMs(b.registeredAt);

      return (aMs ?? 0) - (bMs ?? 0);
    });

  const startRecord = records.find((record) => record.type === 'start');
  const endRecord = [...records].reverse().find((record) => record.type === 'end');

  const startMs = timestampToMs(startRecord?.registeredAt);
  const endMs = timestampToMs(endRecord?.registeredAt);

  let pauseMinutes = 0;
  let activePauseStartMs: number | null = null;
  let hasErrors = false;

  for (const record of records) {
    const currentMs = timestampToMs(record.registeredAt);

    if (!currentMs) continue;

    if (record.type === 'pause') {
      if (activePauseStartMs !== null) {
        hasErrors = true;
        continue;
      }

      activePauseStartMs = currentMs;
    }

    if (record.type === 'resume') {
      if (activePauseStartMs === null) {
        hasErrors = true;
        continue;
      }

      pauseMinutes += minutesBetween(activePauseStartMs, currentMs);
      activePauseStartMs = null;
    }
  }

  if (activePauseStartMs !== null) {
    hasErrors = true;
  }

  const isComplete = Boolean(startMs && endMs && endMs > startMs);

  if (!isComplete) {
    return {
      date: day.date,
      workedMinutes: 0,
      pauseMinutes,
      totalMinutes: 0,
      isComplete: false,
      hasErrors: true,
    };
  }

  const workedMinutes = minutesBetween(startMs!, endMs!);
  const totalMinutes = Math.max(0, workedMinutes - pauseMinutes);

  return {
    date: day.date,
    workedMinutes,
    pauseMinutes,
    totalMinutes,
    isComplete,
    hasErrors,
  };
};

export const calculateMonthSummary = ({
  days,
  year,
  month,
}: {
  days: ClockifyDay[];
  year: string;
  month: string;
}): ClockifyMonthSummary => {
  const summaries = days.map(calculateDaySummary);

  const totalWorkedMinutes = summaries.reduce((acc, day) => acc + day.totalMinutes, 0);

  const totalPauseMinutes = summaries.reduce((acc, day) => acc + day.pauseMinutes, 0);

  return {
    year,
    month,
    days: summaries,
    totalWorkedMinutes,
    totalPauseMinutes,
    totalHours: formatMinutesToHours(totalWorkedMinutes),
  };
};
