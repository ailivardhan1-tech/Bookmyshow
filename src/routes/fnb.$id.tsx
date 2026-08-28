import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQueryOptions, findTitle, inr, type FnbItem } from "@/lib/catalog";
import { useBooking } from "@/lib/booking-store";


export const Route = createFileRoute("/fnb/$id")({
  loader: async ({ context, params }) => {
    const catalog = await context.queryClient.ensureQueryData(catalogQueryOptions);
    const title = findTitle(catalog, params.id);
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
        { title: `Add Food & Beverages — ${t.name} | bookgo` },
        {
          name: "description",
          content: "Pre-book popcorn, beverages, combos and snacks and skip the counter queue.",
        },
        { property: "og:title", content: "Add Food & Beverages | bookgo" },
        {
          property: "og:description",
          content: "Popcorn, drinks and combos delivered to your seat.",
        },
      ],
    };
  },
  component: Fnb,
});

const CATEGORIES: FnbItem["category"][] = ["Combos", "Popcorn", "Beverages", "Snacks"];

function Fnb() {
  const { title } = Route.useLoaderData();
  const navigate = useNavigate();
  const { draft, setDraft } = useBooking();
  const { fnbItems } = useSuspenseQuery(catalogQueryOptions).data;
  const [cart, setCart] = useState<Record<string, number>>(draft.fnb);
  const [cat, setCat] = useState<FnbItem["category"]>("Combos");

  const bump = (id: string, delta: number) =>
    setCart((c) => {
      const next = Math.max(0, (c[id] ?? 0) + delta);
      const copy = { ...c };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });

  const fnbTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = fnbItems.find((f) => f.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const proceed = () => {
    setDraft({ fnb: cart });
    navigate({ to: "/checkout/$id", params: { id: title.id } });
  };

  return (
    <div className="flex min-h-screen flex-col pb-28">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 p-4">
          <Link
            to="/seats/$id"
            params={{ id: title.id }}
            aria-label="Back"
            className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface glass-border"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-black">Add food &amp; beverages</h1>
            <p className="truncate text-[11px] text-muted-foreground">
              Skip the queue · delivered to your seat
            </p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`press shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                c === cat
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-surface text-muted-foreground glass-border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 space-y-3 p-4">
        {fnbItems
          .filter((f) => f.category === cat)
          .map((f) => {
            const qty = cart[f.id] ?? 0;
            return (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-2xl bg-surface p-3 glass-border shadow-card"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-surface-2 text-2xl">
                  {f.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-bold">{f.name}</h2>
                  <p className="truncate text-[11px] text-muted-foreground">{f.description}</p>
                  <p className="mt-1 text-xs font-black text-primary">{inr(f.price)}</p>
                </div>
                {qty === 0 ? (
                  <button
                    onClick={() => {
                      bump(f.id, 1);
                      toast.success(`${f.name} added`);
                    }}
                    className="press shrink-0 rounded-xl bg-surface-2 px-3 py-2 text-xs font-black text-primary glass-border"
                  >
                    Add
                  </button>

                ) : (
                  <div className="flex shrink-0 items-center gap-2 rounded-xl gradient-primary px-2 py-1.5 text-primary-foreground">
                    <button aria-label={`Remove one ${f.name}`} onClick={() => bump(f.id, -1)}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-4 text-center text-xs font-black">{qty}</span>
                    <button aria-label={`Add one ${f.name}`} onClick={() => bump(f.id, 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </main>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-background/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground">
              {count ? `${count} item(s) added` : "No snacks added"}
            </div>
            <div className="text-sm font-black">{inr(fnbTotal)}</div>
          </div>
          <button
            onClick={proceed}
            className="press ml-auto flex-1 rounded-2xl gradient-primary py-3.5 text-sm font-black text-primary-foreground shadow-glow"
          >
            {count ? "Continue" : "Skip for now"}
          </button>
        </div>
      </div>
    </div>
  );
}
