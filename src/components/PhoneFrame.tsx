import { useState, type ReactNode } from "react";
import { Monitor, Smartphone } from "lucide-react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  const [wide, setWide] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[oklch(0.16_0.03_265)]">
      <div className="mx-auto flex min-h-screen w-full justify-center">
        <div
          className={`relative w-full ${
            wide ? "max-w-5xl" : "max-w-[430px]"
          } bg-background shadow-[0_0_80px_-20px_oklch(0_0_0/0.9)] transition-[max-width] duration-300 lg:my-0`}
        >
          {children}
        </div>
      </div>

      <button
        onClick={() => setWide((w) => !w)}
        aria-label={wide ? "Switch to mobile view" : "Switch to desktop view"}
        className="press fixed bottom-6 right-6 z-50 hidden items-center gap-2 rounded-full bg-surface-2 px-4 py-3 text-xs font-semibold text-foreground shadow-card glass-border lg:flex"
      >
        {wide ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
        {wide ? "Mobile view" : "Desktop view"}
      </button>
    </div>
  );
}
