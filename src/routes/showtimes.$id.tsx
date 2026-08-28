import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Heart, MapPin, Sofa, Ticket } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQueryOptions, findTitle, inr } from "@/lib/catalog";
import { useBooking } from "@/lib/booking-store";

export const Route = createFileRoute("/showtimes/$id")({
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
        { title: `${t.name} Showtimes & Theatres | bookgo` },
        {
          name: "description",
          content: `Pick a date, theatre and show time for ${t.name}, then choose your seats.`,
        },
        { property: "og:title", content: `${t.name} Showtimes | bookgo` },
        {
          property: "og:description",
          content: `Available theatres and show timings for ${t.name}.`,
        },
      ],
    };
  },
  component: Showtimes,
});

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function useDateStrip() {
  return useMemo(() => {
    const base = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return {
        key: `${d.getDate()}-${d.getMonth()}`,
        day: DAYS[d.getDay()],
        num: d.getDate(),
        month: MONTHS[d.getMonth()],
        label: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
      };
    });
  }, []);
}

function Showtimes() {
  const { title } = Route.useLoaderData();
  const { theaters } = useSuspenseQuery(catalogQueryOptions).data;
  const navigate = useNavigate();
  const { city, setDraft } = useBooking();
  const dates = useDateStrip();
  const [dateIdx, setDateIdx] = useState(0);
  const [format, setFormat] = useState<string>("All");

  const formats = ["All", ...title.formats];
  const list = theaters
    .map((t) => ({
      ...t,
      shows: format === "All" ? t.shows : t.shows.filter((s) => s.format === format),
    }))
    .filter((t) => t.shows.length > 0);

  const pick = (theaterId: string, theaterName: string, time: string, fmt: string) => {
    setDraft({
      titleId: title.id,
      theaterId,
      theaterName,
      date: dates[dateIdx]?.label ?? "",
      time,
      format: fmt,
      seats: [],
      fnb: {},
      promo: null,
    });
    navigate({ to: "/seats/$id", params: { id: title.id } });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 p-4">
          <Link
            to="/title/$id"
            params={{ id: title.id }}
            aria-label="Back"
            className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface glass-border"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-black">{title.name}</h1>
            <p className="truncate text-[11px] text-muted-foreground">
              {title.certification} · {title.genres.join(", ")}
            </p>
          </div>
          <button aria-label="Favourite" className="press text-muted-foreground">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {dates.map((d, i) => (
            <button
              key={d.key}
              onClick={() => setDateIdx(i)}
              className={`press flex w-14 shrink-0 flex-col items-center rounded-2xl py-2 text-[11px] font-bold transition ${
                i === dateIdx
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-surface text-muted-foreground glass-border"
              }`}
            >
              <span className="uppercase">{d.day}</span>
              <span className="text-lg font-black leading-tight">{d.num}</span>
              <span className="uppercase">{d.month}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2.5 no-scrollbar">
          {formats.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`press shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                f === format
                  ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                  : "bg-surface text-muted-foreground glass-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 space-y-3 p-4 pb-10">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" /> {list.length} theatres in {city}
          <span className="ml-auto flex items-center gap-3">
            <Legend color="bg-emerald-400" label="Available" />
            <Legend color="bg-amber-400" label="Filling" />
            <Legend color="bg-primary" label="Almost full" />
          </span>
        </div>

        {list.map((t) => (
          <section key={t.id} className="rounded-2xl bg-surface p-4 glass-border shadow-card">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold leading-snug">{t.name}</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {t.area} · {t.distance}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  t.cancellable
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "bg-surface-2 text-muted-foreground"
                }`}
              >
                {t.cancellable ? "Cancellable" : "Non-cancellable"}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {t.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
                >
                  {a}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {t.shows.map((s) => (
                <button
                  key={`${s.time}-${s.format}`}
                  onClick={() => pick(t.id, t.name, s.time, s.format)}
                  className={`press rounded-xl border px-3 py-2 text-left transition ${
                    s.status === "available"
                      ? "border-emerald-400/50 text-emerald-300"
                      : s.status === "filling"
                        ? "border-amber-400/50 text-amber-300"
                        : "border-primary/60 text-primary"
                  }`}
                >
                  <span className="block text-xs font-black">{s.time}</span>
                  <span className="block text-[10px] font-semibold opacity-80">
                    {s.format} · {inr(s.price)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}

        <p className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
          <Sofa className="h-3.5 w-3.5" /> Pick a show time to choose your seats
          <Ticket className="h-3.5 w-3.5" />
        </p>
      </main>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} /> {label}
    </span>
  );
}
