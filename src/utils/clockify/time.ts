export const formatMinutesToReadableHours = (minutes: number) => {
  if (!minutes || minutes <= 0) {
    return '0 minutos';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hoursLabel = hours === 1 ? 'hora' : 'horas';

  const minutesLabel = remainingMinutes === 1 ? 'minuto' : 'minutos';

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} ${hoursLabel} ${remainingMinutes} ${minutesLabel}`;
  }

  if (hours > 0) {
    return `${hours} ${hoursLabel}`;
  }

  return `${remainingMinutes} ${minutesLabel}`;
};
