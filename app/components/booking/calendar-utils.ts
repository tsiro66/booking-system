import type { CalendarDay } from "./types";

/**
 * Returns a Date set to midnight local time for reliable day-level comparisons.
 */
function midnight(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Generates a fixed 42-cell (6×7) calendar grid for the given month.
 * Leading/trailing cells are filled with days from adjacent months.
 */
export function generateCalendarGrid(
  year: number,
  month: number,
): CalendarDay[] {
  const today = midnight(new Date());
  const firstOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid: CalendarDay[] = [];

  // Leading days from previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    grid.push({
      date: midnight(date),
      isCurrentMonth: false,
      isPast: midnight(date) < today,
      isToday: false,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const m = midnight(date);
    grid.push({
      date: m,
      isCurrentMonth: true,
      isPast: m < today,
      isToday: m.getTime() === today.getTime(),
    });
  }

  // Trailing days from next month
  const remaining = 42 - grid.length;
  for (let day = 1; day <= remaining; day++) {
    const date = new Date(year, month + 1, day);
    grid.push({
      date: midnight(date),
      isCurrentMonth: false,
      isPast: false,
      isToday: false,
    });
  }

  return grid;
}

/**
 * Returns true if two dates represent the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Returns true if `date` falls strictly between `checkIn` and `checkOut`.
 */
export function isInRange(
  date: Date,
  checkIn: Date | null,
  checkOut: Date | null,
): boolean {
  if (!checkIn || !checkOut) return false;
  const t = date.getTime();
  return t > checkIn.getTime() && t < checkOut.getTime();
}

/**
 * Formats a year/month pair as e.g. "May 2026".
 */
export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Formats a date as e.g. "May 12".
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Returns the number of nights between check-in and check-out.
 */
export function getNightCount(checkIn: Date, checkOut: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round(
    (checkOut.getTime() - checkIn.getTime()) / msPerDay,
  );
}
