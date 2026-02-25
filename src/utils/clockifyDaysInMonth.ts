export const clockifyDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];

  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();
  const padStart = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < padStart; i++) {
    days.push({
      dayOfWeek: '',
      dayNumber: '',
      isWeekend: false,
      isEmpty: true,
      isToday: false,
      date: new Date(date),
    });
  }

  while (date.getMonth() === month) {
    const dayOfWeek = date.toLocaleString('es-ES', { weekday: 'long' });
    const dayNumber = date.getDate();

    //const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isWeekend = date.getDay() === 0;
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    days.push({
      dayOfWeek,
      dayNumber,
      isWeekend,
      isEmpty: false,
      isToday,
      date: new Date(date),
    });

    date.setDate(dayNumber + 1);
  }
  return days;
};
