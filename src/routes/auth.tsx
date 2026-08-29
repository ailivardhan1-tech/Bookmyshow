import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Create an Account — bookgo" },
      {
        name: "description",
        content:
          "Sign in to bookgo to book movie and event tickets, save your M-tickets and manage bookings.",
      },
      { property: "og:title", content: "Sign in to bookgo" },
      {
        property: "og:description",
        content: "Access your tickets, bookings and offers in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, ready, signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: "/profile", replace: true });
  }, [ready, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate({ to: "/profile", replace: true });
      } else {
        const signedIn = await signUp(name, email, password);
        if (signedIn) {
          toast.success("Account created");
          navigate({ to: "/profile", replace: true });
        } else {
          toast.success("Check your inbox to confirm your email, then sign in.");
          setMode("in");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <div className="text-3xl font-black tracking-tight">
          book<span className="text-primary">go</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Movies, events and live shows — booked in seconds.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-surface p-1 glass-border">
        {(["in", "up"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`press rounded-xl py-2.5 text-xs font-black transition ${
              mode === m
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground"
            }`}
          >
            {m === "in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "up" && (
          <Field icon={User} label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aili Sharma"
              autoComplete="name"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </Field>
        )}
        <Field icon={Mail} label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </Field>
        <Field icon={Lock} label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </Field>

        <button
          type="submit"
          disabled={busy}
          className="press flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary py-3.5 text-sm font-black text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await signInWithGoogle();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Google sign-in failed");
            setBusy(false);
          }
        }}
        className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-surface py-3.5 text-sm font-black glass-border disabled:opacity-60"
      >
        <GoogleMark /> Continue with Google
      </button>

      <button
        onClick={() => navigate({ to: "/" })}
        className="press mx-auto mt-6 text-xs font-semibold text-muted-foreground"
      >
        Continue browsing without an account
      </button>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
      />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
      />
    </svg>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-2xl bg-surface px-3 py-2.5 glass-border">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        {children}
      </span>
    </label>
  );
}
