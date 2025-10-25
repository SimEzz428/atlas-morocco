"use client";

import { useEffect, useState } from "react";

type Wx = {
  current_weather?: { temperature: number; windspeed: number; weathercode: number };
};

export default function WeatherCard({ lat, lon }: { lat: number; lon: number }) {
  const [wx, setWx] = useState<Wx | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const r = await fetch(`/api/signals/weather?lat=${lat}&lon=${lon}`, { cache: "no-store" });
        const d = await r.json();
        if (live) setWx(d);
      } catch { /* noop */ }
    })();
    return () => { live = false; };
  }, [lat, lon]);

  const t = wx?.current_weather?.temperature;
  const w = wx?.current_weather?.windspeed;

  return (
    <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
      <div className="kpi">{t != null ? `${t.toFixed(1)}°C` : "—"}</div>
      <div className="kpi-label">Current Temp</div>
      <div className="mt-2 text-xs text-neutral-500">Wind {w != null ? `${w.toFixed(0)} km/h` : "—"}</div>
    </div>
  );
}