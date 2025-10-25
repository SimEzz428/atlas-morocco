import { NextResponse } from "next/server";

function normalizeQ(q: string) {
  
  return q.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("q") || "";
  const q = normalizeQ(raw);
  const perPage = Number(url.searchParams.get("per_page") || "6");
  const width = url.searchParams.get("w") || "800";
  const height = url.searchParams.get("h") || "600";

  const key = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.log("No Unsplash API key found");
    return NextResponse.json({ images: [] }, { status: 200 });
  }

  try {
    const api = new URL("https://api.unsplash.com/search/photos");
    api.searchParams.set("client_id", key);
    api.searchParams.set("query", q);
    api.searchParams.set("per_page", String(perPage));
    api.searchParams.set("content_filter", "high");
    api.searchParams.set("orientation", "landscape");

    console.log("Fetching from Unsplash API:", api.toString());
    
    const r = await fetch(api, { 
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Atlas-Morocco/1.0'
      }
    });
    
    console.log("Unsplash API response status:", r.status);
    
    if (!r.ok) {
      console.error("Unsplash API error:", r.status, r.statusText);
      return NextResponse.json({ images: [] }, { status: 200 });
    }

    const responseText = await r.text();
    console.log("Unsplash API response preview:", responseText.substring(0, 200));
    
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Unsplash API response as JSON:", parseError);
      console.error("Response text:", responseText);
      return NextResponse.json({ images: [] }, { status: 200 });
    }

    const images = (json?.results ?? []).map((x: any) => {
      
      const baseUrl = x.urls?.regular || x.urls?.full || x.urls?.small;
      let optimizedUrl = baseUrl;
      
      if (baseUrl) {
        
        const url = new URL(baseUrl);
        url.searchParams.set('w', width);
        url.searchParams.set('h', height);
        url.searchParams.set('fit', 'crop');
        url.searchParams.set('q', '80');
        optimizedUrl = url.toString();
      }
      
      return {
        id: x.id as string,
        src: optimizedUrl,
        link: x.links?.html as string,
        alt: x.alt_description || q,
        photographer: x.user?.name as string | undefined,
        width: parseInt(width),
        height: parseInt(height),
      };
    });

    console.log(`Found ${images.length} images for query: ${q}`);
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Unsplash API fetch error:", error);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}