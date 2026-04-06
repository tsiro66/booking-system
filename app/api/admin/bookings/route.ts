import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const tab = request.nextUrl.searchParams.get("tab") ?? "upcoming";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let where: Record<string, unknown> = {};

  switch (tab) {
    case "upcoming":
      where = { checkIn: { gte: today }, status: { not: "cancelled" } };
      break;
    case "pending":
      where = { status: "pending" };
      break;
    case "past":
      where = { checkOut: { lt: today }, status: { not: "cancelled" } };
      break;
    case "cancelled":
      where = { status: "cancelled" };
      break;
    default:
      where = { checkIn: { gte: today }, status: { not: "cancelled" } };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      room: {
        select: { name: true, pricePerNight: true },
      },
    },
    orderBy: { checkIn: "asc" },
  });

  const results = bookings.map((b) => ({
    id: b.id,
    checkIn: b.checkIn.toISOString().split("T")[0],
    checkOut: b.checkOut.toISOString().split("T")[0],
    guests: b.guests,
    guestName: b.guestName,
    status: b.status,
    roomId: b.roomId,
    roomName: b.room.name,
    pricePerNight: Number(b.room.pricePerNight),
    createdAt: b.createdAt.toISOString(),
  }));

  return Response.json({ bookings: results });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  // Build update data from allowed fields
  const data: Record<string, unknown> = {};

  if (updates.status !== undefined) {
    if (!["confirmed", "pending", "cancelled"].includes(updates.status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = updates.status;
  }

  if (updates.checkIn !== undefined) {
    data.checkIn = new Date(updates.checkIn);
  }

  if (updates.checkOut !== undefined) {
    data.checkOut = new Date(updates.checkOut);
  }

  if (updates.guests !== undefined) {
    data.guests = Number(updates.guests);
  }

  if (updates.guestName !== undefined) {
    data.guestName = updates.guestName;
  }

  if (updates.roomId !== undefined) {
    data.roomId = updates.roomId;
  }

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id },
    data,
    include: { room: { select: { name: true, pricePerNight: true } } },
  });

  return Response.json({
    id: booking.id,
    status: booking.status,
    checkIn: booking.checkIn.toISOString().split("T")[0],
    checkOut: booking.checkOut.toISOString().split("T")[0],
    guests: booking.guests,
    guestName: booking.guestName,
    roomId: booking.roomId,
    roomName: booking.room.name,
  });
}
