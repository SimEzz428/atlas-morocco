import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
    }

    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    const r = await fetch(url, { next: { revalidate: 900 } }); 
    if (!r.ok) {
      return NextResponse.json({ error: `upstream ${r.status}` }, { status: r.status });
    }
    const data = await r.json();

   
    const out = {
      cached: false,
      latitude: data.latitude,
      longitude: data.longitude,
      current_weather: {
        temperature: data.current?.temperature_2m,
        windspeed: data.current?.wind_speed_10m,
      },
      hourly: data.hourly,
      daily: data.daily,
      temp: data.current?.temperature_2m,
      wind: data.current?.wind_speed_10m,
    };

    return NextResponse.json(out, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}