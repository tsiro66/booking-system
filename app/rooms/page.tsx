import RoomResultsPage from "@/app/components/booking/RoomResultsPage";

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const checkIn = String(params.checkIn ?? "");
  const checkOut = String(params.checkOut ?? "");
  const adults = Number(params.adults ?? 2);
  const children = Number(params.children ?? 0);
  const rooms = Number(params.rooms ?? 1);

  // Redirect-worthy validation — if no dates, there's nothing to show
  if (!checkIn || !checkOut) {
    return (
      <main className="min-h-screen bg-zinc-100 px-4 py-6 sm:py-12">
        <div className="mx-auto max-w-3xl text-center py-20">
          <p className="text-gray-500">
            No search criteria provided.
          </p>
          <a
            href="/"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Go back to search
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <RoomResultsPage
          searchParams={{ checkIn, checkOut, adults, children, rooms }}
        />
      </div>
    </main>
  );
}
