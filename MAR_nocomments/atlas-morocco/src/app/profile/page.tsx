"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Mail, Calendar, Settings, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container-pro py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="h1 text-slate-900">Profile</h1>
          <p className="text-slate-600">Manage your account and preferences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="md:col-span-2">
            <Card>
              <div className="card-pad">
                <h2 className="h2 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{session.user?.name || "User"}</h3>
                      <p className="text-slate-600">{session.user?.email}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900">{session.user?.name || "Not provided"}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900">{session.user?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-900">Recently joined</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Account Actions */}
          <div>
            <Card>
              <div className="card-pad">
                <h2 className="h2 mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Actions
                </h2>
                
                <div className="space-y-4">
                  <Button
                    onClick={handleSignOut}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <div className="card-pad">
                <h3 className="h3 mb-4">Your Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Trips Created</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Places Saved</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Cities Visited</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
