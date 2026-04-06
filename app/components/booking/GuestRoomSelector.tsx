"use client";

import type { GuestRoomSelectorProps, GuestRoomValues } from "./types";

const FIELDS: {
  key: keyof GuestRoomValues;
  label: string;
  min: number;
  max: number;
}[] = [
  { key: "adults", label: "Adults", min: 1, max: 10 },
  { key: "children", label: "Children", min: 0, max: 6 },
  { key: "rooms", label: "Rooms", min: 1, max: 5 },
];

export default function GuestRoomSelector({
  values,
  onChange,
}: GuestRoomSelectorProps) {
  function update(key: keyof GuestRoomValues, delta: number) {
    const field = FIELDS.find((f) => f.key === key)!;
    const next = Math.min(field.max, Math.max(field.min, values[key] + delta));
    if (next !== values[key]) {
      onChange({ ...values, [key]: next });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {FIELDS.map(({ key, label, min, max }) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update(key, -1)}
              disabled={values[key] <= min}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label={`Decrease ${label.toLowerCase()}`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
                />
              </svg>
            </button>

            <span className="w-6 text-center text-sm font-semibold text-gray-800 tabular-nums">
              {values[key]}
            </span>

            <button
              type="button"
              onClick={() => update(key, 1)}
              disabled={values[key] >= max}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label={`Increase ${label.toLowerCase()}`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14m7-7H5"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
