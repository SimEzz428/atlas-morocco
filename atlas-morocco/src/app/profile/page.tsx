"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, CalendarDays, LogOut, Bookmark, Heart, ChevronRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

type Profile = {
  user: { name: string | null; email: string | null; createdAt: string };
  stats: { planCount: number; placeCount: number; cityCount: number; favoriteCount: number };
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin?callbackUrl=%2Fprofile");
      return;
    }
    if (status !== "authenticated") return;
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" aria-label="Loading" />
      </div>
    );
  }

  const name = profile?.user.name ?? session?.user?.name ?? "Traveler";
  const email = profile?.user.email ?? session?.user?.email ?? "";
  const stats = profile?.stats;
  const memberSince = profile
    ? new Date(profile.user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "…";

  return (
    <div className="container-pro py-10 sm:py-14">
      <PageHeader eyebrow="Your account" title="Profile" />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card card-pad">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-brand-600 font-display text-2xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="h4 truncate">{name}</p>
                <p className="flex items-center gap-1.5 truncate text-sm text-stone-600">
                  <Mail className="h-4 w-4 flex-none" />
                  {email}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-stone-500">
                  <CalendarDays className="h-4 w-4 flex-none" />
                  Member since {memberSince}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="h4 mb-3">Your activity</h2>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="profile-stats">
              {[
                { label: "Saved plans", value: stats?.planCount },
                { label: "Places planned", value: stats?.placeCount },
                { label: "Cities planned", value: stats?.cityCount },
                { label: "Favorite cities", value: stats?.favoriteCount },
              ].map(({ label, value }) => (
                <div key={label} className="card flex flex-col-reverse p-4">
                  <dt className="text-sm text-stone-500">{label}</dt>
                  <dd className="font-display text-2xl font-bold text-stone-900">{value ?? "…"}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="card self-start p-2">
          {[
            { href: "/saved-plans", label: "My saved plans", icon: Bookmark },
            { href: "/favorites", label: "My favorite cities", icon: Heart },
            { href: "/plan", label: "Open the planner", icon: MapPin },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-stone-700 transition-colors hover:bg-stone-50">
              <Icon className="h-5 w-5 text-stone-400" />
              <span className="flex-1 font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-stone-300" />
            </Link>
          ))}
          <div className="my-1 border-t border-stone-100" />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </aside>
      </div>
    </div>
  );
}
