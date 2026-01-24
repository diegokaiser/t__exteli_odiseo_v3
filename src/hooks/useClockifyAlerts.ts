import { db } from '@/lib/firebase';
import { NotificationDB } from '@/types/notification';
import { formatHour } from '@/utils/formatHour';
import { collection, onSnapshot } from 'firebase/firestore';
import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';

const COLLECTION_PATH = 'settings/clockify/notifications';

export const useClockifyAlerts = (toastRef: React.RefObject<Toast | null>) => {
  const shownToday = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTION_PATH), (snapshot) => {
      const now = new Date();
      const nowDay = now.getDate();
      const nowHour = now.getHours().toString().padStart(2, '0');
      const nowMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${nowHour}:${nowMinutes}`;

      snapshot.forEach((doc) => {
        const data = doc.data() as NotificationDB;

        if (!data.enabled) return;

        const notifHour = formatHour(data.hour);
        const isToday = data.days.includes(nowDay) || data.days.includes(7);
        const hasBeenShown = shownToday.current.has(doc.id);

        if (isToday && notifHour === currentTime && !hasBeenShown) {
          shownToday.current.add(doc.id);

          toastRef.current?.show({
            severity: 'info',
            summary: data.title,
            detail: `Es hora de: ${data.title}`,
            life: 5000,
          });
        }
      });
    });

    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        shownToday.current.clear();
      }
    }, 60000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [toastRef]);
};
