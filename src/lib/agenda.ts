import { addDays, format, isBefore, startOfDay } from 'date-fns';

export const BUSINESS_HOURS = {
  start: 9, // 09:00
  end: 17, // 17:00 (last slot at 17:00)
};

/**
 * Returns available days from a start date up to a given number of days.
 * Excludes weekends.
 */
export function getAvailableDays(startDate: Date, daysCount: number = 30): Date[] {
  const days: Date[] = [];
  let currentDay = startDate;

  while (days.length < daysCount) {
    const dayOfWeek = currentDay.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days.push(currentDay);
    }
    currentDay = addDays(currentDay, 1);
  }

  return days;
}

/**
 * Generates time slots for a given date.
 * Excludes slots in the past if the date is today.
 * Excludes booked slots.
 */
export function generateAvailableSlots(date: Date, bookedSlots: string[] = []): string[] {
  const slots: string[] = [];
  const now = new Date();
  const isToday = startOfDay(date).getTime() === startOfDay(now).getTime();

  for (let hour = BUSINESS_HOURS.start; hour <= BUSINESS_HOURS.end; hour++) {
    const slotString = `${hour.toString().padStart(2, '0')}:00`;
    
    // Check if slot is in the past for today
    if (isToday) {
      const currentHour = now.getHours();
      // If current time is 12:30, 13:00 is available, 12:00 is not.
      // So we must check if hour <= currentHour.
      if (hour <= currentHour) {
        continue;
      }
    }

    // Check if slot is already booked
    if (!bookedSlots.includes(slotString)) {
      slots.push(slotString);
    }
  }

  return slots;
}

/**
 * Checks if a requested slot is conflicting with existing bookings.
 */
export function checkConflicts(requestedSlot: string, bookedSlots: string[]): boolean {
  return bookedSlots.includes(requestedSlot);
}
