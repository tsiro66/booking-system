"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange, GuestRoomValues } from "./types";
import { formatShortDate, getNightCount } from "./calendar-utils";
import { COLOR_THEMES, type ThemeKey } from "./color-themes";
import Calendar from "./Calendar";
import GuestRoomSelector from "./GuestRoomSelector";
import ColorSelector from "./ColorSelector";

export default function SearchWidget() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  });

  const [themeKey, setThemeKey] = useState<ThemeKey>("zinc");
  const theme = COLOR_THEMES[themeKey];

  const [guests, setGuests] = useState<GuestRoomValues>({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  /**
   * Date selection state machine:
   * 1. Nothing selected → set check-in
   * 2. Check-in set, no check-out → if date > check-in: set check-out. Else: reset check-in
   * 3. Both set → reset to new check-in, clear check-out
   */
  function handleDateSelect(date: Date) {
    setDateRange((prev) => {
      // State 3: Both already set → start over
      if (prev.checkIn && prev.checkOut) {
        return { checkIn: date, checkOut: null };
      }

      // State 1: Nothing selected
      if (!prev.checkIn) {
        return { checkIn: date, checkOut: null };
      }

      // State 2: Check-in set, no check-out
      if (date.getTime() > prev.checkIn.getTime()) {
        return { checkIn: prev.checkIn, checkOut: date };
      }

      // Clicked same day or earlier → reset check-in
      return { checkIn: date, checkOut: null };
    });
  }

  function handleSearch() {
    if (!dateRange.checkIn || !dateRange.checkOut) return;
    const params = new URLSearchParams({
      checkIn: dateRange.checkIn.toISOString().split("T")[0],
      checkOut: dateRange.checkOut.toISOString().split("T")[0],
      adults: String(guests.adults),
      children: String(guests.children),
      rooms: String(guests.rooms),
    });
    router.push(`/rooms?${params.toString()}`);
  }

  const canSearch = dateRange.checkIn !== null && dateRange.checkOut !== null;

  // Build summary line
  let summary = "";
  if (dateRange.checkIn) {
    const checkInStr = formatShortDate(dateRange.checkIn);
    if (dateRange.checkOut) {
      const checkOutStr = formatShortDate(dateRange.checkOut);
      const nights = getNightCount(dateRange.checkIn, dateRange.checkOut);
      summary = `${checkInStr} – ${checkOutStr}, ${nights} night${nights !== 1 ? "s" : ""}`;
    } else {
      summary = `${checkInStr} – select check-out`;
    }
    summary += ` · ${guests.adults} adult${guests.adults !== 1 ? "s" : ""}`;
    if (guests.children > 0) {
      summary += ` · ${guests.children} child${guests.children !== 1 ? "ren" : ""}`;
    }
    summary += ` · ${guests.rooms} room${guests.rooms !== 1 ? "s" : ""}`;
  }

  return (
    <div>
      <ColorSelector selected={themeKey} onChange={setThemeKey} />

      <div className="bg-white shadow-lg shadow-black/10 p-6 sm:p-8 w-full max-w-3xl">
        {/* Calendar */}
        <Calendar
          selectedRange={dateRange}
          onDateSelect={handleDateSelect}
          theme={theme}
        />

      {/* Divider */}
      <div className="border-t border-gray-100 my-6" />

      {/* Guest & room selector */}
      <GuestRoomSelector values={guests} onChange={setGuests} />

      {/* Summary */}
      {summary && (
        <p className="mt-6 text-sm text-gray-500 text-center">{summary}</p>
      )}

      {/* Search button */}
      <button
        type="button"
        onClick={handleSearch}
        disabled={!canSearch}
        className={`mt-6 w-full py-3.5 sm:py-3 ${theme.button} text-white font-semibold text-sm ${theme.buttonHover} ${theme.buttonActive} disabled:opacity-40
        disabled:cursor-not-allowed transition-colors cursor-pointer`}
      >
        Search Availability
      </button>
      </div>
    </div>
  );
}
