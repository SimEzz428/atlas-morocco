import { NextResponse } from "next/server"

// Revalidated every 12 hours; the upstream only updates once a day.
export const revalidate = 43200

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/MAD", { next: { revalidate: 43200 } })
    if (!res.ok) throw new Error(`fx upstream failed (${res.status})`)
    const data = await res.json()
    const usd = Number(data?.rates?.USD)
    const eur = Number(data?.rates?.EUR)
    if (!Number.isFinite(usd) || !Number.isFinite(eur) || usd <= 0 || eur <= 0) throw new Error("fx rates missing")

    const out = NextResponse.json({
      base: "MAD",
      date: new Date(data?.time_last_update_utc || Date.now()).toISOString(),
      // 1 MAD in each currency
      rates: { USD: usd, EUR: eur },
      // MAD you get for 1 unit of each currency
      madPer: { USD: 1 / usd, EUR: 1 / eur },
      provider: "open.er-api.com",
    })
    out.headers.set("Cache-Control", "s-maxage=43200, stale-while-revalidate=86400")
    return out
  } catch {
    return NextResponse.json({ error: "fx fetch failed" }, { status: 502 })
  }
}
