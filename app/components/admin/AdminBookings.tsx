"use client";

import { useState } from "react";
import type { Tab, AdminBooking } from "./types";
import { useAdminBookings } from "./useAdminBookings";
import BookingCard from "./BookingCard";

const TABS: { key: Tab; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Pending" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

/** Group bookings by "Month Year" for section headers. */
function groupByMonth(bookings: AdminBooking[]) {
  const groups: { label: string; bookings: AdminBooking[] }[] = [];
  let current = "";

  for (const b of bookings) {
    const d = new Date(b.checkIn + "T00:00:00");
    const label = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (label !== current) {
      current = label;
      groups.push({ label, bookings: [] });
    }
    groups[groups.length - 1].bookings.push(b);
  }

  return groups;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white shadow-sm px-6 py-4 flex items-start gap-6 animate-pulse"
        >
          <div className="w-14 space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-8 mx-auto" />
            <div className="h-7 bg-gray-200 rounded w-10 mx-auto" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-56" />
          </div>
          <div className="h-7 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

export default function AdminBookings() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const { data, isLoading, isError, refetch } = useAdminBookings(tab);

  const bookings = data?.bookings ?? [];
  const groups = groupByMonth(bookings);

  return (
    <div>
      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer relative ${
              tab === t.key
                ? "text-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {isLoading && <LoadingSkeleton />}

      {/* ── Error ── */}
      {isError && (
        <div className="bg-white shadow-sm p-8 text-center">
          <p className="text-gray-600">Failed to load bookings.</p>
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
      {!isLoading && !isError && bookings.length === 0 && (
        <div className="bg-white shadow-sm p-8 text-center">
          <p className="text-gray-500">No {tab} bookings.</p>
        </div>
      )}

      {/* ── Booking list grouped by month ── */}
      {!isLoading &&
        !isError &&
        groups.map((group) => (
          <div key={group.label} className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-500 mb-3">
              {group.label}
            </h3>
            <div className="space-y-2">
              {group.bookings.map((b) => (
                <BookingCard key={b.id} booking={b} tab={tab} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
