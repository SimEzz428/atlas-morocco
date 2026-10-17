"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { safeCallbackUrl } from "@/lib/redirect";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") ? "Incorrect email or password. Please try again." : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // redirect: false keeps NextAuth from bouncing through /api/auth/error on failure
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.ok && !result.error) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }
      setError("Incorrect email or password. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="h1">Sign in to Atlas Morocco</h1>
          <p className="lead mt-2">Access your saved trip plans and sync across devices</p>
        </div>

        <Card>
          <div className="card-pad">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div role="alert" className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-stone-600">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="font-medium text-brand-600 hover:text-brand-500"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <h2 className="text-sm font-medium text-stone-900 mb-4">Why sign in?</h2>
          <div className="grid grid-cols-1 gap-3 text-sm text-stone-600">
            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              <span>Save trip plans to your account</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Access them from any device</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Keep your favorite cities in one place</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <SignInForm />
    </Suspense>
  );
}
