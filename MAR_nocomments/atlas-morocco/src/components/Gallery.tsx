"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Gallery({ query }: { query: string }) {
  const [items, setItems] = useState<Array<{ id: string; src: string; alt: string; link?: string; author?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/photos?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(j => mounted && setItems(j.photos || []))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [query]);

  if (loading) {
    return <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) =>
        <div key={i} className="h-32 md:h-40 rounded-xl bg-black/5 dark:bg-white/10 animate-pulse" />
      )}
    </div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((p) => (
        <a key={p.id} href={p.link} target="_blank" rel="noreferrer" className="group">
          <div className="relative h-32 md:h-40 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <img src={p.src} alt={p.alt} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
          </div>
          {p.author && <p className="text-xs opacity-60 mt-1">by {p.author}</p>}
        </a>
      ))}
    </div>
  );
}