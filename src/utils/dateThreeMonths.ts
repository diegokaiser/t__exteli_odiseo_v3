export const hasThreeMonths = (enterDate?: string): boolean => {
  if (!enterDate) return false;

  const date = new Date(enterDate);
  if (isNaN(date.getTime())) return false;

  const datePlus90 = new Date(date);
  datePlus90.setDate(datePlus90.getDate() + 90);

  const today = new Date();

  return datePlus90 <= today;
};

export const format90DaysStatus = (enterDate?: string): 'Sí' | 'No' => {
  return hasThreeMonths(enterDate) ? 'Sí' : 'No';
};

export const daysSince = (enterDate?: string): number => {
  if (!enterDate) return 0;

  const diff = new Date().getTime() - new Date(enterDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
