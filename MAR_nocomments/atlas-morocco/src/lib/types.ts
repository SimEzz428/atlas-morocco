export type Locale = "en" | "fr" | "ar"

export type Interest =
  | "food"
  | "handicrafts"
  | "architecture"
  | "history"
  | "nature"
  | "surf"

export type PlannerParams = {
  days: number
  startCity?: string
  budget: "low" | "mid" | "high"
  pace: "chill" | "balanced" | "packed"
  interests: Partial<Record<Interest, number>>
  sustainabilityBias?: number
  weatherAware?: boolean
  fxAware?: boolean
  locale?: Locale
}

export type PlanLeg = {
  fromId: string
  toId: string
  driveKm: number
  driveMin: number
}

export type PlanDayItem = {
  id: string
  name: string
  lat: number
  lon: number
  category: string
  startMin?: number
  endMin?: number
  visitMin: number
  reason: string[]
}

export type PlanVariant = {
  label: "Fastest" | "Balanced" | "Deep Culture"
  totalKm: number
  totalDriveMin: number
  days: { items: PlanDayItem[]; legs: PlanLeg[] }[]
}