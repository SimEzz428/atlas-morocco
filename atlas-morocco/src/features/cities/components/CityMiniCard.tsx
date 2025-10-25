"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

type City = { id: string; name: string; lat: number; lon: number; count: number; categories: Record<string, number> }

export default function CityMiniCard({ city, onHover, onLeave }: { city: City; onHover?: (c: City) => void; onLeave?: () => void }) {
  const [temp, setTemp] = useState<number | null>(null)
  useEffect(() => {
    fetch(`/api/weather?lat=${city.lat}&lon=${city.lon}`).then(r=>r.json()).then(d=>setTemp(d.temp ?? null)).catch(()=>{})
  }, [city.lat, city.lon])

  const tags = Object.entries(city.categories).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k)

  return (
    <Link
      href={`/cities/${city.id}`}
      className="block rounded-2xl border border-black/10 dark:border-white/10 p-4 hover:shadow-card transition"
      onMouseEnter={() => onHover?.(city)}
      onMouseLeave={() => onLeave?.()}
    >
      <div className="flex items-baseline justify-between">
        <div className="text-lg font-semibold">{city.name}</div>
        <div className="text-sm opacity-70">{temp!==null ? `${temp.toFixed(0)}°C` : "–"}</div>
      </div>
      <div className="text-sm opacity-70 mb-2">{city.count} places</div>
      <div className="flex flex-wrap gap-2">
        {tags.map(t=>(
          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">{t}</span>
        ))}
      </div>
    </Link>
  )
}