import AdminBookings from "@/app/components/admin/AdminBookings";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Bookings</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Manage reservations for your hotel.
        </p>
        <AdminBookings />
      </div>
    </main>
  );
}
