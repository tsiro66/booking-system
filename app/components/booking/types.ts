export interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface GuestRoomValues {
  adults: number;
  children: number;
  rooms: number;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
}

export interface CalendarProps {
  selectedRange: DateRange;
  onDateSelect: (date: Date) => void;
  theme: import("./color-themes").ColorTheme;
}

export interface GuestRoomSelectorProps {
  values: GuestRoomValues;
  onChange: (values: GuestRoomValues) => void;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

export interface RoomImageResult {
  id: string;
  url: string;
  alt: string;
}

export interface RoomResult {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxAdults: number;
  maxGuests: number;
  images: RoomImageResult[];
}

export interface RoomSearchResponse {
  rooms: RoomResult[];
}
