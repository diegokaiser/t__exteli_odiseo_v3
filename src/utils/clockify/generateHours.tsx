import { constants } from '@/lib/constants/constants';
import { db } from '@/lib/firebase';
import { HoursYearDoc } from '@/types/clockify';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type MonthHours = Record<string, { totalHours: number }>;

function getDaysInMonthUTC(year: number, monthIndex0: number) {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
}

function getHoursForWeekday(utcDay: number) {
  if (utcDay >= 1 && utcDay <= 5) return 7;
  if (utcDay === 6) return 5;
  return 0;
}

function buildYearMonths(year: number): HoursYearDoc['months'] {
  const { MONTHS_ES } = constants;
  const months = {} as HoursYearDoc['months'];

  for (let m = 0; m < 12; m++) {
    const days = getDaysInMonthUTC(year, m);
    let total = 0;

    for (let d = 1; d <= days; d++) {
      const utcDay = new Date(Date.UTC(year, m, d)).getUTCDay();
      total += getHoursForWeekday(utcDay);
    }

    months[MONTHS_ES[m]] = { totalHours: total };
  }

  return months;
}

export const generateHours = async () => {
  const year = new Date().getFullYear();
  const yearId = String(year);

  const yearRef = doc(db, 'settings', 'clockify', 'hours', yearId);
  const snap = await getDoc(yearRef);

  if (snap.exists()) return;

  const data: HoursYearDoc = {
    year,
    months: buildYearMonths(year),
  };

  await setDoc(yearRef, data);

  console.log(`✅ Horas generadas para el año: ${year}`);
};
