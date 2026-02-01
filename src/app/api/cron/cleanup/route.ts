import { calendarCleanupPendingEvents } from '@/utils/calendarCleanupPendingEvents';
import { NextResponse } from 'next/server';

export const GET = async () => {
  await calendarCleanupPendingEvents();
  return NextResponse.json({ ok: true });
};
