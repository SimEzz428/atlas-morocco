import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "Morocco";

  if (!accessKey) {
    return NextResponse.json({
      fallback: true,
      photos: Array.from({ length: 8 }).map((_, i) => ({
        id: String(i),
        src: `https://source.unsplash.com/600x400/?${encodeURIComponent(q)}&sig=${i}`,
        alt: q,
      })),
    });
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    q
  )}&per_page=12&content_filter=high&orientation=landscape`;
  const r = await fetch(url, { headers: { Authorization: `Client-ID ${accessKey}` } });
  if (!r.ok) {
    return NextResponse.json({ photos: [] }, { status: r.status });
  }
  const j = await r.json();
  const photos = (j.results || []).map((p: any) => ({
    id: p.id,
    src: p.urls.small,
    alt: p.alt_description || q,
    link: p.links.html,
    author: p.user?.name,
  }));
  return NextResponse.json({ photos, fallback: false });
}