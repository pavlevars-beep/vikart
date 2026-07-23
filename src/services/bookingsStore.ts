import type { Booking, BookingStatus } from '@/types';
import { storageKeys } from '@/utils/storage';
import { createStore } from './store';
import { makeActivity, makeNote } from './activityLog';

const store = createStore<Booking>(storageKeys.bookingsDb, []);

export function listBookings(): Booking[] {
  return store.list().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBookingById(id: string): Booking | undefined {
  return store.getById(id);
}

let sequence = 0;
export function nextReferenceCode(): string {
  sequence += 1;
  const year = new Date().getFullYear();
  const rand = Math.round(Math.random() * 900 + 100);
  return `VA-${year}-${(sequence + rand).toString().padStart(4, '0')}`;
}

export function saveBooking(booking: Booking): Booking {
  return store.upsert(booking);
}

export function updateBookingStatus(id: string, status: BookingStatus, description?: string): Booking | undefined {
  const booking = store.getById(id);
  if (!booking) return undefined;
  const next: Booking = {
    ...booking,
    status,
    activity: [...booking.activity, makeActivity('status_change', description ?? `Status promenjen u „${status}".`)],
  };
  return store.upsert(next);
}

export function addBookingNote(id: string, text: string): Booking | undefined {
  const booking = store.getById(id);
  if (!booking) return undefined;
  const next: Booking = { ...booking, notes: [...booking.notes, makeNote(text)] };
  return store.upsert(next);
}
