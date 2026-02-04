export const getWeekRange = (date: Date) => {
  const d = new Date(date);

  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);

  d.setHours(0, 0, 0, 0);

  const start = new Date(d);
  const end = new Date(d);
  end.setDate(end.getDate() + 7);

  return { start, end };
};
