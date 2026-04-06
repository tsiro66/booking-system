import { prisma } from "@/lib/prisma";

export async function GET() {
  const rooms = await prisma.room.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return Response.json({ rooms });
}
