"use client";

import { useMemo, useState } from "react";
import { usePlanContext } from "../PlanProvider";
import Link from "next/link";
import { Save, Heart } from "lucide-react";

export default function PlannerScreen() {
  const { plan, setMeta, movePlace, removePlace, clear, savePlan } = usePlanContext();
  const [title, setTitle] = useState(plan.title);
  const [days, setDays] = useState(plan.days);
  const [isSaving, setIsSaving] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<number, typeof plan.items>();
    for (let d = 1; d <= days; d++) map.set(d, []);
    for (const it of plan.items) {
      const d = Math.min(Math.max(it.day || 1, 1), days);
      map.get(d)!.push(it);
    }
    return map;
  }, [plan.items, days]);

  const handleSavePlan = async () => {
    if (plan.items.length === 0) {
      alert("Add some places to your plan before saving!");
      return;
    }

    setIsSaving(true);
    try {
      await savePlan(title);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="container mx-auto max-w-5xl px-5 py-8 space-y-8">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Your plan</h1>
          <p className="text-sm text-neutral-500">
            Save places as you browse cities, then organize them by day.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSavePlan}
            disabled={isSaving || plan.items.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Plan"}
          </button>
          <Link
            href="/cities"
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm"
          >
            + Explore cities
          </Link>
        </div>
      </header>

      {/* Meta */}
      <section className="rounded-2xl border p-5 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="space-y-2">
            <span className="text-xs text-neutral-500">Trip title</span>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setMeta({ title })}
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs text-neutral-500">Days</span>
            <input
              type="number"
              min={1}
              max={30}
              className="w-full rounded-xl border px-3 py-2"
              value={days}
              onChange={(e) => setDays(Number(e.target.value || 1))}
              onBlur={() => setMeta({ days })}
            />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => clear()}
            className="text-sm rounded-full border px-3 py-1"
          >
            Clear plan
          </button>
        </div>
      </section>

      {/* Days */}
      <section className="space-y-6">
        {[...grouped.entries()].map(([day, items]) => (
          <div key={day} className="space-y-3">
            <h2 className="text-lg font-medium">Day {day}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {items.length === 0 && (
                <div className="rounded-xl border p-4 text-sm text-neutral-500">
                  Nothing for this day yet. Add places from city pages.
                </div>
              )}
              {items.map((p) => (
                <div key={p.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-neutral-500">{p.city}</div>
                    </div>
                    <button
                      onClick={() => removePlace(p.id)}
                      aria-label="Remove"
                      className="text-xs text-neutral-500 hover:text-neutral-800"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Move to:</span>
                    {[...Array(days)].map((_, i) => {
                      const d = i + 1;
                      return (
                        <button
                          key={d}
                          onClick={() => movePlace(p.id, d)}
                          className={
                            "h-8 w-8 rounded-full border text-xs " +
                            (d === p.day
                              ? "bg-neutral-900 text-white"
                              : "bg-white")
                          }
                          title={`Move to day ${d}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}