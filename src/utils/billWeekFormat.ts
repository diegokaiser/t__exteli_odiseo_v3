export function formatDateDDMMYYYY(date: Date | string | null | undefined): string | null {
  if (!date) return null;

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
}
