"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
  Heart
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container-pro">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-slate-900">Atlas Morocco</span>
              <p className="text-xs text-slate-500 -mt-1">Plan Unforgettable Journeys</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="btn-ghost btn-sm">
              Home
            </Link>
            <Link href="/cities" className="btn-ghost btn-sm">
              <Compass className="h-4 w-4" />
              Cities
            </Link>
            <Link href="/plan" className="btn-primary btn-sm">
              <Calendar className="h-4 w-4" />
              Plan Trip
            </Link>
            {status === "authenticated" && (
              <Link href="/saved-plans" className="btn-ghost btn-sm">
                <Calendar className="h-4 w-4" />
                My Plans
              </Link>
            )}
            <Link href="/favorites" className="btn-ghost btn-sm">
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
            <Link href="/explore" className="btn-ghost btn-sm">
              Explore
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {status === "authenticated" ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link href="/saved-plans" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50">
                      <Calendar className="h-4 w-4" />
                      My Plans
                    </Link>
                    <hr className="my-2" />
                    <button 
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/cities" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Compass className="h-4 w-4" />
                Cities
              </Link>
              <Link 
                href="/plan" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                Plan Trip
              </Link>
              {session && (
                <Link 
                  href="/saved-plans" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="h-4 w-4" />
                  My Plans
                </Link>
              )}
              <Link 
                href="/explore" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <hr className="my-2" />
              {session ? (
                <>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/signin" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
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