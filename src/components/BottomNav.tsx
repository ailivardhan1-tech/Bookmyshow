import { Link } from "@tanstack/react-router";
import { Home, Ticket, Sparkles, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Sparkles },
  { to: "/profile", label: "Bookings", icon: Ticket },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur">
      {items.map((it, i) => (
        <Link
          key={i}
          to={it.to}
          activeOptions={{ exact: it.to === "/" }}
          activeProps={{ className: "text-primary" }}
          inactiveProps={{ className: "text-muted-foreground" }}
          className="press flex flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-medium"
        >
          <it.icon className="h-5 w-5" />
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
