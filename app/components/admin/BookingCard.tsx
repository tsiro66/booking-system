"use client";

import { useState, useRef, useEffect } from "react";
import type { AdminBooking, Tab } from "./types";
import { useUpdateBookingStatus } from "./useAdminBookings";
import EditBookingModal from "./EditBookingModal";

/* ── Helpers ── */

function formatDay(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    day: d.getDate(),
  };
}

function formatRange(checkIn: string, checkOut: string) {
  const a = new Date(checkIn + "T00:00:00");
  const b = new Date(checkOut + "T00:00:00");
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const nights = Math.round(
    (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24),
  );
  return { range: `${fmt(a)} – ${fmt(b)}`, nights };
}

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-600",
};

/* ── Component ── */

interface BookingCardProps {
  booking: AdminBooking;
  tab: Tab;
}

export default function BookingCard({ booking, tab }: BookingCardProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mutation = useUpdateBookingStatus();

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const { weekday, day } = formatDay(booking.checkIn);
  const { range, nights } = formatRange(booking.checkIn, booking.checkOut);

  function handleAction(action: string) {
    setOpen(false);
    if (action === "edit") {
      setEditOpen(true);
    } else if (action === "confirm") {
      mutation.mutate({ id: booking.id, status: "confirmed" });
    } else if (action === "cancel") {
      mutation.mutate({ id: booking.id, status: "cancelled" });
    } else if (action === "reinstate") {
      mutation.mutate({ id: booking.id, status: "confirmed" });
    }
  }

  // Build actions based on current tab / status
  const actions: { key: string; label: string; icon: string; destructive?: boolean }[] = [];
  if (booking.status !== "cancelled") {
    actions.push({ key: "edit", label: "Edit booking", icon: "pencil" });
  }
  if (booking.status === "pending") {
    actions.push({ key: "confirm", label: "Confirm booking", icon: "check" });
  }
  if (booking.status !== "cancelled") {
    actions.push({
      key: "cancel",
      label: "Cancel booking",
      icon: "x",
      destructive: true,
    });
  }
  if (booking.status === "cancelled") {
    actions.push({ key: "reinstate", label: "Reinstate booking", icon: "undo" });
  }

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow px-4 sm:px-6 py-4 flex items-start gap-4 sm:gap-6">
      {/* ── Left: date block ── */}
      <div className="shrink-0 w-14 text-center">
        <p className="text-xs font-medium text-zinc-500 uppercase">
          {weekday}
        </p>
        <p className="text-2xl font-bold text-zinc-900 leading-tight">{day}</p>
      </div>

      {/* ── Middle: details ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-zinc-800">{range}</span>
          <span className="text-xs text-zinc-400">·</span>
          <span className="text-sm text-zinc-500">
            {nights} night{nights !== 1 ? "s" : ""}
          </span>
        </div>

        <p className="mt-1 text-sm font-semibold text-zinc-900 truncate">
          {booking.guestName || "—"}
        </p>

        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-zinc-500">{booking.roomName}</span>
          <span className="text-xs text-zinc-300">·</span>
          <span className="text-xs text-zinc-500">
            {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-zinc-300">·</span>
          <span className="text-xs text-zinc-500">
            ${booking.pricePerNight}/night
          </span>
        </div>

        {/* Status badge — on mobile, show below details */}
        <span
          className={`mt-2 inline-block sm:hidden text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[booking.status] ?? "bg-gray-100 text-gray-600"}`}
        >
          {booking.status}
        </span>
      </div>

      {/* ── Right: badge + actions ── */}
      <div className="shrink-0 flex items-center gap-3">
        {/* Desktop badge */}
        <span
          className={`hidden sm:inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${STATUS_BADGE[booking.status] ?? "bg-gray-100 text-gray-600"}`}
        >
          {booking.status}
        </span>

        {/* Dropdown */}
        {actions.length > 0 && (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                open
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Edit
              <svg
                className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg shadow-black/10 border border-gray-100 py-1.5 z-10">
                {actions.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => handleAction(a.key)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 transition-colors cursor-pointer ${
                      a.destructive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {a.icon === "pencil" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    )}
                    {a.icon === "check" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {a.icon === "x" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {a.icon === "undo" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                      </svg>
                    )}
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Edit modal */}
      {editOpen && (
        <EditBookingModal
          booking={booking}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}
