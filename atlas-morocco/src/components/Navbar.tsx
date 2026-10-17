"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  MapPin,
  Compass,
  Calendar,
  User,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  Heart,
  Map as MapIcon,
  Bookmark,
} from "lucide-react";

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
  const isSignedIn = status === "authenticated";

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

  // z-index sits above Leaflet's panes and controls (up to 1000) so maps don't scroll over the header.
  return (
    <header className="sticky top-0 z-[1100]bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container-pro">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-slate-900">Atlas Morocco</span>
              <p className="text-xs text-slate-500 -mt-1 hidden sm:block">Plan Unforgettable Journeys</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`btn-ghost btn-sm ${isActive(href) ? "bg-slate-100 text-slate-900" : ""}`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/saved-plans"
                className={`btn-ghost btn-sm ${isActive("/saved-plans") ? "bg-slate-100 text-slate-900" : ""}`}
              >
                <Bookmark className="h-4 w-4" />
                My Plans
              </Link>
            )}
            <Link href="/plan" className="btn-primary btn-sm ml-2">
              <Calendar className="h-4 w-4" />
              Plan Trip
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {isSignedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Account menu"
                >
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm font-semibold text-amber-700">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{session?.user?.name || "Signed in"}</p>
                      <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                    </div>
                    <Link role="menuitem" href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link role="menuitem" href="/saved-plans" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">
                      <Bookmark className="h-4 w-4" />
                      My Plans
                    </Link>
                    <hr className="my-2" />
                    <button
                      role="menuitem"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="btn-secondary btn-sm">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {[{ href: "/", label: "Home", icon: MapPin }, ...NAV_LINKS, { href: "/plan", label: "Plan Trip", icon: Calendar }].map(
                ({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors ${
                      pathname === href ? "bg-slate-50 font-medium" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                )
              )}
              {isSignedIn && (
                <Link href="/saved-plans" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <Bookmark className="h-4 w-4" />
                  My Plans
                </Link>
              )}
              <hr className="my-2" />
              {isSignedIn ? (
                <>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <LogIn className="h-4 w-4" />
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
