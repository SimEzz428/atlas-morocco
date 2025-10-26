// src/lib/abs-url.ts
export function absUrl(path: string) {
  // Prefer explicit APP URL, then Vercel URL (available at runtime), then NextAuth URL, then localhost
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  return new URL(path, base).toString();
}