import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type Ctx = {
  user: AppUser | null;
  /** False until persisted state has been read, so guards don't flash. */
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const STORAGE_KEY = "bookgo.auth.v1";

const AuthContext = createContext<Ctx | null>(null);

/**
 * Local-only auth for the demo build. The surface (user / signIn / signUp /
 * signOut) is deliberately shaped like Supabase auth so the backend swap is a
 * drop-in replacement.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AppUser);
    } catch {
      /* ignore corrupted local state */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [user, ready]);

  const value = useMemo<Ctx>(
    () => ({
      user,
      ready,
      signIn: async (email, password) => {
        if (!email.includes("@")) throw new Error("Enter a valid email address.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        setUser({
          id: email.toLowerCase(),
          email: email.toLowerCase(),
          name: email.split("@")[0] ?? "Guest",
        });
      },
      signUp: async (name, email, password) => {
        if (name.trim().length < 2) throw new Error("Please enter your name.");
        if (!email.includes("@")) throw new Error("Enter a valid email address.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        setUser({ id: email.toLowerCase(), email: email.toLowerCase(), name: name.trim() });
      },
      signOut: () => setUser(null),
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
