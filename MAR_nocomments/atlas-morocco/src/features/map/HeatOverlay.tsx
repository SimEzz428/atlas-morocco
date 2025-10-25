"use client";
import { useMemo } from "react";

type Place = { lat: number; lon: number; category?: string };
type Props = { places: Place[]; project: (lat: number, lon: number) => { x: number; y: number } };

export default function HeatOverlay({ places, project }: Props) {
  const points = useMemo(() => places.slice(0, 200), [places]);

  return (
    <svg className="pointer-events-none absolute inset-0" aria-hidden>
      <defs>
        <radialGradient id="heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,80,0,.35)" />
          <stop offset="100%" stopColor="rgba(255,80,0,0)" />
        </radialGradient>
      </defs>
      {points.map((p, i) => {
        const { x, y } = project(p.lat, p.lon);
        return <circle key={i} cx={x} cy={y} r={28} fill="url(#heat)" />;
      })}
    </svg>
  );
}