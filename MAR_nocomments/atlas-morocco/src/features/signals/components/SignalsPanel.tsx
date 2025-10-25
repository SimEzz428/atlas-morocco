"use client";

import { useEffect, useState } from "react";

type Fx = { rate: number; base: string; quote: string; date?: string };
type Wx = { temp: number; wind: number };
type Props = { lat: number; lon: number };

export default function SignalsPanel({ lat, lon }: Props) {
  console.log('SignalsPanel rendered with lat:', lat, 'lon:', lon);
  
  const [fx, setFx] = useState<Fx | null>(null);
  const [wx, setWx] = useState<Wx | null>(null);
  const [fxErr, setFxErr] = useState<string | null>(null);
  const [wxErr, setWxErr] = useState<string | null>(null);

  useEffect(() => {
    // FX (USD→MAD as example)
    fetch(`/api/signals/fx?base=USD&quote=MAD`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((d) => setFx({ rate: d.rate, base: d.base, quote: d.quote, date: d.date }))
      .catch((e) => setFxErr(String(e)));
  }, []);

  useEffect(() => {
    if (typeof lat !== "number" || typeof lon !== "number") {
      setWxErr("coords-missing");
      return;
    }
    fetch(`/api/signals/weather?lat=${lat}&lon=${lon}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((d) => setWx({ temp: d.current_weather?.temperature ?? d.temp, wind: d.current_weather?.windspeed ?? d.wind }))
      .catch((e) => setWxErr(String(e)));
  }, [lat, lon]);

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* FX Card */}
      <div className="card card-pad" data-testid="fx-card">
        <div className="kpi-label">Live FX (cached 1h)</div>
        {fx ? (
          <>
            <div className="kpi">{fx.rate.toFixed(3)}</div>
            <div className="text-xs text-neutral-500">
              {fx.base} → {fx.quote}{fx.date ? ` · ${fx.date}` : ""}
            </div>
          </>
        ) : fxErr ? (
          <div className="text-sm text-red-500">error: FX {fxErr}</div>
        ) : (
          <div className="text-sm text-neutral-500">Loading…</div>
        )}
      </div>

      {/* Weather Card */}
      <div className="card card-pad" data-testid="weather-card">
        <div className="kpi-label">Current temp</div>
        {wx ? (
          <>
            <div className="kpi">{Math.round(wx.temp)}°C</div>
            <div className="text-xs text-neutral-500">Wind {Math.round(wx.wind)} km/h</div>
          </>
        ) : wxErr ? (
          <div className="text-sm text-red-500">error: WX {wxErr}</div>
        ) : (
          <div className="text-sm text-neutral-500">Loading…</div>
        )}
      </div>
    </div>
  );
}