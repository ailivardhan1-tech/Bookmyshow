import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth-store";
import type { Draft } from "./booking-store";

export type Booking = Draft & {
  ref: string;
  bookedAt: string;
  total: number;
  cancelled: boolean;
};

type Row = {
  ref: string;
  title_id: string;
  theater_id: string;
  theater_name: string;
  show_date: string;
  show_time: string;
  format: string;
  screen: string;
  seats: unknown;
  fnb: unknown;
  coupon_code: string | null;
  discount: number;
  total: number;
  cancelled: boolean;
  booked_at: string;
};

function toBooking(r: Row): Booking {
  return {
    ref: r.ref,
    titleId: r.title_id,
    theaterId: r.theater_id,
    theaterName: r.theater_name,
    date: r.show_date,
    time: r.show_time,
    format: r.format,
    screen: r.screen,
    seats: (r.seats ?? []) as Booking["seats"],
    fnb: (r.fnb ?? {}) as Record<string, number>,
    promo: r.coupon_code ? { code: r.coupon_code, discount: r.discount } : null,
    total: r.total,
    cancelled: r.cancelled,
    bookedAt: r.booked_at,
  };
}

/** Every booking belonging to the signed-in user. RLS keeps it owner-scoped. */
export function useMyBookings() {
  const { user, ready } = useAuth();
  return useQuery({
    queryKey: ["bookings", user?.id ?? "anon"],
    enabled: ready && Boolean(user),
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("booked_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data as Row[]).map(toBooking);
    },
  });
}

function makeRef() {
  return `BMX${Math.floor(100000 + Math.random() * 899999)}`;
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ draft, total }: { draft: Draft; total: number }): Promise<Booking> => {
      if (!user) throw new Error("Please sign in to complete your booking.");
      const ref = makeRef();

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          ref,
          title_id: draft.titleId,
          theater_id: draft.theaterId,
          theater_name: draft.theaterName,
          show_date: draft.date,
          show_time: draft.time,
          format: draft.format,
          screen: draft.screen,
          seats: draft.seats,
          fnb: draft.fnb,
          coupon_code: draft.promo?.code ?? null,
          discount: draft.promo?.discount ?? 0,
          total,
        })
        .select("*")
        .single();
      if (error) throw new Error(error.message);

      // Lock the seats so nobody else can pick them for the same show.
      if (draft.seats.length > 0) {
        const { error: seatError } = await supabase.from("booked_seats").insert(
          draft.seats.map((s) => ({
            booking_id: (data as { id: string }).id,
            title_id: draft.titleId,
            theater_id: draft.theaterId,
            show_date: draft.date,
            show_time: draft.time,
            seat_id: s.id,
          })),
        );
        if (seatError) {
          await supabase.from("bookings").delete().eq("ref", ref);
          throw new Error("Someone just took one of those seats. Please pick again.");
        }
      }

      return toBooking(data as Row);
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["taken-seats"] });
      queryClient.setQueryData(["booking", booking.ref], booking);
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ref: string) => {
      const { error } = await supabase.from("bookings").update({ cancelled: true }).eq("ref", ref);
      if (error) throw new Error(error.message);
      // Free the seats back up for other customers.
      const { data } = await supabase.from("bookings").select("id").eq("ref", ref).single();
      if (data) await supabase.from("booked_seats").delete().eq("booking_id", data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["taken-seats"] });
    },
  });
}

/** Single booking lookup used by the M-ticket screen. */
export function useBookingByRef(ref: string) {
  const { user, ready } = useAuth();
  return useQuery({
    queryKey: ["booking", ref],
    enabled: ready && Boolean(user) && Boolean(ref),
    queryFn: async (): Promise<Booking | null> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("ref", ref)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? toBooking(data as Row) : null;
    },
  });
}
