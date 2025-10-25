// src/features/planner/components/PlanCard.tsx
"use client";
import Quiz from "./Quiz";

export default function PlanCard({ city }: { city?: { slug?: string; name?: string } }) {
  return (
    <div className="rounded-2xl border p-5">
      <Quiz city={city} />
    </div>
  );
}