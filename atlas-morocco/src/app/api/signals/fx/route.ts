
import { NextResponse } from "next/server";

export const revalidate = 300;

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const base = (url.searchParams.get("base") || "").toUpperCase();
    const quote = (url.searchParams.get("quote") || "").toUpperCase();
    if (!base || !quote) return bad("base & quote are required (e.g. USD & MAD)");

    const upstream = await fetch(
      `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`,
      { next: { revalidate: 300 }, cache: "force-cache" }
    );

    if (!upstream.ok) {
      const txt = await upstream.text();
      return NextResponse.json(
        { error: "fx upstream failed", status: upstream.status, detail: txt.slice(0, 500) },
        { status: 502 }
      );
    }

    const body = await upstream.json();
    const rate = body?.rates?.[quote];
    if (!rate) return bad(`rate for ${base}->${quote} not found`, 404);

    const payload = {
      cached: false,
      provider: "er-api",
      base,
      quote,
      rate,
      date: new Date(body?.time_last_update_utc || Date.now()).toUTCString(),
    };

    const res = NextResponse.json(payload);
    res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "unexpected", detail: String(err?.stack || err) }, { status: 500 });
  }
}