export type PlainParams = {
  days: number
  budget: "low" | "mid" | "high"
  pace: "chill" | "balanced" | "packed"
  interests: Record<string, number>
  sustainabilityBias: number
  weatherAware?: boolean
  fxAware?: boolean
  locale?: "en" | "fr" | "ar"
  startCity?: string
}

export function encodeParams(p: PlainParams) {
  const q = new URLSearchParams()
  q.set("d", String(p.days))
  q.set("b", p.budget)
  q.set("p", p.pace)
  q.set("sb", String(p.sustainabilityBias))
  q.set("i", btoa(encodeURIComponent(JSON.stringify(p.interests))))
  if (p.startCity) q.set("sc", p.startCity)
  return q.toString()
}

export function decodeParams(search: string): PlainParams | null {
  const q = new URLSearchParams(search)
  if (!q.get("d") || !q.get("b") || !q.get("p") || !q.get("i")) return null
  const interests = JSON.parse(decodeURIComponent(atob(q.get("i")!)))
  return {
    days: Number(q.get("d")),
    budget: q.get("b") as any,
    pace: q.get("p") as any,
    interests,
    sustainabilityBias: Number(q.get("sb") ?? 0.5),
    startCity: q.get("sc") ?? undefined,
    weatherAware: true,
    fxAware: true,
    locale: "en"
  }
}