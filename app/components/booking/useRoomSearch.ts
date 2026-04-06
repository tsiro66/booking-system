"use client";

import { useQuery } from "@tanstack/react-query";
import type { SearchParams, RoomSearchResponse } from "./types";

async function fetchRooms(params: SearchParams): Promise<RoomSearchResponse> {
  const url = new URL("/api/rooms/search", window.location.origin);
  url.searchParams.set("checkIn", params.checkIn);
  url.searchParams.set("checkOut", params.checkOut);
  url.searchParams.set("adults", String(params.adults));
  url.searchParams.set("children", String(params.children));
  url.searchParams.set("rooms", String(params.rooms));

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch rooms");
  }
  return res.json();
}

export function useRoomSearch(params: SearchParams | null) {
  return useQuery({
    queryKey: ["rooms", params],
    queryFn: () => fetchRooms(params!),
    enabled: params !== null,
  });
}
