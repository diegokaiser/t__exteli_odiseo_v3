export const reservasDateTime = (eventDate: string, eventHour: string, eventEnd: string) => {
  if (!eventDate || !eventHour || !eventEnd) return null;

  const date = new Date(eventDate);

  const formattedDate = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `${formattedDate} de ${eventHour} a ${eventEnd}`;
};
