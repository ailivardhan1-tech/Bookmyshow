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
  const { user, ready, signIn, signUp } = useAuth();
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
      if (mode === "in") await signIn(email, password);
      else await signUp(name, email, password);
      toast.success(mode === "in" ? "Welcome back!" : "Account created");
      navigate({ to: "/profile", replace: true });
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

      <button
        onClick={() => navigate({ to: "/" })}
        className="press mx-auto mt-6 text-xs font-semibold text-muted-foreground"
      >
        Continue browsing without an account
      </button>
    </div>
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
