
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";   
export const runtime = "nodejs";          


const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:8000";


function buildUpstream(req: NextRequest, segs: string[] = []) {
  const url = new URL(req.url);
  const qs = url.search; // includes "?" when present
  const tail = segs.length ? `/${segs.join("/")}` : "";
  return `${API_BASE}/signals${tail}${qs}`;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await ctx.params;

  try {
    const upstream = buildUpstream(req, path);

    
    console.log("[signals-proxy] →", upstream);

    const r = await fetch(upstream, {
      cache: "no-store",
      
      headers: { "x-forwarded-host": req.headers.get("host") ?? "" },
    });

    const body = await r.text();
    const contentType = r.headers.get("content-type") ?? "application/json";

    
    return new NextResponse(body, {
      status: r.status,
      headers: { "content-type": contentType },
    });
  } catch (err: any) {
 
    const detail = String(err?.message ?? err);
    console.error("[signals-proxy] ERROR:", detail);

    return NextResponse.json(
      {
        error: "proxy_error",
        detail,
        tried: buildUpstream(req, (await ctx.params).path ?? []),
      },
      { status: 502 }
    );
  }
}


export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,OPTIONS",
    },
  });
}