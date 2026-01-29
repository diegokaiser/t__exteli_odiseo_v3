import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';

import { NotificationDB } from '@/types/notification';
import { formatHour } from '@/utils/formatHour';

const COLLECTION_PATH = 'settings/clockify/notifications';
const STORAGE_KEY = 'clockify_alerts_cache';

type CachedAlert = {
  id: string;
  title: string;
  hour: string;
  days: number[];
  enabled: boolean;
};

const parseSnapshot = (docs: { id: string; data: NotificationDB }[]): CachedAlert[] => {
  return docs.map(({ id, data }) => ({
    id,
    title: data.title,
    hour: formatHour(data.hour),
    days: data.days,
    enabled: data.enabled,
  }));
};

const saveToStorage = (data: CachedAlert[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadFromStorage = (): CachedAlert[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const useClockifyAlerts = (toastRef: React.RefObject<Toast | null>) => {
  const alertsRef = useRef<CachedAlert[]>([]);
  const shownToday = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, COLLECTION_PATH), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as NotificationDB,
      }));

      const parsed = parseSnapshot(docs);
      alertsRef.current = parsed;
      saveToStorage(parsed);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const cached = loadFromStorage();
    alertsRef.current = cached;
  }, []);

  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();

      const jsDay = now.getDay();
      const currentDay = jsDay === 0 ? 6 : jsDay - 1;

      const hour = now.getHours().toString().padStart(2, '0');
      const min = now.getMinutes().toString().padStart(2, '0');

      const currentTime = `${hour}:${min}`;

      alertsRef.current.forEach((alert) => {
        if (!alert.enabled) return;

        const isToday = alert.days.includes(currentDay) || alert.days.includes(7);

        const alreadyShown = shownToday.current.has(alert.id);

        if (isToday && alert.hour === currentTime && !alreadyShown) {
          shownToday.current.add(alert.id);

          toastRef.current?.show({
            severity: 'info',
            summary: alert.title,
            detail: `Es hora de: ${alert.title}`,
            life: 5000,
          });
        }
      });
    };

    checkAlerts();

    const interval = setInterval(checkAlerts, 60_000);
    return () => clearInterval(interval);
  }, [toastRef]);

  useEffect(() => {
    const reset = setInterval(() => {
      const now = new Date();

      if (now.getHours() === 0 && now.getMinutes() === 0) {
        shownToday.current.clear();
      }
    }, 60_000);
    return () => clearInterval(reset);
  }, []);
};
