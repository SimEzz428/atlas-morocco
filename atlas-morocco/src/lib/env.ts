import { z } from "zod"

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional()
})

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Atlas Morocco"),
  NEXT_PUBLIC_WEATHER_BASE: z.string().url().default("https://api.open-meteo.com/v1"),
  NEXT_PUBLIC_FX_BASE: z.string().url().default("https://api.exchangerate.host"),
  NEXT_PUBLIC_MAP_TILES: z.string().url().optional()
})

const _server = serverSchema.safeParse(process.env)
if (!_server.success) {
  console.error("Invalid server environment", _server.error.flatten().fieldErrors)
  throw new Error("Env validation failed (server)")
}
const _client = clientSchema.safeParse(process.env)
if (!_client.success) {
  console.error("Invalid client environment", _client.error.flatten().fieldErrors)
  throw new Error("Env validation failed (client)")
}

export const env = { ..._server.data, ..._client.data }