import { db } from '@/lib/firebase';
import { CalendarEvent, CalendarEventUI } from '@/types/calendar';
import { calendarCheckSlotAvailability } from '@/utils/calendarCheckSlotAvailability';
import { calendarDayFormat } from '@/utils/calendarDayFormat';
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
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

      const eventRef = collectionGroup(db, 'events');

      const q = query(eventRef, where('status', 'in', ['pending', 'confirmed']));

      const snapshot = await getDocs(q);

      const takenHours: any[] = [];
      snapshot.forEach((doc) => {
        const { start, end } = doc.data() as CalendarEvent;

        if (!start || !end) return;

        const eventStart = start.toDate();
        const eventEnd = end.toDate();

        if (
          eventStart.getFullYear() === year &&
          eventStart.getMonth() === month - 1 &&
          eventStart.getDate() === day
        ) {
          let current = new Date(eventStart);
          while (current < eventEnd) {
            takenHours.push(current.getHours() * 60 + current.getMinutes());
            current.setMinutes(current.getMinutes() + 30);
          }
        }
      });
      const availableHours: string[] = [];
      for (let hour = 10; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const total = hour * 60 + minute;
          if (!takenHours.includes(total)) {
            availableHours.push(
              `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            );
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
      const q = query(
        eventRef,
        where('start', '>=', startOfDay),
        where('start', '<=', endOfDay),
        where('status', '==', 'confirmed')
      );

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

      const start =
        event.start instanceof Timestamp ? event.start : Timestamp.fromDate(event.start);

      const end = event.end instanceof Timestamp ? event.end : Timestamp.fromDate(event.end);

      const isAvailable = await calendarCheckSlotAvailability(start, end);

      if (!isAvailable) {
        throw new Error('No hay cupo disponible');
      }

      const newEvent: CalendarEvent = {
        ...event,
        allDay: false,
        start,
        end,
      };

      const docRef = await addDoc(eventRef, newEvent);
      return docRef.id;
    } catch (err) {
      console.error(`PostEvent (${userUid}) error: ${err}`);
      throw err;
    }
  },
  UpdateEvent: async () => {},
  ConfirmEventStripe: async (uid: string) => {
    try {
      const eventDocRef = collection(db, 'calendar', 'np6Q466WIEW2ngYpPBbz7VxJHNY2', 'events');
      const q = query(eventDocRef, where('stripeSessionId', '==', uid));
      const snapshot = await getDocs(q);
      await updateDoc(snapshot.docs[0].ref, {
        paid: true,
        status: 'confirmed',
      });
    } catch (err) {
      console.error(`ConfirmEventStripe (${uid}) error: ${err}`);
      throw err;
    }
  },
  CancelEventStripe: async (uid: string) => {
    try {
      const eventDocRef = collection(db, 'calendar', 'np6Q466WIEW2ngYpPBbz7VxJHNY2', 'events');
      const q = query(eventDocRef, where('stripeSessionId', '==', uid));
      const snapshot = await getDocs(q);
      await updateDoc(snapshot.docs[0].ref, {
        paid: false,
        status: 'cancelled',
      });
    } catch (err) {
      console.error(`CancelEventStripe (${uid}) error: ${err}`);
      throw err;
    }
  },
  FailedEventStripe: async (uid: string) => {
    try {
      const eventDocRef = collection(db, 'calendar', 'np6Q466WIEW2ngYpPBbz7VxJHNY2', 'events');
      const q = query(eventDocRef, where('stripeSessionId', '==', uid));
      const snapshot = await getDocs(q);
      await updateDoc(snapshot.docs[0].ref, {
        paid: false,
        status: 'failed',
      });
    } catch (err) {
      console.error(`FailedEventStripe (${uid}) error: ${err}`);
      throw err;
    }
  },
  DeleteEvent: async () => {},
};

export default calendar;
