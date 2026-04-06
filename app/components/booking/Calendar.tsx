"use client";

import { useState } from "react";
import type { CalendarProps, CalendarDay } from "./types";
import type { ColorTheme } from "./color-themes";
import {
  generateCalendarGrid,
  isSameDay,
  isInRange,
  formatMonthYear,
} from "./calendar-utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function MonthPanel({
  year,
  month,
  selectedRange,
  onDateSelect,
  theme,
}: {
  year: number;
  month: number;
  selectedRange: CalendarProps["selectedRange"];
  onDateSelect: CalendarProps["onDateSelect"];
  theme: ColorTheme;
}) {
  const grid = generateCalendarGrid(year, month);
  const { checkIn, checkOut } = selectedRange;

  function getDayClasses(day: CalendarDay): string {
    const base = "h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm flex items-center justify-center transition-colors";

    // Non-current-month days: invisible but preserve grid
    if (!day.isCurrentMonth) {
      return `${base} text-gray-300 cursor-default pointer-events-none`;
    }

    // Past days
    if (day.isPast) {
      return `${base} text-gray-300 cursor-not-allowed`;
    }

    // Check-in date
    if (checkIn && isSameDay(day.date, checkIn)) {
      return `${base} ${theme.selectedDate} rounded-full font-semibold`;
    }

    // Check-out date
    if (checkOut && isSameDay(day.date, checkOut)) {
      return `${base} ${theme.selectedDate} rounded-full font-semibold`;
    }

    // In range between check-in and check-out
    if (isInRange(day.date, checkIn, checkOut)) {
      return `${base} ${theme.range} rounded-full`;
    }

    // Today
    if (day.isToday) {
      return `${base} font-bold ring-1 ${theme.todayRing} rounded-full hover:bg-gray-100`;
    }

    // Normal selectable day
    return `${base} text-gray-700 hover:bg-gray-100 rounded-full`;
  }

  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-center text-sm font-semibold text-gray-800 mb-3">
        {formatMonthYear(year, month)}
      </h3>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="h-7 sm:h-8 flex items-center justify-center text-[11px] sm:text-xs font-medium text-gray-400"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {grid.map((day, i) => {
          const disabled = !day.isCurrentMonth || day.isPast;
          return (
            <div key={i} className="flex items-center justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onDateSelect(day.date)}
                className={getDayClasses(day)}
                aria-label={
                  day.isCurrentMonth
                    ? day.date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : undefined
                }
              >
                {day.isCurrentMonth ? day.date.getDate() : ""}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar({ selectedRange, onDateSelect, theme }: CalendarProps) {
  const now = new Date();
  const [leftYear, setLeftYear] = useState(now.getFullYear());
  const [leftMonth, setLeftMonth] = useState(now.getMonth());

  const isAtCurrentMonth =
    leftYear === now.getFullYear() && leftMonth === now.getMonth();

  // Right panel is always the next month
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  function goBack() {
    if (isAtCurrentMonth) return;
    if (leftMonth === 0) {
      setLeftYear(leftYear - 1);
      setLeftMonth(11);
    } else {
      setLeftMonth(leftMonth - 1);
    }
  }

  function goForward() {
    if (leftMonth === 11) {
      setLeftYear(leftYear + 1);
      setLeftMonth(0);
    } else {
      setLeftMonth(leftMonth + 1);
    }
  }

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goBack}
          disabled={isAtCurrentMonth}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <div className="text-sm font-medium text-gray-500">
          Select your dates
        </div>

        <button
          type="button"
          onClick={goForward}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      {/* Two month panels */}
      <div className="flex flex-col sm:flex-row gap-6">
        <MonthPanel
          year={leftYear}
          month={leftMonth}
          selectedRange={selectedRange}
          onDateSelect={onDateSelect}
          theme={theme}
        />
        <MonthPanel
          year={rightYear}
          month={rightMonth}
          selectedRange={selectedRange}
          onDateSelect={onDateSelect}
          theme={theme}
        />
      </div>
    </div>
  );
}
