import Link from "next/link";
import { cn } from "@/lib/utils";

// Eight-pointed star (khatam), a motif found in Moroccan zellige tilework.
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("logo-mark h-9 w-9", className)} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
        <rect x="5.5" y="5.5" width="13" height="13" rx="0.5" />
        <rect x="5.5" y="5.5" width="13" height="13" rx="0.5" transform="rotate(45 12 12)" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

export function Logo({ tone = "dark", tagline = false }: { tone?: "dark" | "light"; tagline?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Atlas Morocco home">
      <LogoMark className="transition-transform group-hover:rotate-45 duration-300" />
      <span className="leading-tight">
        <span className={cn("block whitespace-nowrap font-display text-lg font-bold tracking-tight", tone === "dark" ? "text-stone-900" : "text-white")}>
          Atlas Morocco
        </span>
        {tagline && (
          <span className={cn("block text-xs", tone === "dark" ? "text-stone-500" : "text-stone-400")}>Plan unforgettable journeys</span>
        )}
      </span>
    </Link>
  );
}
