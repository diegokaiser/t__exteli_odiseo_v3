export function calendarDateFormat(date: Date | string): string {
  const mn = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const d = new Date(date);
  const month = mn[d.getMonth()];
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');

  return `${day} de ${month} de ${year} a las ${hour}:${minute}`;
}
