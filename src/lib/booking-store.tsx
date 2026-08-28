import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** In-progress selection. Lives client-side until checkout writes it to the database. */
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

const STORAGE_KEY = "bookgo.state.v2";

type Ctx = {
  city: string;
  setCity: (c: string) => void;
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  resetDraft: () => void;
};

const BookingContext = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState("Mumbai");
  const [draft, setDraftState] = useState<Draft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);

  // Read the persisted city after hydration so SSR and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { city?: string };
        if (parsed.city) setCity(parsed.city);
      }
    } catch {
      /* ignore corrupted local state */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ city }));
    } catch {
      /* storage unavailable */
    }
  }, [city, loaded]);

  const value = useMemo<Ctx>(
    () => ({
      city,
      setCity,
      draft,
      setDraft: (patch) => setDraftState((d) => ({ ...d, ...patch })),
      resetDraft: () => setDraftState(emptyDraft),
    }),
    [city, draft],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
