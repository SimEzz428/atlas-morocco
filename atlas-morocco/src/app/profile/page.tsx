"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Calendar, Settings, LogOut, Bookmark, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  const name = profile?.user.name ?? session?.user?.name ?? "Traveler";
  const email = profile?.user.email ?? session?.user?.email ?? "";
  const stats = profile?.stats;

  return (
    <div className="bg-stone-50 min-h-[70vh]">
      <div className="container-pro py-8">
        <div className="mb-8">
          <h1 className="h1 text-stone-900">Profile</h1>
          <p className="text-stone-600">Your account and travel activity</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <div className="card-pad">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-2xl font-semibold text-brand-700">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{name}</p>
                      <p className="text-stone-600">{email}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-medium text-stone-700 mb-2">Full Name</span>
                      <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg">
                        <User className="h-4 w-4 text-stone-400" />
                        <span className="text-stone-900">{name}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-stone-700 mb-2">Email Address</span>
                      <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg">
                        <Mail className="h-4 w-4 text-stone-400" />
                        <span className="text-stone-900 truncate">{email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block text-sm font-medium text-stone-700 mb-2">Member Since</span>
                    <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-stone-400" />
                      <span className="text-stone-900">
                        {profile ? new Date(profile.user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "…"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="card-pad">
                <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
                <dl className="space-y-3" data-testid="profile-stats">
                  {[
                    { label: "Saved plans", value: stats?.planCount },
                    { label: "Places planned", value: stats?.placeCount },
                    { label: "Cities planned", value: stats?.cityCount },
                    { label: "Favorite cities", value: stats?.favoriteCount },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <dt className="text-stone-600">{label}</dt>
                      <dd className="font-semibold text-stone-900">{value ?? "…"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Card>

            <Card>
              <div className="card-pad">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account
                </h2>
                <div className="space-y-3">
                  <Link href="/saved-plans" className="btn-secondary w-full">
                    <Bookmark className="h-4 w-4" />
                    My Plans
                  </Link>
                  <Link href="/favorites" className="btn-secondary w-full">
                    <Heart className="h-4 w-4" />
                    My Favorites
                  </Link>
                  <Button variant="danger" onClick={() => signOut({ callbackUrl: "/" })} className="w-full">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
