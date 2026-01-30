import { db } from '@/lib/firebase';
import { CalendarEvent, CalendarEventUI } from '@/types/calendar';
import { calendarDayFormat } from '@/utils/calendarDayFormat';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';

const calendar = {
  GetEvent: async (uid: string): Promise<CalendarEvent | null> => {
    try {
      const eventDocRef = doc(db, 'calendar', uid);
      const eventDoc = await getDoc(eventDocRef);
      if (!eventDoc.exists()) return null;
      return eventDoc.data() as CalendarEvent;
    } catch (err) {
      console.error(`GetEvent error: ${err}`);
      throw err;
    }
  },
  GetTodayHours: async (date: string) => {
    try {
      const [year, month, day] = date.split('-').map(Number);

      const eventRef = collection(db, 'calendar');
      const querySnapshot = await getDocs(eventRef);

      const takenHours: any[] = [];
      querySnapshot.forEach((doc) => {
        const eventData = doc.data() as CalendarEvent;
        const { start, end } = eventData;
        const eventStart = new Date(start.seconds * 1000);
        const eventEnd = new Date(end.seconds * 1000);

        if (
          eventStart.getFullYear() === year &&
          eventStart.getMonth() === month - 1 &&
          eventStart.getDate() === day
        ) {
          let current = new Date(eventStart);
          while (current < eventEnd) {
            takenHours.push(current.getHours() * 60 + current.getMinutes());
            current.setHours(current.getHours() + 10);
          }
        }
      });
      const availableHours = [];
      for (let hour = 10; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const totalMinutes = hour * 60 + minute;
          if (!takenHours.includes(totalMinutes)) {
            const formattedHour = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            availableHours.push(formattedHour);
          }
        }
      }
      return availableHours;
    } catch (err) {
      console.error(`GetTodayHours (${date}) error: ${err}`);
      throw err;
    }
  },
  GetEvents: async (uid: string): Promise<CalendarEventUI[]> => {
    try {
      const eventRef = collection(db, 'calendar', uid, 'events');
      const querySnapshot = await getDocs(eventRef);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data() as CalendarEvent;

        return {
          id: doc.id,
          ...data,
          start: calendarDayFormat(data.start)!,
          end: calendarDayFormat(data.end)!,
        };
      });
    } catch (err) {
      console.error(`GetEvents (${uid}) error: ${err}`);
      throw err;
    }
  },
  GetEventsToday: async (uid: string): Promise<CalendarEventUI[]> => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      const eventRef = collection(db, 'calendar', uid, 'events');
      const q = query(eventRef, where('start', '>=', startOfDay), where('start', '<=', endOfDay));

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data() as CalendarEvent;

        return {
          id: doc.id,
          ...data,
          start: calendarDayFormat(data.start)!,
          end: calendarDayFormat(data.end)!,
        };
      });
    } catch (err) {
      console.error(`GetEvents (${uid}) error: ${err}`);
      throw err;
    }
  },
  PostEvent: async ({
    userUid,
    event,
  }: {
    userUid: string;
    event: Omit<CalendarEvent, 'id' | 'hour'>;
  }): Promise<string> => {
    try {
      const eventRef = collection(db, 'calendar', userUid, 'events');

      const newEvent: CalendarEvent = {
        ...event,
        allDay: false,
        start: event.start instanceof Timestamp ? event.start : Timestamp.fromDate(event.start),
        end: event.end instanceof Timestamp ? event.end : Timestamp.fromDate(event.end),
      };

      const docRef = await addDoc(eventRef, newEvent);
      return docRef.id;
    } catch (err) {
      console.error(`PostEvent (${userUid}) error: ${err}`);
      throw err;
    }
  },
  UpdateEvent: async () => {},
  DeleteEvent: async () => {},
};

export default calendar;
