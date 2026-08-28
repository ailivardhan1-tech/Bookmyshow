import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Draft = {
  titleId: string;
  theaterId: string;
  theaterName: string;
  date: string;
  time: string;
  format: string;
  screen: string;
  seats: { id: string; tier: string; price: number }[];
  fnb: Record<string, number>;
  promo: { code: string; discount: number } | null;
};

export type Booking = Draft & {
  ref: string;
  bookedAt: string;
  total: number;
  cancelled?: boolean;
};

const emptyDraft: Draft = {
  titleId: "",
  theaterId: "",
  theaterName: "",
  date: "",
  time: "",
  format: "",
  screen: "Audi 3",
  seats: [],
  fnb: {},
  promo: null,
};

const STORAGE_KEY = "bookgo.state.v1";

type Ctx = {
  city: string;
  setCity: (c: string) => void;
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  resetDraft: () => void;
  bookings: Booking[];
  confirmBooking: (total: number) => Booking;
  cancelBooking: (ref: string) => void;
};

const BookingContext = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState("Mumbai");
  const [draft, setDraftState] = useState<Draft>(emptyDraft);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Read persisted demo state after hydration so SSR and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { city?: string; bookings?: Booking[] };
        if (parsed.city) setCity(parsed.city);
        if (Array.isArray(parsed.bookings)) setBookings(parsed.bookings);
      }
    } catch {
      /* ignore corrupted local state */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ city, bookings }));
    } catch {
      /* storage unavailable */
    }
  }, [city, bookings, loaded]);

  const value = useMemo<Ctx>(
    () => ({
      city,
      setCity,
      draft,
      setDraft: (patch) => setDraftState((d) => ({ ...d, ...patch })),
      resetDraft: () => setDraftState(emptyDraft),
      bookings,
      confirmBooking: (total) => {
        const booking: Booking = {
          ...draft,
          total,
          ref: `BMX${Math.floor(100000 + Math.random() * 899999)}`,
          bookedAt: new Date().toISOString(),
        };
        setBookings((b) => [booking, ...b]);
        return booking;
      },
      cancelBooking: (ref) =>
        setBookings((b) => b.map((x) => (x.ref === ref ? { ...x, cancelled: true } : x))),
    }),
    [city, draft, bookings],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
