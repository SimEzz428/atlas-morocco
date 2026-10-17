"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Compass, Map as MapIcon, Heart, CalendarDays, User, Menu, X, ChevronDown, LogIn, LogOut, Bookmark } from "lucide-react";
import { Logo } from "@/components/Logo";
import { usePlanContext } from "@/features/plan/PlanProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/cities", label: "Cities", icon: Compass },
  { href: "/explore", label: "Map", icon: MapIcon },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { plan, isHydrated } = usePlanContext();
  const isSignedIn = status === "authenticated";
  const planCount = isHydrated ? plan.items.length : 0;

  // Close menus on navigation (adjusting state during render avoids an extra effect pass).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) setIsUserMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isUserMenuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const displayName = session?.user?.name || session?.user?.email || "Account";

  const planButton = (
    <Link href="/plan" className={cn("btn-primary btn-sm relative", isActive("/plan") && "bg-brand-700")}>
      <CalendarDays className="h-4 w-4" />
      <span className="hidden whitespace-nowrap sm:inline">My Trip</span>
      <span className="sr-only sm:hidden">My Trip</span>
      {planCount > 0 && (
        <span
          className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-brand-700"
          aria-label={`${planCount} places in your plan`}
          data-testid="plan-count"
        >
          {planCount}
        </span>
      )}
    </Link>
  );

  // z-index sits above Leaflet's panes and controls (up to 1000) so maps don't scroll over the header.
  return (
    <header className="sticky top-0 z-[1100] border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="container-pro">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn("btn-ghost btn-sm text-sm", isActive(href) && "bg-stone-100 text-stone-900")}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {planButton}
            {isSignedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-stone-100"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Account menu"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <ChevronDown className="h-4 w-4 text-stone-500" />
                </button>

                {isUserMenuOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-60 animate-fadeIn rounded-2xl border border-stone-200 bg-white p-1.5 shadow-lg">
                    <div className="mb-1 border-b border-stone-100 px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-stone-900">{session?.user?.name || "Signed in"}</p>
                      <p className="truncate text-xs text-stone-500">{session?.user?.email}</p>
                    </div>
                    <Link role="menuitem" href="/saved-plans" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-stone-50">
                      <Bookmark className="h-4 w-4 text-stone-500" />
                      My saved plans
                    </Link>
                    <Link role="menuitem" href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-stone-50">
                      <User className="h-4 w-4 text-stone-500" />
                      Profile
                    </Link>
                    <button
                      role="menuitem"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-stone-50"
                    >
                      <LogOut className="h-4 w-4 text-stone-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="btn-ghost btn-sm text-sm">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {planButton}
            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-xl p-2 transition-colors hover:bg-stone-100"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-stone-700" /> : <Menu className="h-6 w-6 text-stone-700" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="animate-fadeIn border-t border-stone-200 py-3 lg:hidden">
            <nav className="flex flex-col gap-0.5" aria-label="Mobile">
              {[{ href: "/", label: "Home", icon: Compass }, ...NAV_LINKS, { href: "/plan", label: "Plan Trip", icon: CalendarDays }].map(
                ({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-stone-700 transition-colors hover:bg-stone-50",
                      pathname === href && "bg-stone-100 font-semibold text-stone-900"
                    )}
                  >
                    <Icon className="h-5 w-5 text-stone-500" />
                    {label}
                  </Link>
                )
              )}
              <div className="my-2 border-t border-stone-100" />
              {isSignedIn ? (
                <>
                  <Link href="/saved-plans" className="flex items-center gap-3 rounded-xl px-3 py-3 text-stone-700 hover:bg-stone-50">
                    <Bookmark className="h-5 w-5 text-stone-500" />
                    My Plans
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-3 text-stone-700 hover:bg-stone-50">
                    <User className="h-5 w-5 text-stone-500" />
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-stone-700 hover:bg-stone-50"
                  >
                    <LogOut className="h-5 w-5 text-stone-500" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="flex items-center gap-3 rounded-xl px-3 py-3 text-stone-700 hover:bg-stone-50">
                  <LogIn className="h-5 w-5 text-stone-500" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
