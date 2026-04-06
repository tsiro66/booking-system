"use client";

import type { RoomResult } from "./types";
import ImageCarousel from "./ImageCarousel";

interface RoomCardProps {
  room: RoomResult;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <ImageCarousel images={room.images} />

      <div className="p-5">
        {/* Name + price row */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
          <div className="text-right shrink-0">
            <span className="text-lg font-bold text-gray-900">
              ${room.pricePerNight}
            </span>
            <span className="text-sm text-gray-500"> / night</span>
          </div>
        </div>

        {/* Capacity */}
        <p className="mt-1.5 text-sm text-gray-500">
          Up to {room.maxAdults} adult{room.maxAdults !== 1 ? "s" : ""}
          {room.maxGuests > room.maxAdults &&
            `, ${room.maxGuests} guests total`}
        </p>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {room.description}
        </p>

        {/* Book button */}
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            params.set("roomId", room.id);
            window.location.href = `/checkout?${params.toString()}`;
          }}
          className="mt-4 w-full py-2.5 bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-700 active:bg-zinc-800 transition-colors cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
