import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function num(v: string | null, fallback: number) {
  const n = v ? Number(v) : NaN
  return Number.isFinite(n) ? n : fallback
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = num(searchParams.get("lat"), 33.9716)
  const lon = num(searchParams.get("lon"), -6.8326)
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return NextResponse.json({ error: "weather fetch failed" }, { status: 500 })
  const data = await res.json()
  return NextResponse.json(data)
}