"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Tab, AdminBooking, RoomOption } from "./types";

/* ── Bookings ── */

async function fetchBookings(
  tab: Tab,
): Promise<{ bookings: AdminBooking[] }> {
  const res = await fetch(`/api/admin/bookings?tab=${tab}`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export function useAdminBookings(tab: Tab) {
  return useQuery({
    queryKey: ["admin-bookings", tab],
    queryFn: () => fetchBookings(tab),
  });
}

/* ── Update status only ── */

async function updateBookingStatus(params: {
  id: string;
  status: string;
}): Promise<unknown> {
  const res = await fetch("/api/admin/bookings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to update booking");
  return res.json();
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
}

/* ── Full edit ── */

export interface BookingEditPayload {
  id: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  guestName?: string;
  roomId?: string;
  status?: string;
}

async function updateBooking(params: BookingEditPayload): Promise<unknown> {
  const res = await fetch("/api/admin/bookings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to update booking");
  return res.json();
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
}

/* ── Room list ── */

async function fetchRooms(): Promise<{ rooms: RoomOption[] }> {
  const res = await fetch("/api/admin/rooms");
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}

export function useRoomList() {
  return useQuery({
    queryKey: ["admin-rooms"],
    queryFn: fetchRooms,
    staleTime: 5 * 60 * 1000, // rooms rarely change
  });
}
