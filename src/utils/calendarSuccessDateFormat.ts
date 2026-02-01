export function calendarSuccessDateFormat(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
