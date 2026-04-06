"use client";

import { useState } from "react";
import Image from "next/image";
import type { RoomImageResult } from "./types";

interface ImageCarouselProps {
  images: RoomImageResult[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        No photos available
      </div>
    );
  }

  function goTo(index: number) {
    setCurrent((index + images.length) % images.length);
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 group">
      <Image
        src={images[current].url}
        alt={images[current].alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />

      {/* Navigation arrows — visible on hover */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
            aria-label="Previous image"
          >
            <svg
              className="w-4 h-4 text-gray-700"
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

          <button
            type="button"
            onClick={() => goTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
            aria-label="Next image"
          >
            <svg
              className="w-4 h-4 text-gray-700"
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

          {/* Image counter */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
