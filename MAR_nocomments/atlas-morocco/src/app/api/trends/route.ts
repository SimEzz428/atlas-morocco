import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const p = path.join(process.cwd(), "public", "data", "trends.json")
    const raw = await fs.readFile(p, "utf8")
    const data = JSON.parse(raw)
    return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=3600" } })
  } catch (error) {
    console.error("Trends API error:", error)
    return NextResponse.json({ error: "Failed to load trends data" }, { status: 500 })
  }
}