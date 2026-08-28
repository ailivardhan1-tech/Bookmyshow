import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, MapPin, Search, User, X } from "lucide-react";
import { cities, theaters, titles } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-store";

export function TopHeader() {
  const { city, setCity } = useBooking();
  const [locOpen, setLocOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(cityQuery.toLowerCase()),
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { items: [], venues: [] };
    return {
      items: titles.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.genres.some((g) => g.toLowerCase().includes(q)) ||
          t.languages.some((l) => l.toLowerCase().includes(q)),
      ),
      venues: theaters.filter(
        (t) => t.name.toLowerCase().includes(q) || t.area.toLowerCase().includes(q),
      ),
    };
  }, [query]);

  return (
    <>
      <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="shrink-0 text-lg font-black tracking-tight">
            book<span className="text-primary">go</span>
          </Link>
          <button
            onClick={() => setLocOpen(true)}
            className="press flex min-w-0 items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate text-foreground">{city}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconBtn label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </IconBtn>
          <IconBtn label="Notifications" onClick={() => setSearchOpen(false)}>
            <span className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
            </span>
          </IconBtn>
          <Link
            to="/profile"
            aria-label="Profile"
            className="press ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-primary text-primary-foreground"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {locOpen && (
        <Sheet title="Select your city" onClose={() => setLocOpen(false)}>
          <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              placeholder="Search for your city"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {filteredCities.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCity(c);
                  setLocOpen(false);
                }}
                className={`press rounded-2xl px-3 py-3 text-left text-sm font-medium glass-border ${
                  c === city ? "bg-primary/15 text-primary" : "bg-surface"
                }`}
              >
                <MapPin className="mb-1 h-4 w-4" />
                <div>{c}</div>
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {searchOpen && (
        <Sheet title="Search" onClose={() => setSearchOpen(false)}>
          <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Movies, events, venues…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="mt-4 space-y-4">
            {!query && (
              <p className="text-sm text-muted-foreground">
                Try “IMAX”, “comedy”, “Andheri” or “Telugu”.
              </p>
            )}
            {results.items.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Movies & Events
                </h3>
                <div className="space-y-2">
                  {results.items.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                        navigate({ to: "/title/$id", params: { id: t.id } });
                      }}
                      className="press flex w-full items-center gap-3 rounded-2xl bg-surface p-2 text-left"
                    >
                      <img
                        src={t.poster}
                        alt={t.name}
                        loading="lazy"
                        className="h-16 w-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{t.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {t.genres.join(" · ")}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {results.venues.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Venues
                </h3>
                <div className="space-y-2">
                  {results.venues.map((v) => (
                    <div key={v.id} className="rounded-2xl bg-surface p-3">
                      <div className="text-sm font-semibold">{v.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {v.area} · {v.distance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {query && results.items.length === 0 && results.venues.length === 0 && (
              <p className="text-sm text-muted-foreground">No results for “{query}”.</p>
            )}
          </div>
        </Sheet>
      )}
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="press grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-surface"
    >
      {children}
    </button>
  );
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-[430px] animate-in slide-in-from-bottom rounded-t-3xl bg-popover p-4 pb-8 duration-200">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="press rounded-full p-1">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
