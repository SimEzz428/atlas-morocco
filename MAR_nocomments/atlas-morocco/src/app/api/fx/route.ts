import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Primary provider
    const res = await fetch("https://api.exchangerate.host/latest?base=MAD&symbols=USD,EUR", {
      next: { revalidate: 43200 },
      cache: "force-cache",
    })
    if (res.ok) {
      const data = await res.json()
      const usd = Number(data?.rates?.USD)
      const eur = Number(data?.rates?.EUR)
      if (Number.isFinite(usd) && Number.isFinite(eur)) {
        const out = NextResponse.json({ base: "MAD", date: data?.date || new Date().toISOString().slice(0,10), rates: { USD: usd, EUR: eur }, provider: "exchangerate.host" })
        out.headers.set("Cache-Control", "s-maxage=43200, stale-while-revalidate=86400")
        return out
      }
    }
  } catch {}

  try {
    // Fallback provider
    const res = await fetch("https://open.er-api.com/v6/latest/MAD", { next: { revalidate: 43200 }, cache: "force-cache" })
    if (!res.ok) throw new Error("fallback fx upstream failed")
    const data = await res.json()
    const usd = Number(data?.rates?.USD)
    const eur = Number(data?.rates?.EUR)
    if (!Number.isFinite(usd) || !Number.isFinite(eur)) throw new Error("fallback rates missing")
    const out = NextResponse.json({ base: "MAD", date: new Date(data?.time_last_update_utc || Date.now()).toUTCString(), rates: { USD: usd, EUR: eur }, provider: "er-api" })
    out.headers.set("Cache-Control", "s-maxage=43200, stale-while-revalidate=86400")
    return out
  } catch (e) {
    return NextResponse.json({ error: "fx fetch failed" }, { status: 500 })
  }
}