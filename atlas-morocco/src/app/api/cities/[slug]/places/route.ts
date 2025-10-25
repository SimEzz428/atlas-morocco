import { NextResponse } from "next/server"
const API = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const r = await fetch(`${API}/cities/${slug}/places`, { cache: "no-store" })
  const body = await r.text()
  return new NextResponse(body, { headers: { "content-type": "application/json" } })
}