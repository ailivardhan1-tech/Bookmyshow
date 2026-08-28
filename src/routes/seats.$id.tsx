import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import { getTitle, inr, isSeatSold, seatTiers } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-store";


export const Route = createFileRoute("/seats/$id")({
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
        { title: `Select Seats — ${t.name} | bookgo` },
        {
          name: "description",
          content: `Choose Recliner, Prime or Classic seats for ${t.name} on an interactive seat map.`,
        },
        { property: "og:title", content: `Select Seats — ${t.name} | bookgo` },
        {
          property: "og:description",
          content: `Interactive seat map with live pricing tiers for ${t.name}.`,
        },
      ],
    };
  },
  component: Seats,
});

type Seat = { id: string; tier: string; price: number };

function Seats() {
  const { title } = Route.useLoaderData();
  const navigate = useNavigate();
  const { draft, setDraft } = useBooking();
  const [selected, setSelected] = useState<Seat[]>(draft.seats);

  const toggle = (seat: Seat) => {
    setSelected((cur) => {
      if (cur.some((s) => s.id === seat.id)) return cur.filter((s) => s.id !== seat.id);
      if (cur.length >= 10) {
        toast.error("You can book up to 10 seats in one go.");
        return cur;
      }
      return [...cur, seat];
    });
  };


  const subtotal = selected.reduce((sum, s) => sum + s.price, 0);

  const proceed = () => {
    setDraft({ titleId: title.id, seats: selected });
    navigate({ to: "/fnb/$id", params: { id: title.id } });
  };

  return (
    <div className="flex min-h-screen flex-col pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 p-4 backdrop-blur">
        <Link
          to="/showtimes/$id"
          params={{ id: title.id }}
          aria-label="Back"
          className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface glass-border"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-black">{title.name}</h1>
          <p className="truncate text-[11px] text-muted-foreground">
            {draft.theaterName || "Select a theatre"} · {draft.date} · {draft.time}
          </p>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-4">
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
          <Legend className="bg-surface-2 glass-border" label="Available" />
          <Legend className="gradient-primary" label="Selected" />
          <Legend className="bg-surface/40 opacity-40" label="Sold" />
        </div>

        <div className="space-y-6 overflow-x-auto no-scrollbar">
          {seatTiers.map((tier) => (
            <div key={tier.name}>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {tier.name} · {inr(tier.price)}
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-1.5">
                {tier.rows.map((row) => (
                  <div key={row} className="flex items-center gap-1.5">
                    <span className="w-4 shrink-0 text-[10px] font-bold text-muted-foreground">
                      {row}
                    </span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: tier.cols }, (_, i) => {
                        const col = i + 1;
                        const id = `${row}${col}`;
                        const sold = isSeatSold(row, col);
                        const isSel = selected.some((s) => s.id === id);
                        return (
                          <button
                            key={id}
                            disabled={sold}
                            aria-label={`Seat ${id} ${sold ? "sold" : inr(tier.price)}`}
                            onClick={() => toggle({ id, tier: tier.name, price: tier.price })}
                            className={`h-6 w-6 rounded-md text-[9px] font-bold transition ${
                              sold
                                ? "cursor-not-allowed bg-surface/40 text-transparent opacity-40"
                                : isSel
                                  ? "gradient-primary text-primary-foreground shadow-glow"
                                  : "press bg-surface-2 text-muted-foreground glass-border"
                            }`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="mx-auto h-1.5 w-3/4 rounded-full gradient-primary opacity-80" />
          <div
            className="mx-auto h-8 w-4/5 rounded-b-[100%] bg-gradient-to-b from-primary/25 to-transparent"
            aria-hidden
          />
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            All eyes this way
          </p>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <Info className="h-3.5 w-3.5" /> Up to 10 seats per booking
        </p>
      </main>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-background/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground">
              {selected.length ? `${selected.length} seat(s) · ${selected.map((s) => s.id).join(", ")}` : "No seats selected"}
            </div>
            <div className="truncate text-sm font-black">{inr(subtotal)}</div>
          </div>
          <button
            disabled={selected.length === 0}
            onClick={proceed}
            className="press ml-auto flex-1 rounded-2xl gradient-primary py-3.5 text-sm font-black text-primary-foreground shadow-glow disabled:opacity-40 disabled:shadow-none"
          >
            Add snacks
          </button>
        </div>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3.5 w-3.5 rounded ${className}`} /> {label}
    </span>
  );
}
