export interface AdminBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  status: string;
  roomId: string;
  roomName: string;
  pricePerNight: number;
  createdAt: string;
}

export interface RoomOption {
  id: string;
  name: string;
}

export type Tab = "upcoming" | "pending" | "past" | "cancelled";
