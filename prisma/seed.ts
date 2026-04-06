import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const ROOMS = [
  {
    name: "Standard Double",
    description:
      "A comfortable room with a queen-sized bed, work desk, and en-suite bathroom. Perfect for solo travellers or couples looking for a cosy and affordable stay.",
    pricePerNight: 89.0,
    maxAdults: 2,
    maxChildren: 1,
    maxGuests: 3,
    roomCount: 5,
    images: [
      { seed: "standard-1", alt: "Standard Double — bed and desk" },
      { seed: "standard-2", alt: "Standard Double — bathroom" },
      { seed: "standard-3", alt: "Standard Double — window view" },
    ],
  },
  {
    name: "Deluxe King",
    description:
      "Spacious room featuring a king-sized bed, seating area, and floor-to-ceiling windows with city views. Includes complimentary minibar and premium toiletries.",
    pricePerNight: 149.0,
    maxAdults: 2,
    maxChildren: 2,
    maxGuests: 4,
    roomCount: 3,
    images: [
      { seed: "deluxe-1", alt: "Deluxe King — bedroom" },
      { seed: "deluxe-2", alt: "Deluxe King — seating area" },
      { seed: "deluxe-3", alt: "Deluxe King — city view" },
      { seed: "deluxe-4", alt: "Deluxe King — bathroom" },
    ],
  },
  {
    name: "Superior Twin",
    description:
      "Bright room with two single beds, ideal for friends or colleagues travelling together. Features a modern bathroom with rain shower and a compact work area.",
    pricePerNight: 129.0,
    maxAdults: 2,
    maxChildren: 1,
    maxGuests: 3,
    roomCount: 4,
    images: [
      { seed: "twin-1", alt: "Superior Twin — beds" },
      { seed: "twin-2", alt: "Superior Twin — bathroom" },
      { seed: "twin-3", alt: "Superior Twin — work area" },
    ],
  },
  {
    name: "Junior Suite",
    description:
      "A generous suite with separate living area, king bed, and marble bathroom with soaking tub. Enjoy the espresso machine and curated minibar after a long day.",
    pricePerNight: 219.0,
    maxAdults: 3,
    maxChildren: 2,
    maxGuests: 5,
    roomCount: 2,
    images: [
      { seed: "junior-1", alt: "Junior Suite — living area" },
      { seed: "junior-2", alt: "Junior Suite — bedroom" },
      { seed: "junior-3", alt: "Junior Suite — marble bathroom" },
      { seed: "junior-4", alt: "Junior Suite — minibar" },
    ],
  },
  {
    name: "Executive Suite",
    description:
      "Our premium suite with panoramic views, separate bedroom and lounge, walk-in wardrobe, and a luxurious bathroom with both rain shower and freestanding tub.",
    pricePerNight: 349.0,
    maxAdults: 3,
    maxChildren: 3,
    maxGuests: 6,
    roomCount: 2,
    images: [
      { seed: "exec-1", alt: "Executive Suite — lounge" },
      { seed: "exec-2", alt: "Executive Suite — bedroom" },
      { seed: "exec-3", alt: "Executive Suite — panoramic view" },
      { seed: "exec-4", alt: "Executive Suite — bathroom" },
    ],
  },
  {
    name: "Family Room",
    description:
      "Designed for families with a king bed and bunk beds in a partitioned area. Includes a play corner, child-safe amenities, and extra storage for luggage and gear.",
    pricePerNight: 179.0,
    maxAdults: 2,
    maxChildren: 4,
    maxGuests: 6,
    roomCount: 3,
    images: [
      { seed: "family-1", alt: "Family Room — main bedroom" },
      { seed: "family-2", alt: "Family Room — bunk beds" },
      { seed: "family-3", alt: "Family Room — play corner" },
    ],
  },
  {
    name: "Penthouse Suite",
    description:
      "The crown jewel — a two-storey penthouse with wraparound terrace, private dining room, grand piano, and butler service. Unobstructed skyline views from every room.",
    pricePerNight: 599.0,
    maxAdults: 4,
    maxChildren: 2,
    maxGuests: 6,
    roomCount: 1,
    images: [
      { seed: "pent-1", alt: "Penthouse Suite — terrace" },
      { seed: "pent-2", alt: "Penthouse Suite — living room" },
      { seed: "pent-3", alt: "Penthouse Suite — dining room" },
      { seed: "pent-4", alt: "Penthouse Suite — master bedroom" },
    ],
  },
];

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.roomImage.deleteMany();
  await prisma.room.deleteMany();

  for (const roomData of ROOMS) {
    const room = await prisma.room.create({
      data: {
        name: roomData.name,
        description: roomData.description,
        pricePerNight: roomData.pricePerNight,
        maxAdults: roomData.maxAdults,
        maxChildren: roomData.maxChildren,
        maxGuests: roomData.maxGuests,
        roomCount: roomData.roomCount,
        images: {
          create: roomData.images.map((img, i) => ({
            url: `https://picsum.photos/seed/${img.seed}/800/600`,
            alt: img.alt,
            order: i,
          })),
        },
      },
    });

    console.log(`Created room: ${room.name}`);
  }

  // Create sample bookings across different statuses and time ranges.
  const rooms = await prisma.room.findMany();
  const standard = rooms.find((r) => r.name === "Standard Double")!;
  const deluxe = rooms.find((r) => r.name === "Deluxe King")!;
  const twin = rooms.find((r) => r.name === "Superior Twin")!;
  const junior = rooms.find((r) => r.name === "Junior Suite")!;
  const exec = rooms.find((r) => r.name === "Executive Suite")!;
  const family = rooms.find((r) => r.name === "Family Room")!;
  const penthouse = rooms.find((r) => r.name === "Penthouse Suite")!;

  const bookings = [
    // ── Upcoming confirmed ──
    { roomId: deluxe.id, checkIn: "2026-04-14", checkOut: "2026-04-18", guests: 2, guestName: "Olivia Chen", status: "confirmed" },
    { roomId: standard.id, checkIn: "2026-04-20", checkOut: "2026-04-23", guests: 1, guestName: "Marcus Webb", status: "confirmed" },
    { roomId: family.id, checkIn: "2026-04-22", checkOut: "2026-04-27", guests: 5, guestName: "Sofia Petrov", status: "confirmed" },
    { roomId: junior.id, checkIn: "2026-05-01", checkOut: "2026-05-05", guests: 3, guestName: "James Okafor", status: "confirmed" },
    { roomId: penthouse.id, checkIn: "2026-05-10", checkOut: "2026-05-14", guests: 4, guestName: "Elena Rossi", status: "confirmed" },
    { roomId: standard.id, checkIn: "2026-05-10", checkOut: "2026-05-15", guests: 2, guestName: "David Kim", status: "confirmed" },
    { roomId: exec.id, checkIn: "2026-05-18", checkOut: "2026-05-22", guests: 2, guestName: "Aisha Mbeki", status: "confirmed" },

    // ── Pending ──
    { roomId: twin.id, checkIn: "2026-04-15", checkOut: "2026-04-17", guests: 2, guestName: "Lucas Fernández", status: "pending" },
    { roomId: deluxe.id, checkIn: "2026-04-28", checkOut: "2026-05-02", guests: 2, guestName: "Hannah Müller", status: "pending" },
    { roomId: family.id, checkIn: "2026-05-05", checkOut: "2026-05-09", guests: 6, guestName: "Raj Patel", status: "pending" },

    // ── Past ──
    { roomId: standard.id, checkIn: "2026-03-01", checkOut: "2026-03-04", guests: 2, guestName: "Tom Sanders", status: "confirmed" },
    { roomId: deluxe.id, checkIn: "2026-03-10", checkOut: "2026-03-14", guests: 2, guestName: "Nina Johansson", status: "confirmed" },
    { roomId: junior.id, checkIn: "2026-03-18", checkOut: "2026-03-21", guests: 3, guestName: "Carlos Vega", status: "confirmed" },
    { roomId: twin.id, checkIn: "2026-03-25", checkOut: "2026-03-28", guests: 2, guestName: "Yuki Tanaka", status: "confirmed" },

    // ── Cancelled ──
    { roomId: exec.id, checkIn: "2026-04-12", checkOut: "2026-04-16", guests: 2, guestName: "Pierre Dubois", status: "cancelled" },
    { roomId: penthouse.id, checkIn: "2026-04-20", checkOut: "2026-04-25", guests: 4, guestName: "Maria Costa", status: "cancelled" },
  ];

  for (const b of bookings) {
    await prisma.booking.create({
      data: {
        roomId: b.roomId,
        checkIn: new Date(b.checkIn),
        checkOut: new Date(b.checkOut),
        guests: b.guests,
        guestName: b.guestName,
        status: b.status,
      },
    });
  }

  console.log(`Created ${bookings.length} sample bookings`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
