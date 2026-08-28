import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SearchX, Star } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { categories, inr, titles, type Category } from "@/lib/mock-data";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Movies & Events Near You — bookgo" },
      {
        name: "description",
        content:
          "Browse every movie, live event, play, sports fixture and comedy show available to book right now.",
      },
      { property: "og:title", content: "Explore Movies & Events — bookgo" },
      {
        property: "og:description",
        content: "Every show currently open for booking, in one list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

const LANGUAGES = ["All", "English", "Hindi", "Telugu", "Tamil", "Marathi", "Kannada"];

function Explore() {
  const [cat, setCat] = useState<Category | "All">("All");
  const [lang, setLang] = useState("All");

  const list = useMemo(
    () =>
      titles.filter(
        (t) =>
          (cat === "All" || t.category === cat) &&
          (lang === "All" || t.languages.includes(lang)),
      ),
    [cat, lang],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <TopHeader />
      <main className="flex-1 space-y-3 p-4">
        <h1 className="text-xl font-black tracking-tight">Explore everything</h1>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          {(["All", ...categories] as const).map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)} label={c} />
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          {LANGUAGES.map((l) => (
            <Chip key={l} active={lang === l} onClick={() => setLang(l)} label={l} subtle />
          ))}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl bg-surface p-8 text-center glass-border">
            <SearchX className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-3 text-sm font-black">Nothing matches those filters</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different category or language.
            </p>
            <button
              onClick={() => {
                setCat("All");
                setLang("All");
              }}
              className="press mt-4 rounded-xl gradient-primary px-4 py-2.5 text-xs font-black text-primary-foreground shadow-glow"
            >
              Clear filters
            </button>
          </div>
        ) : (
          list.map((t) => (
            <Link
              key={t.id}
              to="/title/$id"
              params={{ id: t.id }}
              className="press flex gap-3 rounded-2xl bg-surface p-3 glass-border shadow-card"
            >
              <img
                src={t.poster}
                alt={t.name}
                loading="lazy"
                className="h-28 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold">{t.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.genres.join(" · ")}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.languages.join(", ")}</p>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  {t.rating}/10
                  <span className="text-primary">{inr(t.priceFrom)} onwards</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </main>
      <BottomNav />
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
  subtle,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`press shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? subtle
            ? "bg-primary/15 text-primary ring-1 ring-primary/40"
            : "gradient-primary text-primary-foreground shadow-glow"
          : "bg-surface text-muted-foreground glass-border"
      }`}
    >
      {label}
    </button>
  );
}
