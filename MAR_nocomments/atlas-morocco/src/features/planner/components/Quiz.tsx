// src/features/planner/components/Quiz.tsx
"use client";

type CityMeta = { name?: string; slug?: string };

export default function Quiz({ city }: { city?: CityMeta }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Plan your day</h3>
        <span className="text-xs opacity-60">{city?.name ?? "—"}</span>
      </div>
      {/* Your form… */}
      {/* Example: citySlug prop may be undefined — your form should handle it */}
      {/* <YourForm citySlug={city?.slug} /> */}
    </div>
  );
}