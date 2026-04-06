"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { SearchParams } from "./types";
import { useRoomSearch } from "./useRoomSearch";
import RoomCard from "./RoomCard";

interface RoomResultsPageProps {
  searchParams: SearchParams;
}

/* ────────────────────────────────────────────
   Tiny helpers
   ──────────────────────────────────────────── */

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function diffDays(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/* ────────────────────────────────────────────
   Inline stepper:   − [value] +
   ──────────────────────────────────────────── */

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold text-gray-800 tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────
   Loading skeleton
   ──────────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white shadow-sm overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-40" />
              <div className="h-5 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-56" />
            <div className="space-y-2">
              <div className="h-3.5 bg-gray-200 rounded w-full" />
              <div className="h-3.5 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────── */

export default function RoomResultsPage({
  searchParams: initial,
}: RoomResultsPageProps) {
  const [checkIn, setCheckIn] = useState(initial.checkIn);
  const [checkOut, setCheckOut] = useState(initial.checkOut);
  const [adults, setAdults] = useState(initial.adults);
  const [children, setChildren] = useState(initial.children);
  const [rooms, setRooms] = useState(initial.rooms);

  const nights = diffDays(checkIn, checkOut);
  const today = todayISO();

  const currentParams: SearchParams = {
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
  };

  // Keep URL in sync without triggering server re-render
  useEffect(() => {
    const qs = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
    });
    window.history.replaceState(null, "", `/rooms?${qs.toString()}`);
  }, [checkIn, checkOut, adults, children, rooms]);

  const { data, isLoading, isError, refetch } = useRoomSearch(currentParams);

  /* ── Date change handlers ── */

  const handleCheckInChange = useCallback(
    (newCheckIn: string) => {
      if (!newCheckIn) return;
      setCheckIn(newCheckIn);
      // ensure at least 1 night
      if (newCheckIn >= checkOut) {
        setCheckOut(addDays(newCheckIn, 1));
      }
    },
    [checkOut],
  );

  const handleCheckOutChange = useCallback(
    (newCheckOut: string) => {
      if (!newCheckOut) return;
      setCheckOut(newCheckOut);
      if (newCheckOut <= checkIn) {
        setCheckIn(addDays(newCheckOut, -1));
      }
    },
    [checkIn],
  );

  const handleNightsChange = useCallback(
    (n: number) => {
      if (n < 1) return;
      setCheckOut(addDays(checkIn, n));
    },
    [checkIn],
  );

  return (
    <div>
      {/* ── Back link ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
      >
        <svg
          className="w-4 h-4"
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
        Back to search
      </Link>

      {/* ── Editable search bar ── */}
      <div className="bg-white shadow-sm p-4 sm:p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-4">
          {/* Arrive */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Arrive
            </label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full text-sm font-medium text-gray-800 tabular-nums border border-gray-200 px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow"
            />
          </div>

          {/* Leave */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Leave
            </label>
            <input
              type="date"
              value={checkOut}
              min={addDays(checkIn, 1)}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              className="w-full text-sm font-medium text-gray-800 tabular-nums border border-gray-200 px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-shadow"
            />
          </div>

          {/* Nights */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Nights
            </label>
            <div className="flex items-center h-9.5">
              <Stepper
                value={nights}
                min={1}
                max={30}
                onChange={handleNightsChange}
              />
            </div>
          </div>

          {/* Adults */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Adults
            </label>
            <div className="flex items-center h-[38px]">
              <Stepper
                value={adults}
                min={1}
                max={10}
                onChange={setAdults}
              />
            </div>
          </div>

          {/* Children */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Children
            </label>
            <div className="flex items-center h-[38px]">
              <Stepper
                value={children}
                min={0}
                max={6}
                onChange={setChildren}
              />
            </div>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Rooms
            </label>
            <div className="flex items-center h-[38px]">
              <Stepper value={rooms} min={1} max={5} onChange={setRooms} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Searching available rooms...
          </h2>
          <LoadingSkeleton />
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className="bg-white shadow-sm p-8 text-center">
          <p className="text-gray-600">
            Something went wrong while searching for rooms.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Empty ── */}
      {!isLoading && !isError && data && data.rooms.length === 0 && (
        <div className="bg-white shadow-sm p-8 text-center">
          <p className="text-gray-600 font-medium">No rooms available</p>
          <p className="mt-1 text-sm text-gray-400">
            Try different dates or adjust the number of guests.
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {!isLoading && !isError && data && data.rooms.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {data.rooms.length} room{data.rooms.length !== 1 ? "s" : ""}{" "}
            available
          </h2>
          <div className="space-y-4">
            {data.rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
