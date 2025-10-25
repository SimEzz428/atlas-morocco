"use client";

import { useEffect, useState } from "react";

export default function FxCard({ base, quote }: { base: string; quote: string }) {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(`/api/signals/fx?base=${base}&quote=${quote}`, { cache: "no-store" });
        const d = await r.json();
        if (mounted) setRate(d?.rate ?? null);
      } catch {}
    })();
    return () => { mounted = false; };
  }, [base, quote]);

  return (
    <div className="rounded-xl border border-black/5 dark:border-white/10 p-4">
      <div className="kpi">{rate ? rate.toFixed(3) : "—"}</div>
      <div className="kpi-label">{base} → {quote}</div>
      <div className="mt-2 text-xs text-neutral-500">Live FX (cached 1h)</div>
    </div>
  );
}