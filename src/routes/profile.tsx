import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, LogOut, Mail, Ticket } from "lucide-react";
import { toast } from "sonner";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQueryOptions, findTitle, inr } from "@/lib/catalog";
import { useBooking } from "@/lib/booking-store";
import { useCancelBooking, useMyBookings, type Booking } from "@/lib/bookings";
import { useAuth } from "@/lib/auth-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Bookings & Profile — bookgo" },
      {
        name: "description",
        content: "View your booked movie and event tickets, M-tickets and account details.",
      },
      { property: "og:title", content: "Your Bookings — bookgo" },
      {
        property: "og:description",
        content: "All your bookgo tickets and account details in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  component: Profile,
});

type Tab = "upcoming" | "past";

function Profile() {
  const { city } = useBooking();
  const catalog = useSuspenseQuery(catalogQueryOptions).data;
  const { data: bookings = [], isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();
  const { user, ready, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);

  const upcoming = bookings.filter((b) => !b.cancelled);
  const past = bookings.filter((b) => b.cancelled);
  const list = tab === "upcoming" ? upcoming : past;

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  };

  if (ready && !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopHeader />
        <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full gradient-primary text-primary-foreground">
            <Ticket className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-black">Sign in to see your tickets</h1>
          <p className="max-w-[260px] text-xs text-muted-foreground">
            Your bookings, M-tickets and offers stay with your account across devices.
          </p>
          <Link
            to="/auth"
            className="press mt-2 rounded-2xl gradient-primary px-6 py-3 text-xs font-black text-primary-foreground shadow-glow"
          >
            Sign in / Create account
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopHeader />
      <main className="flex-1 space-y-4 p-4">
        <section className="flex items-center gap-3 rounded-2xl bg-surface p-4 glass-border shadow-card">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full gradient-primary text-base font-black text-primary-foreground">
            {(user?.name ?? "G").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-black">{user?.name}</h1>
            <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            aria-label="Sign out"
            className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted-foreground glass-border"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </section>

        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-surface p-1 glass-border">
          {(
            [
              ["upcoming", `Upcoming (${upcoming.length})`],
              ["past", `Cancelled (${past.length})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`press rounded-xl py-2 text-xs font-black transition ${
                tab === id
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-surface glass-border" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl bg-surface p-6 text-center glass-border">
            <Ticket className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 text-sm font-black">
              {tab === "upcoming" ? "No bookings yet" : "Nothing cancelled"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {tab === "upcoming"
                ? `Your tickets will show up here once you book a show in ${city}.`
                : "Cancelled bookings will be listed here."}
            </p>
            {tab === "upcoming" && (
              <Link
                to="/explore"
                className="press mt-4 inline-flex rounded-xl gradient-primary px-4 py-2.5 text-xs font-black text-primary-foreground shadow-glow"
              >
                Explore shows
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((b) => {
              const title = findTitle(catalog, b.titleId);
              return (
                <div key={b.ref} className="rounded-2xl bg-surface p-4 glass-border shadow-card">
                  <Link
                    to="/ticket/$ref"
                    params={{ ref: b.ref }}
                    className="press flex items-start gap-3"
                  >
                    {title && (
                      <img
                        src={title.poster}
                        alt={title.name}
                        loading="lazy"
                        className="h-20 w-14 shrink-0 rounded-xl object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-bold">
                          {title?.name ?? b.theaterName}
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-primary">
                          {inr(b.total)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {b.theaterName}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {b.date} · {b.time} · {b.seats.map((s) => s.id).join(", ")}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-primary">
                        Ref {b.ref} <ChevronRight className="h-3 w-3" />
                      </p>
                    </div>
                  </Link>
                  {b.cancelled ? (
                    <p className="mt-3 rounded-xl bg-surface-2 py-2 text-center text-[11px] font-black uppercase tracking-wide text-muted-foreground">
                      Cancelled
                    </p>
                  ) : (
                    <button
                      onClick={() => setPendingCancel(b)}
                      className="press mt-3 w-full rounded-xl bg-surface-2 py-2 text-[11px] font-black text-destructive glass-border"
                    >
                      Cancel booking
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AlertDialog
        open={pendingCancel !== null}
        onOpenChange={(open) => !open && setPendingCancel(null)}
      >
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Seats {pendingCancel?.seats.map((s) => s.id).join(", ")} at{" "}
              {pendingCancel?.theaterName} will be released. Refunds take 5–7 working days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingCancel) {
                  const ref = pendingCancel.ref;
                  cancelBooking.mutate(ref, {
                    onSuccess: () => toast.success(`Booking ${ref} cancelled`),
                    onError: (e) => toast.error(e.message),
                  });
                }
                setPendingCancel(null);
              }}
            >
              Cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
}
