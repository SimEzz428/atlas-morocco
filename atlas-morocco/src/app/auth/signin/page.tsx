"use client";

import { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Persist error or success message if present in URL
  useEffect(() => {
    const err = searchParams?.get("error");
    const message = searchParams?.get("message");
    if (err) {
      setError("Incorrect email or password. Please try again.");
    } else if (message) {
      setError(message); // We'll use the error state to show success message
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // prevent NextAuth from redirecting to /api/auth/error on failure
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/plan",
      });

      if (result && result.ok) {
        router.push(result.url ?? "/plan");
      } else {
        setError("Incorrect email or password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h2 className="h1">Sign in to Atlas Morocco</h2>
          <p className="lead mt-2">
            Access your saved trip plans and sync across devices
          </p>
        </div>

        {/* Sign In Form */}
        <Card>
          <div className="card-pad">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className={`px-4 py-3 rounded-lg ${
                  error.includes("successfully") 
                    ? "bg-green-50 border border-green-200 text-green-700" 
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                  <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                  <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="font-medium text-amber-600 hover:text-amber-500">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Why sign in?</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-slate-600">
            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              <span>Save trip plans to the cloud</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Access from any device</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Secure data storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
