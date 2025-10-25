"use client";

import Link from "next/link";

type Props = {
  city: {
    id: number;
    slug: string;
    name: string;
    lat: number;
    lon: number;
  };
};

export default function CityCard({ city }: Props) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="block rounded-xl border border-black/10 dark:border-white/10 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{city.name}</h3>
        <span className="text-xs text-muted-foreground">View</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {city.lat}, {city.lon}
      </p>
    </Link>
  );
}