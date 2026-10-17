import { NextResponse } from "next/server"

function coord(v: string | null, min: number, max: number) {
  const n = v ? Number(v) : NaN
  return Number.isFinite(n) && n >= min && n <= max ? n : null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = coord(searchParams.get("lat"), -90, 90)
  const lon = coord(searchParams.get("lon"), -180, 180)
  if (lat === null || lon === null) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=4&timezone=auto`
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) throw new Error(`weather upstream failed (${res.status})`)
    const data = await res.json()
    return NextResponse.json(data, { headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600" } })
  } catch {
    return NextResponse.json({ error: "weather fetch failed" }, { status: 502 })
  }
}
