"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
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
    <AuthShell title="Welcome back" subtitle="Sign in to see your saved plans and favorite cities.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Your password"
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary btn-lg w-full">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        New to Atlas Morocco?{" "}
        <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-brand-700 hover:text-brand-800">
          Create an account
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-stone-500">
        You can also plan without an account; your trip is kept on this device.
      </p>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)]" />}>
      <SignInForm />
    </Suspense>
  );
}
