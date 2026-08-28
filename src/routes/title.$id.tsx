import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Play, Share2, Star, X, Heart, PenLine } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQueryOptions, findTitle, inr } from "@/lib/catalog";

export const Route = createFileRoute("/title/$id")({
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
        { title: `${t.name} — Tickets, Showtimes & Reviews | bookgo` },
        { name: "description", content: t.synopsis.slice(0, 155) },
        { property: "og:title", content: `${t.name} — Book tickets on bookgo` },
        { property: "og:description", content: t.synopsis.slice(0, 155) },
      ],
    };
  },
  component: Detail,
});

function Detail() {
  const { title } = Route.useLoaderData();
  const { titles } = useSuspenseQuery(catalogQueryOptions).data;
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [trailer, setTrailer] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex min-h-screen flex-col pb-24">
      <div className="relative">
        <img
          src={title.backdrop}
          alt={`${title.name} backdrop`}
          width={1024}
          height={576}
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <Link
            to="/"
            aria-label="Back"
            className="press grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button
              aria-label="Add to favourites"
              onClick={() => setLiked((l) => !l)}
              className="press grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur"
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`} />
            </button>
            <button
              aria-label="Share"
              className="press grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <button
          onClick={() => setTrailer(true)}
          className="press absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/55 p-4 backdrop-blur glass-border"
          aria-label="Play trailer"
        >
          <Play className="h-7 w-7 fill-primary text-primary" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-black leading-tight">{title.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground">
            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-foreground">
              {title.certification}
            </span>
            <span>{title.duration}</span>
            <span>·</span>
            <span>{title.release}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {title.genres.map((g) => (
              <span
                key={g}
                className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium glass-border"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <div className="flex items-center justify-between rounded-2xl bg-surface p-4 glass-border">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 fill-primary text-primary" />
            <div>
              <div className="text-lg font-black leading-none">{title.rating}/10</div>
              <div className="text-[11px] text-muted-foreground">
                {title.votes} votes
              </div>
            </div>
          </div>
          <button className="press flex items-center gap-1.5 rounded-xl bg-surface-2 px-3 py-2 text-xs font-bold">
            <PenLine className="h-3.5 w-3.5" /> Write a review
          </button>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-black uppercase tracking-wide">About</h2>
          <p className={`text-sm leading-relaxed text-muted-foreground ${expanded ? "" : "line-clamp-3"}`}>
            {title.synopsis}
          </p>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 text-xs font-bold text-primary"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-black uppercase tracking-wide">Cast & Crew</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {title.cast.map((c) => (
              <div key={c.name} className="w-20 shrink-0 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-lg font-black text-primary glass-border">
                  {c.initials}
                </div>
                <div className="mt-1.5 truncate text-[11px] font-semibold">{c.name}</div>
                <div className="truncate text-[10px] text-muted-foreground">{c.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-black uppercase tracking-wide">
            Top reviews
          </h2>
          <div className="space-y-2">
            {[
              { u: "Aditi S.", r: 9, t: "Absolutely worth the IMAX upgrade. Sound design is unreal." },
              { u: "Karthik R.", r: 8, t: "Slow first act, but the last 40 minutes are pure cinema." },
            ].map((rev) => (
              <div key={rev.u} className="rounded-2xl bg-surface p-3 glass-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{rev.u}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                    <Star className="h-3 w-3 fill-primary" /> {rev.r}/10
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{rev.t}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-black uppercase tracking-wide">You may also like</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {titles
              .filter((t) => t.id !== title.id)
              .map((t) => (
                <Link
                  key={t.id}
                  to="/title/$id"
                  params={{ id: t.id }}
                  className="press w-24 shrink-0"
                >
                  <img
                    src={t.poster}
                    alt={t.name}
                    loading="lazy"
                    className="aspect-[2/3] w-full rounded-xl object-cover"
                  />
                  <div className="mt-1 truncate text-[11px] font-semibold">{t.name}</div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-background/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground">Starting from</div>
            <div className="text-sm font-black">{inr(title.priceFrom)}</div>
          </div>
          <button
            onClick={() => navigate({ to: "/showtimes/$id", params: { id: title.id } })}
            className="press ml-auto flex-1 rounded-2xl gradient-primary py-3.5 text-sm font-black text-primary-foreground shadow-glow"
          >
            Book Tickets
          </button>
        </div>
      </div>

      {trailer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4">
          <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-surface glass-border">
            <div className="flex items-center justify-between p-3">
              <span className="text-sm font-bold">{title.name} · Official Trailer</span>
              <button aria-label="Close trailer" onClick={() => setTrailer(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="relative">
              <img src={title.backdrop} alt="" className="aspect-video w-full object-cover opacity-60" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="animate-pulse rounded-full bg-primary/90 p-4">
                  <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
                </div>
              </div>
            </div>
            <p className="p-3 text-xs text-muted-foreground">
              Trailer playback is simulated in this demo build.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
