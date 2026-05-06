import { generateAvailableSlots, checkConflicts, getAvailableDays } from '@/lib/agenda';
import { addDays, setHours, setMinutes, format } from 'date-fns';

describe('Agenda Slots Utility', () => {
  it('should generate available days excluding weekends (if applicable)', () => {
    // Supposing Nilceia only attends on weekdays
    const days = getAvailableDays(new Date('2024-01-01'), 30); // Monday
    expect(days.length).toBeGreaterThan(0);
    // Jan 6, 2024 is Saturday, shouldn't be in list
    const hasWeekend = days.some(d => d.getDay() === 0 || d.getDay() === 6);
    expect(hasWeekend).toBe(false);
  });

  it('should generate available time slots between 09:00 and 17:00', () => {
    const slots = generateAvailableSlots(new Date('2024-01-01'));
    expect(slots).toContain('09:00');
    expect(slots).toContain('16:00');
    expect(slots).not.toContain('08:00');
    expect(slots).not.toContain('18:00');
  });

  it('should filter out booked slots', () => {
    const booked = ['10:00', '14:00'];
    const slots = generateAvailableSlots(new Date('2024-01-01'), booked);
    expect(slots).not.toContain('10:00');
    expect(slots).not.toContain('14:00');
    expect(slots).toContain('11:00');
  });

  it('should not allow booking past slots on the current day', () => {
    const today = new Date();
    today.setHours(12, 30, 0, 0); // Mock current time to 12:30

    // Just check behavior based on the mocked current time logic or we mock Date
    jest.useFakeTimers().setSystemTime(today);

    const slots = generateAvailableSlots(today);
    // Should not contain slots before 13:00
    expect(slots).not.toContain('09:00');
    expect(slots).not.toContain('12:00');
    expect(slots).toContain('13:00');

    jest.useRealTimers();
  });
});
