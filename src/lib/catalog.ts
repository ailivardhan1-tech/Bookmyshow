import { queryOptions } from "@tanstack/react-query";
import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import hero1 from "@/assets/hero-1.jpg";
import { getCatalog, getTakenSeats } from "./catalog.functions";

/** Artwork ships with the bundle; the database stores a stable key per image. */
const IMAGES: Record<string, string> = {
  "poster-1": poster1,
  "poster-2": poster2,
  "poster-3": poster3,
  "poster-4": poster4,
  "event-1": event1,
  "event-2": event2,
  "event-3": event3,
  "hero-1": hero1,
};

export function image(key: string) {
  return IMAGES[key] ?? poster1;
}

export type Category = string;

export type CastMember = { name: string; role: string; initials: string };

export type Title = {
  id: string;
  kind: "movie" | "event";
  category: Category;
  name: string;
  poster: string;
  backdrop: string;
  languages: string[];
  formats: string[];
  rating: number;
  votes: string;
  certification: string;
  duration: string;
  release: string;
  genres: string[];
  synopsis: string;
  cast: CastMember[];
  venue?: string | undefined;
  dateLabel?: string | undefined;
  priceFrom: number;
};

export type Theater = {
  id: string;
  name: string;
  area: string;
  distance: string;
  cancellable: boolean;
  amenities: string[];
  shows: { time: string; format: string; status: "available" | "filling" | "almost"; price: number }[];
};

export type FnbItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
};

export type Coupon = { code: string; label: string; discount: number };

export type SeatTier = { name: string; price: number; rows: string[]; cols: number };

export type HeroSlide = {
  id: string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
};

export type Catalog = {
  titles: Title[];
  theaters: Theater[];
  fnbItems: FnbItem[];
  coupons: Coupon[];
  seatTiers: SeatTier[];
  heroSlides: HeroSlide[];
  cities: string[];
  categories: Category[];
};

const CATEGORY_ORDER = ["Movies", "Events", "Plays", "Sports", "Stand-up Comedy"];

/** Maps database rows onto the shapes the UI already renders. */
function toCatalog(raw: Awaited<ReturnType<typeof getCatalog>>): Catalog {
  const titles: Title[] = raw.titles.map((t) => ({
    id: t.id,
    kind: t.kind as "movie" | "event",
    category: t.category,
    name: t.name,
    poster: image(t.poster_key),
    backdrop: image(t.backdrop_key),
    languages: t.languages,
    formats: t.formats,
    rating: Number(t.rating),
    votes: t.votes,
    certification: t.certification,
    duration: t.duration,
    release: t.release_label,
    genres: t.genres,
    synopsis: t.synopsis,
    cast: t.cast,
    venue: t.venue ?? undefined,
    dateLabel: t.date_label ?? undefined,
    priceFrom: t.price_from,
  }));

  const present = new Set(titles.map((t) => t.category));
  const categories = [
    ...CATEGORY_ORDER.filter((c) => present.has(c)),
    ...[...present].filter((c) => !CATEGORY_ORDER.includes(c)).sort(),
  ];

  return {
    titles,
    theaters: raw.theaters.map((th) => ({
      id: th.id,
      name: th.name,
      area: th.area,
      distance: th.distance,
      cancellable: th.cancellable,
      amenities: th.amenities,
      shows: th.shows,
    })),
    fnbItems: raw.fnbItems.map((f) => ({
      id: f.id,
      category: f.category,
      name: f.name,
      description: f.description,
      price: f.price,
      emoji: f.emoji,
    })),
    coupons: raw.coupons.map((c) => ({ code: c.code, label: c.label, discount: c.discount })),
    seatTiers: raw.seatTiers,
    heroSlides: raw.heroSlides.map((h) => ({
      id: h.title_id,
      image: image(h.image_key),
      tag: h.tag,
      title: h.title,
      subtitle: h.subtitle,
    })),
    cities: raw.cities,
    categories,
  };
}

export const catalogQueryOptions = queryOptions({
  queryKey: ["catalog"],
  queryFn: async () => toCatalog(await getCatalog()),
  staleTime: 5 * 60 * 1000,
});

export const takenSeatsQueryOptions = (input: {
  titleId: string;
  theaterId: string;
  showDate: string;
  showTime: string;
}) =>
  queryOptions({
    queryKey: ["taken-seats", input],
    queryFn: () => getTakenSeats({ data: input }),
    enabled: Boolean(input.titleId && input.theaterId && input.showDate && input.showTime),
  });

export function findTitle(catalog: Catalog, id: string) {
  return catalog.titles.find((t) => t.id === id);
}

export function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
