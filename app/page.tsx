import SearchWidget from "@/app/components/booking/SearchWidget";

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center items-start sm:items-center bg-zinc-100 px-4 py-6 sm:py-0">
      <section className="w-full max-w-3xl">
        <SearchWidget />
      </section>
    </main>
  );
}
