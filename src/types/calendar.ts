import { Timestamp } from 'firebase/firestore';

export interface CalendarEvent {
  id?: string;
  agent: string;
  allDay: boolean;
  description: string;
  end: Timestamp;
  start: Timestamp;
  title: string;
  venue: string;
  hour?: string;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
  message?: string;
  status?: string;
  paid?: boolean;
  stripeSessionId?: string | null;
  createdAt?: Timestamp;
}

export interface CalendarEventUI extends Omit<CalendarEvent, 'start' | 'end'> {
  start: string;
  end: string;
}

export interface CalendarEvents {
  events: CalendarEventUI[];
}

export interface Calendar {
  [userUid: string]: {
    events: CalendarEvents;
  };
}
