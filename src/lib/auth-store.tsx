import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | undefined;
};

type Ctx = {
  user: AppUser | null;
  session: Session | null;
  /** False until the session has been restored, so guards don't flash. */
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  /** Resolves to true when a session started immediately, false when a
   *  confirmation email was sent instead. */
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

function toAppUser(session: Session | null): AppUser | null {
  const u = session?.user;
  if (!u) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    (typeof meta["full_name"] === "string" && meta["full_name"]) ||
    (typeof meta["name"] === "string" && meta["name"]) ||
    u.email?.split("@")[0] ||
    "Guest";
  return {
    id: u.id,
    email: u.email ?? "",
    name: String(name),
    phone: u.phone || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (name.trim().length < 2) throw new Error("Please enter your name.");
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/profile`,
        data: { full_name: name.trim() },
      },
    });
    if (error) throw new Error(error.message);
    return Boolean(data.session);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { lovable } = await import("@/integrations/lovable/index");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) throw new Error(result.error.message ?? "Google sign-in failed.");
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      user: toAppUser(session),
      session,
      ready,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [session, ready, signIn, signUp, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
