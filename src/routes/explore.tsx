import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { inr, titles } from "@/lib/mock-data";

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
    ],
  }),
  component: Explore,
});

function Explore() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopHeader />
      <main className="flex-1 space-y-3 p-4">
        <h1 className="text-xl font-black tracking-tight">Explore everything</h1>
        {titles.map((t) => (
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
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t.languages.join(", ")}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {t.rating}/10
                <span className="text-primary">{inr(t.priceFrom)} onwards</span>
              </div>
            </div>
          </Link>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
