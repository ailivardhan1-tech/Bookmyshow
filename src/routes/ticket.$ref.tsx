import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Clock, MapPin, Share2, Sofa } from "lucide-react";
import { Barcode, QrCode } from "@/components/QrCode";
import { fnbItems, getTitle, inr } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-store";

export const Route = createFileRoute("/ticket/$ref")({
  head: () => ({
    meta: [
      { title: "Your M-Ticket — bookgo" },
      {
        name: "description",
        content: "Your digital movie ticket with QR entry code, seat numbers, screen and show time.",
      },
      { property: "og:title", content: "Your M-Ticket — bookgo" },
      {
        property: "og:description",
        content: "Show this QR code at the cinema entry gate.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TicketPage,
});

function TicketPage() {
  const { ref } = Route.useParams();
  const { bookings } = useBooking();
  const booking = bookings.find((b) => b.ref === ref);
  const title = booking ? getTitle(booking.titleId) : undefined;

  if (!booking || !title) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="text-sm font-black">Ticket not available</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            This M-ticket isn't in this session. Book a show to generate a new one.
          </p>
          <Link
            to="/"
            className="press mt-4 inline-flex rounded-xl gradient-primary px-4 py-2.5 text-xs font-black text-primary-foreground shadow-glow"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  const fnbLines = Object.entries(booking.fnb)
    .map(([id, qty]) => {
      const item = fnbItems.find((f) => f.id === id);
      return item ? `${item.name} × ${qty}` : null;
    })
    .filter((x): x is string => x !== null);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-4">
        <div className="pt-4 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
          <h1 className="mt-3 text-lg font-black">Booking confirmed</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Your M-ticket is ready · {inr(booking.total)} paid
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-surface glass-border shadow-card">
          <div className="flex gap-3 p-4">
            <img
              src={title.poster}
              alt={title.name}
              className="h-24 w-16 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-black">{title.name}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {title.certification} · {booking.format}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{booking.theaterName}</span>
              </p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" /> {booking.date} · {booking.time}
              </p>
            </div>
          </div>

          <div className="relative border-t border-dashed border-border">
            <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-background" />
            <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-background" />
          </div>

          <div className="grid grid-cols-3 gap-2 p-4 text-center">
            <Meta label="Screen" value={booking.screen} />
            <Meta label="Seats" value={booking.seats.map((s) => s.id).join(", ")} />
            <Meta label="Tickets" value={String(booking.seats.length)} />
          </div>

          <div className="flex flex-col items-center gap-3 px-4 pb-5">
            <QrCode value={booking.ref} />
            <p className="text-[11px] text-muted-foreground">
              Booking ID <span className="font-black text-foreground">{booking.ref}</span>
            </p>
            <Barcode value={booking.ref} />
            <p className="text-center text-[10px] text-muted-foreground">
              Scan at the entry gate. Please arrive 20 minutes before showtime.
            </p>
          </div>
        </div>

        {fnbLines.length > 0 && (
          <div className="rounded-2xl bg-surface p-4 glass-border">
            <h2 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide">
              <Sofa className="h-4 w-4 text-primary" /> Snacks at your seat
            </h2>
            <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
              {fnbLines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <button className="press flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-surface py-3 text-xs font-black glass-border">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <Link
            to="/profile"
            className="press flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-surface py-3 text-xs font-black glass-border"
          >
            <CalendarCheck className="h-4 w-4" /> My bookings
          </Link>
        </div>

        <Link
          to="/"
          className="press block rounded-2xl gradient-primary py-3.5 text-center text-sm font-black text-primary-foreground shadow-glow"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-xs font-black">{value}</div>
    </div>
  );
}
