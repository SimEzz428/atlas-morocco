import { z } from "zod"

export const PlannerParamsSchema = z.object({
  days: z.number().int().min(1).max(21),
  startCity: z.string().optional(),
  budget: z.enum(["low", "mid", "high"]),
  pace: z.enum(["chill", "balanced", "packed"]),
  interests: z.record(z.string(), z.number().min(0).max(100)).refine(v => Object.keys(v).length > 0),
  sustainabilityBias: z.number().min(0).max(1).default(0.5),
  weatherAware: z.boolean().default(true),
  fxAware: z.boolean().default(true),
  locale: z.enum(["en", "fr", "ar"]).default("en")
})
export type PlannerParams = z.infer<typeof PlannerParamsSchema>