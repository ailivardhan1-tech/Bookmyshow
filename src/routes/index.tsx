import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Play, Calendar, MapPin, ChevronRight } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQueryOptions, inr, type Category } from "@/lib/catalog";
import { useBooking } from "@/lib/booking-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "bookgo — Movie & Event Tickets, Showtimes and Seats" },
      {
        name: "description",
        content:
          "Book movie tickets, live events, plays, sports and stand-up comedy. Pick seats, add snacks and get an instant M-ticket.",
      },
      { property: "og:title", content: "bookgo — Movie & Event Tickets" },
      {
        property: "og:description",
        content: "Discover movies and events near you, choose seats and book in seconds.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  component: Home,
});

function Home() {
  const [cat, setCat] = useState<Category>("Movies");
  const { city } = useBooking();
  const { titles } = useSuspenseQuery(catalogQueryOptions).data;
  const movies = titles.filter((t) => t.kind === "movie");
  const events = titles.filter((t) => t.kind === "event");
  const visible =
    cat === "Movies" ? movies : titles.filter((t) => t.category === cat);

  return (
    <div className="flex min-h-screen flex-col">
      <TopHeader />
      <main className="flex-1 pb-6">
        <CategoryBar cat={cat} setCat={setCat} />
        <HeroCarousel />

        <Section title={cat === "Movies" ? "Recommended Movies" : cat} action="See all">
          <div className="grid grid-cols-2 gap-3 px-4">
            {(visible.length ? visible : movies).map((m) => (
              <Link
                key={m.id}
                to="/title/$id"
                params={{ id: m.id }}
                className="press block overflow-hidden rounded-2xl bg-surface glass-border shadow-card"
              >
                <div className="relative">
                  <img
                    src={m.poster}
                    alt={`${m.name} poster`}
                    loading="lazy"
                    className="aspect-[2/3] w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 bg-gradient-to-t from-black/85 to-transparent px-2 pb-1.5 pt-6 text-xs font-semibold">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {m.rating}/10
                    <span className="font-normal text-white/70">{m.votes} votes</span>
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="truncate text-sm font-bold">{m.name}</h3>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {m.languages.join(", ")}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {m.formats.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="Events & Outdoor Experiences" action="Explore">
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
            {events.map((e) => (
              <Link
                key={e.id}
                to="/title/$id"
                params={{ id: e.id }}
                className="press w-[260px] shrink-0 overflow-hidden rounded-2xl bg-surface glass-border shadow-card"
              >
                <img
                  src={e.backdrop}
                  alt={e.name}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="space-y-1 p-3">
                  <h3 className="truncate text-sm font-bold">{e.name}</h3>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {e.dateLabel}
                  </p>
                  <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" /> {e.venue}
                  </p>
                  <p className="pt-1 text-xs font-semibold text-primary">
                    {inr(e.priceFrom)} onwards
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <p className="px-4 pt-2 text-center text-xs text-muted-foreground">
          Showing experiences in {city}
        </p>
      </main>
      <BottomNav />
    </div>
  );
}

function CategoryBar({
  cat,
  setCat,
}: {
  cat: Category;
  setCat: (c: Category) => void;
}) {
  const { categories } = useSuspenseQuery(catalogQueryOptions).data;
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
      {categories.map((c) => (
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
  );
}

function HeroCarousel() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const { heroSlides } = useSuspenseQuery(catalogQueryOptions).data;

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 4000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  return (
    <div className="px-4">
      <div className="relative overflow-hidden rounded-2xl shadow-card">
        {heroSlides.map((s, idx) => (
          <div
            key={s.id}
            className={`transition-opacity duration-700 ${
              idx === i ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              width={1024}
              height={576}
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                {s.tag}
              </span>
              <h2 className="mt-2 text-xl font-black leading-tight">{s.title}</h2>
              <p className="text-xs text-white/75">{s.subtitle}</p>
              <button
                onClick={() => navigate({ to: "/title/$id", params: { id: s.id } })}
                className="press mt-3 inline-flex items-center gap-1.5 rounded-xl gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Book Now
              </button>
            </div>
          </div>
        ))}
        <div className="absolute right-3 top-3 flex gap-1">
          {heroSlides.map((s, idx) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-5 bg-primary" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-6">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-black tracking-tight">{title}</h2>
        {action && (
          <span className="flex items-center text-xs font-semibold text-primary">
            {action} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
