export const formatLongDate = (dateString: string, locale: string = 'es-ES') => {
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
