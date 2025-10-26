// src/lib/abs-url.ts
import { headers } from "next/headers";

export function absUrl(path: string) {
  // Prefer explicit app URL, then Vercel's URL, then derive from request headers
  const explicitBase = process.env.NEXT_PUBLIC_APP_URL;
  const vercelBase = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

  if (explicitBase || vercelBase) {
    return new URL(path, explicitBase || vercelBase!).toString();
  }

  // Derive at runtime to avoid localhost during builds/ISR
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
    const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    const base = `${proto}://${host}`;
    return new URL(path, base).toString();
  } catch {
    // Fallback for non-request contexts
    return new URL(path, "http://localhost:3000").toString();
  }
}