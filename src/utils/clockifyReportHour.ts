import { Timestamp } from 'firebase/firestore';

export const clockifyReportHour = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();

  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};
