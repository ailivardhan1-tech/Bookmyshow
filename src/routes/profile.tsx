import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { inr } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Bookings & Profile — bookgo" },
      {
        name: "description",
        content: "View your booked movie and event tickets, M-tickets and account details.",
      },
      { property: "og:title", content: "Your Bookings — bookgo" },
      {
        property: "og:description",
        content: "All your bookgo tickets and account details in one place.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { bookings, city } = useBooking();

  return (
    <div className="flex min-h-screen flex-col">
      <TopHeader />
      <main className="flex-1 space-y-4 p-4">
        <h1 className="text-xl font-black tracking-tight">Your bookings</h1>

        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-surface p-6 text-center glass-border">
            <Ticket className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 text-sm font-black">No bookings yet</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Your tickets will show up here once you book a show in {city}.
            </p>
            <Link
              to="/explore"
              className="press mt-4 inline-flex rounded-xl gradient-primary px-4 py-2.5 text-xs font-black text-primary-foreground shadow-glow"
            >
              Explore shows
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.ref} className="rounded-2xl bg-surface p-4 glass-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{b.theaterName}</span>
                  <span className="text-xs font-semibold text-primary">{inr(b.total)}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {b.date} · {b.time} · {b.seats.map((s) => s.id).join(", ")}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Ref {b.ref}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
