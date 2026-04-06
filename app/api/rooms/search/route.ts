import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = Number(searchParams.get("adults") ?? 1);
  const children = Number(searchParams.get("children") ?? 0);
  const rooms = Number(searchParams.get("rooms") ?? 1);

  if (!checkIn || !checkOut) {
    return Response.json(
      { error: "checkIn and checkOut are required" },
      { status: 400 },
    );
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return Response.json({ error: "Invalid date format" }, { status: 400 });
  }

  if (checkInDate >= checkOutDate) {
    return Response.json(
      { error: "checkOut must be after checkIn" },
      { status: 400 },
    );
  }

  const totalGuests = adults + children;

  // Find rooms that can accommodate the guest count,
  // then filter by availability (roomCount > overlapping bookings)
  const availableRooms = await prisma.room.findMany({
    where: {
      maxAdults: { gte: adults },
      maxGuests: { gte: totalGuests },
    },
    include: {
      images: { orderBy: { order: "asc" } },
      _count: {
        select: {
          bookings: {
            where: {
              checkIn: { lt: checkOutDate },
              checkOut: { gt: checkInDate },
            },
          },
        },
      },
    },
    orderBy: { pricePerNight: "asc" },
  });

  const results = availableRooms
    .filter((room) => {
      const availableCount = room.roomCount - room._count.bookings;
      return availableCount >= rooms;
    })
    .map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      pricePerNight: Number(room.pricePerNight),
      maxAdults: room.maxAdults,
      maxGuests: room.maxGuests,
      images: room.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
      })),
    }));

  return Response.json({ rooms: results });
}
