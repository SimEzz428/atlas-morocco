// src/features/cities/components/Gallery.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type UnsplashItem = {
  id: string;
  src: string;
  link?: string;
  alt?: string;
  photographer?: string;
};

export default function Gallery({ cityName }: { cityName: string }) {
  const [images, setImages] = useState<UnsplashItem[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // try a richer query first, fall back to plain
        const queries = [
          `${cityName} morocco`,
          `${cityName} medina morocco`,
          `${cityName} travel morocco`,
        ];

        const batches = await Promise.all(
          queries.map((q) =>
            fetch(`/api/unsplash?q=${encodeURIComponent(q)}&per_page=6`).then(
              (r) => r.json()
            )
          )
        );

        const merged: UnsplashItem[] = [];
        for (const b of batches) {
          if (b?.images?.length) {
            for (const it of b.images) {
              if (!merged.find((m) => m.id === it.id)) merged.push(it);
            }
          }
        }

        if (!cancelled) setImages(merged.slice(0, 9));
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Failed to load photos");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [cityName]);

  if (err) {
    return <p className="text-sm text-muted-foreground">No photos.</p>;
  }

  if (!images) {
    return <p className="text-sm text-muted-foreground">Loading photos…</p>;
  }

  if (images.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {images.map((img) => {
        const content = (
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border">
            {/* key + valid src are important */}
            <Image
              src={img.src}
              alt={img.alt || cityName}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-black/30 text-white px-2 py-1 text-[11px]">
              Photo by {img.photographer || "Unsplash"}
            </div>
          </div>
        );

        return img.link ? (
          <a
            key={img.id}
            href={img.link}
            target="_blank"
            rel="noreferrer"
            title="View on Unsplash"
          >
            {content}
          </a>
        ) : (
          <div key={img.id}>{content}</div>
        );
      })}
    </div>
  );
}