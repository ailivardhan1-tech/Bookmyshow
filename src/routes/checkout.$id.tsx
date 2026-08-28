import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgePercent, CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";
import { coupons, fnbItems, getTitle, inr } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-store";
import { useAuth } from "@/lib/auth-store";


export const Route = createFileRoute("/checkout/$id")({
  loader: ({ params }) => {
    const title = getTitle(params.id);
    if (!title) throw notFound();
    return { title };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — bookgo" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = loaderData.title;
    return {
      meta: [
        { title: `Checkout — ${t.name} Tickets | bookgo` },
        {
          name: "description",
          content: "Review your seats, snacks and offers, then pay to get your instant M-ticket.",
        },
        { property: "og:title", content: "Checkout | bookgo" },
        {
          property: "og:description",
          content: "Payment summary with offers, convenience fee and GST breakdown.",
        },
      ],
      links: [{ rel: "canonical", href: "https://bookgo.lovable.app/checkout" }],
    };
  },
  component: Checkout,
});

const METHODS = [
  { id: "upi", label: "UPI / QR", hint: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "wallet", label: "Wallets", hint: "Amazon Pay, Mobikwik", icon: Wallet },
  { id: "netbanking", label: "Net banking", hint: "All major banks", icon: Landmark },
] as const;

function Checkout() {
  const { title } = Route.useLoaderData();
  const navigate = useNavigate();
  const { draft, setDraft, confirmBooking } = useBooking();
  const { user } = useAuth();
  const [method, setMethod] = useState<string>("upi");
  const [paying, setPaying] = useState(false);


  const seatTotal = draft.seats.reduce((s, x) => s + x.price, 0);
  const fnbLines = Object.entries(draft.fnb)
    .map(([id, qty]) => {
      const item = fnbItems.find((f) => f.id === id);
      return item ? { ...item, qty } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const fnbTotal = fnbLines.reduce((s, x) => s + x.price * x.qty, 0);
  const fee = Math.round(seatTotal * 0.06) + 20 * Math.max(draft.seats.length, 1);
  const gst = Math.round(fee * 0.18);
  const discount = draft.promo?.discount ?? 0;
  const total = Math.max(0, seatTotal + fnbTotal + fee + gst - discount);

  const pay = () => {
    setPaying(true);
    const booking = confirmBooking(total);
    setTimeout(() => navigate({ to: "/ticket/$ref", params: { ref: booking.ref } }), 900);
  };

  if (draft.seats.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="text-sm font-black">Your booking expired</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Pick a show time and seats to continue to checkout.
          </p>
          <Link
            to="/showtimes/$id"
            params={{ id: title.id }}
            className="press mt-4 inline-flex rounded-xl gradient-primary px-4 py-2.5 text-xs font-black text-primary-foreground shadow-glow"
          >
            Choose showtime
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 p-4 backdrop-blur">
        <Link
          to="/fnb/$id"
          params={{ id: title.id }}
          aria-label="Back"
          className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface glass-border"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-sm font-black">Payment summary</h1>
      </header>

      <main className="flex-1 space-y-4 p-4">
        <section className="rounded-2xl bg-surface p-4 glass-border shadow-card">
          <div className="flex gap-3">
            <img
              src={title.poster}
              alt={title.name}
              className="h-20 w-14 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold">{title.name}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {draft.format} · {draft.screen}
              </p>
              <p className="text-[11px] text-muted-foreground">{draft.theaterName}</p>
              <p className="text-[11px] text-muted-foreground">
                {draft.date} · {draft.time}
              </p>
              <p className="mt-1 text-[11px] font-semibold">
                Seats {draft.seats.map((s) => s.id).join(", ")}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2 rounded-2xl bg-surface p-4 glass-border">
          <h2 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide">
            <BadgePercent className="h-4 w-4 text-primary" /> Offers
          </h2>
          {coupons.map((c) => {
            const active = draft.promo?.code === c.code;
            return (
              <button
                key={c.code}
                onClick={() =>
                  setDraft({ promo: active ? null : { code: c.code, discount: c.discount } })
                }
                className={`press flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  active ? "bg-primary/15 ring-1 ring-primary/50" : "bg-surface-2"
                }`}
              >
                <span className="rounded-md border border-dashed border-primary/60 px-2 py-0.5 text-[10px] font-black text-primary">
                  {c.code}
                </span>
                <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
                  {c.label}
                </span>
                <span className="text-[11px] font-black text-primary">
                  {active ? "Applied" : "Apply"}
                </span>
              </button>
            );
          })}
        </section>

        <section className="space-y-2 rounded-2xl bg-surface p-4 glass-border">
          <h2 className="text-xs font-black uppercase tracking-wide">Bill details</h2>
          <Row label={`Tickets (${draft.seats.length})`} value={inr(seatTotal)} />
          {fnbLines.map((f) => (
            <Row key={f.id} label={`${f.name} × ${f.qty}`} value={inr(f.price * f.qty)} muted />
          ))}
          <Row label="Convenience fee" value={inr(fee)} muted />
          <Row label="GST (18%)" value={inr(gst)} muted />
          {discount > 0 && (
            <Row label={`Discount (${draft.promo?.code})`} value={`− ${inr(discount)}`} accent />
          )}
          <div className="mt-2 border-t border-border pt-2">
            <Row label="Amount payable" value={inr(total)} bold />
          </div>
        </section>

        <section className="space-y-2 rounded-2xl bg-surface p-4 glass-border">
          <h2 className="text-xs font-black uppercase tracking-wide">Payment method</h2>
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`press flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                method === m.id ? "bg-primary/15 ring-1 ring-primary/50" : "bg-surface-2"
              }`}
            >
              <m.icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold">{m.label}</span>
                <span className="block text-[10px] text-muted-foreground">{m.hint}</span>
              </span>
              <span
                className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                  method === m.id ? "border-primary bg-primary" : "border-muted-foreground"
                }`}
              />
            </button>
          ))}
        </section>
      </main>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-background/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <button
          onClick={pay}
          disabled={paying}
          className="press w-full rounded-2xl gradient-primary py-3.5 text-sm font-black text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {paying ? "Processing payment…" : `Pay ${inr(total)}`}
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  bold,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 text-xs ${
        bold ? "font-black" : muted ? "text-muted-foreground" : ""
      }`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span className={`shrink-0 font-semibold ${accent ? "text-primary" : ""}`}>{value}</span>
    </div>
  );
}
