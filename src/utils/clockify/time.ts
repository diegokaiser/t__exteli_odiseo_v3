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

export const getDailyBalanceMinutes = (date: string, totalMinutes: number) => {
  const day = new Date(`${date}T00:00:00`).getDay();

  const isSaturday = day === 6;
  const expectedMinutes = isSaturday ? 4 * 60 : 8 * 60;

  return totalMinutes - expectedMinutes;
};

export const formatSignedMinutes = (minutes: number) => {
  const sign = minutes >= 0 ? '+' : '-';
  const absoluteMinutes = Math.abs(minutes);

  return `${sign}${formatMinutesToReadableHours(absoluteMinutes)}`;
};
