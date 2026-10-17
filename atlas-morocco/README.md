# Atlas Morocco

A Morocco travel planner built with Next.js. Browse ten cities and 130 places, add the ones you like to a trip, and the planner splits them into days, orders them into the shortest route and estimates time and entry fees. Signed-in users get plans and favorite cities saved to their account, and any trip can be shared as a read-only link.

## Stack

- Next.js 16 (App Router), React 18, Tailwind CSS
- NextAuth (email + password, JWT sessions) with Prisma on PostgreSQL
- Leaflet + OpenStreetMap for maps, Open-Meteo for weather, open.er-api.com for exchange rates
- Playwright end-to-end tests

## Getting started

```bash
cd atlas-morocco
npm install                 # also runs `prisma generate`
cp .env.example .env.local  # then fill in the values
npm run db:migrate          # applies prisma/migrations to DATABASE_URL
npm run dev                 # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | yes | Signs session tokens; generate one with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | in production | Public URL of the site, e.g. `https://your-app.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | no | Base URL for Open Graph links; defaults to the Vercel URL |

No Unsplash key is needed at runtime: city photos are curated in `src/data/cityImages.ts`.

## Project layout

- `src/data/cities.ts`, `src/data/places.ts`: city guides and places (the single source of truth for city content)
- `src/data/cityImages.ts`: curated photos with photographer credits
- `src/features/plan/usePlan.ts`: the trip plan store (localStorage + automatic sync to the account)
- `src/features/planner/`: planner UI, route optimization, day splitting and share-link encoding
- `src/app/api/`: route handlers (`plans`, `favorites`, `me`, `auth/register`, `cities`, `weather`, `fx`)
- `tests/e2e/`: Playwright tests

## Checks

```bash
npm run type-check
npm run lint
npm run build && npm run test:e2e   # needs DATABASE_URL and NEXTAUTH_SECRET
```

CI (`.github/workflows/ci.yml` at the repository root) runs all of these against a throwaway Postgres on every push and pull request to `main`.

## Editing content

- **Places**: edit `src/data/places.ts`. Keep one entry per real-world place, with its own coordinates (the planner's distances and the maps depend on them). Places more than ~25 km from the city should use the `daytrip` category.
- **Photos**: edit `src/data/cityImages.ts`. Check each photo really shows that city; Unsplash search results for one city often include others.
