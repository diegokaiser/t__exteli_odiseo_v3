export const clockifyRecordHour = (seconds: number) => {
  const date = new Date(seconds * 1000);

  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};
