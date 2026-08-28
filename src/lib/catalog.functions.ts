import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public, read-only Data API client. The catalogue tables all carry a
 * `USING (true)` SELECT policy for `anon`, so no user session is required.
 */
function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

/** Everything the storefront needs, in a single round-trip. */
export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();

  const [titles, cast, theaters, shows, fnb, coupons, tiers, hero, cities] = await Promise.all([
    supabase.from("titles").select("*").order("sort_order"),
    supabase.from("cast_members").select("*").order("sort_order"),
    supabase.from("theaters").select("*").order("sort_order"),
    supabase.from("shows").select("*").order("sort_order"),
    supabase.from("fnb_items").select("*").order("sort_order"),
    supabase.from("coupons").select("*").eq("active", true).order("sort_order"),
    supabase.from("seat_tiers").select("*").order("sort_order"),
    supabase.from("hero_slides").select("*").order("sort_order"),
    supabase.from("cities").select("*").order("sort_order"),
  ]);

  const firstError =
    titles.error ??
    cast.error ??
    theaters.error ??
    shows.error ??
    fnb.error ??
    coupons.error ??
    tiers.error ??
    hero.error ??
    cities.error;
  if (firstError) throw new Error(firstError.message);

  return {
    titles: (titles.data ?? []).map((t) => ({
      ...t,
      cast: (cast.data ?? [])
        .filter((c) => c.title_id === t.id)
        .map((c) => ({ name: c.name, role: c.role, initials: c.initials })),
    })),
    theaters: (theaters.data ?? []).map((th) => ({
      ...th,
      shows: (shows.data ?? [])
        .filter((s) => s.theater_id === th.id)
        .map((s) => ({
          time: s.time_label,
          format: s.format,
          status: s.status as "available" | "filling" | "almost",
          price: s.price,
        })),
    })),
    fnbItems: fnb.data ?? [],
    coupons: coupons.data ?? [],
    seatTiers: (tiers.data ?? []).map((s) => ({
      name: s.name,
      price: s.price,
      rows: s.seat_rows,
      cols: s.cols,
    })),
    heroSlides: hero.data ?? [],
    cities: (cities.data ?? []).map((c) => c.name),
  };
});

/** Seats already booked for one specific show, so the seat map stays accurate. */
export const getTakenSeats = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z
      .object({
        titleId: z.string(),
        theaterId: z.string(),
        showDate: z.string(),
        showTime: z.string(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("booked_seats")
      .select("seat_id")
      .eq("title_id", data.titleId)
      .eq("theater_id", data.theaterId)
      .eq("show_date", data.showDate)
      .eq("show_time", data.showTime);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => r.seat_id);
  });
