from fastapi import APIRouter, Query, HTTPException
import httpx
import os
from datetime import datetime
from ..core.redis import cache_get, cache_set
from sqlalchemy import text
from ..core.db import SessionLocal

router = APIRouter()

# Environment variables for API providers
FX_PROVIDER = os.getenv("FX_PROVIDER", "er-api")
FX_BASE_URL = os.getenv("FX_BASE_URL")
REDIS_URL = os.getenv("REDIS_URL")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

@router.get("/signals/weather")
async def weather(lat: float = Query(...), lon: float = Query(...)):
    """Get weather data with caching and graceful fallback."""
    # Validate coordinates
    if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid coordinates")
    
    key = f"wx:{round(lat,3)}:{round(lon,3)}"
    cached = cache_get(key)
    if cached:
        return {"cached": True, **cached}
    
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}&hourly=temperature_2m,precipitation,wind_speed_10m"
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true&timezone=auto"
    )
    
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()
        
        cache_set(key, data, ttl_sec=1800)  # 30 minutes
        return {"cached": False, **data}
    except Exception as e:
        # Return 502 with JSON error instead of HTML
        raise HTTPException(
            status_code=502, 
            detail={"error": f"Weather service unavailable: {str(e)}", "provider": "open-meteo"}
        )

@router.get("/signals/fx")
async def fx(base: str = "USD", quote: str = "MAD"):
    """Get currency exchange rates with caching and multiple providers."""
    base = base.upper()
    quote = quote.upper()
    key = f"fx:{base}:{quote}"

    cached = cache_get(key)
    if cached:
        return {"cached": True, **cached}

    providers = []
    if FX_PROVIDER == "er-api":
        providers.append(("er-api", f"https://open.er-api.com/v6/latest/{base}"))
    elif FX_PROVIDER == "exchangerate_host":
        providers.append(("exchangerate_host", f"https://api.exchangerate.host/latest?base={base}"))
    elif FX_PROVIDER == "frankfurter":
        providers.append(("frankfurter", f"https://api.frankfurter.app/latest?from={base}"))
    else:
        # Default fallback providers
        providers = [
            ("er-api", f"https://open.er-api.com/v6/latest/{base}"),
            ("fawazahmed0", f"https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/{base.lower()}/{quote.lower()}.json")
        ]

    async with httpx.AsyncClient(timeout=10) as client:
        for provider_name, url in providers:
            try:
                if provider_name == "er-api":
                    r = await client.get(url)
                    r.raise_for_status()
                    j = r.json()
                    if j.get("result") == "success" and quote in j.get("rates", {}):
                        data = {
                            "base": j["base_code"],
                            "date": j.get("time_last_update_utc"),
                            "quote": quote,
                            "rate": j["rates"][quote],
                            "provider": provider_name,
                        }
                        cache_set(key, data, ttl_sec=43200)  # 12 hours
                        return {"cached": False, **data}
                
                elif provider_name == "fawazahmed0":
                    r = await client.get(url)
                    r.raise_for_status()
                    j = r.json()
                    rate = j.get(quote.lower())
                    if rate is not None:
                        data = {
                            "base": base,
                            "date": j.get("date"),
                            "quote": quote,
                            "rate": rate,
                            "provider": provider_name,
                        }
                        cache_set(key, data, ttl_sec=43200)  # 12 hours
                        return {"cached": False, **data}
                        
            except Exception:
                continue

    return {
        "cached": False,
        "error": f"Could not fetch FX for {base}/{quote} from any provider.",
        "provider": "none"
    }

@router.get("/maps/directions")
async def google_directions(
    origin: str = Query(..., description="Origin coordinates as 'lat,lon'"),
    destination: str = Query(..., description="Destination coordinates as 'lat,lon'"),
    waypoints: str = Query("", description="Optional waypoints as 'lat,lon|lat,lon'")
):
    """Get directions from Google Maps API if available."""
    if not GOOGLE_MAPS_API_KEY:
        return {"provider": "none", "available": False}
    
    try:
        # Parse coordinates
        origin_lat, origin_lon = map(float, origin.split(","))
        dest_lat, dest_lon = map(float, destination.split(","))
        
        # Build waypoints parameter
        waypoints_param = ""
        if waypoints:
            waypoints_list = waypoints.split("|")
            waypoints_param = "&waypoints=" + "|".join(waypoints_list)
        
        url = (
            f"https://maps.googleapis.com/maps/api/directions/json"
            f"?origin={origin_lat},{origin_lon}"
            f"&destination={dest_lat},{dest_lon}"
            f"{waypoints_param}"
            f"&key={GOOGLE_MAPS_API_KEY}"
        )
        
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") != "OK":
                return {"provider": "google", "available": False, "error": data.get("status")}
            
            # Extract summary information
            route = data["routes"][0]
            leg = route["legs"][0]
            
            return {
                "provider": "google",
                "available": True,
                "distance": leg["distance"]["text"],
                "duration": leg["duration"]["text"],
                "polyline": route["overview_polyline"]["points"]
            }
            
    except Exception as e:
        return {"provider": "google", "available": False, "error": str(e)}

@router.get("/maps/static")
async def google_static_map(
    center: str = Query(..., description="Center coordinates as 'lat,lon'"),
    markers: str = Query("", description="Markers as 'lat,lon|lat,lon'"),
    zoom: int = Query(10, description="Zoom level")
):
    """Get Google Static Maps URL if available."""
    if not GOOGLE_MAPS_API_KEY:
        return {"provider": "none", "available": False}
    
    try:
        # Build markers parameter
        markers_param = ""
        if markers:
            markers_list = markers.split("|")
            markers_param = "&markers=" + "&markers=".join(markers_list)
        
        url = (
            f"https://maps.googleapis.com/maps/api/staticmap"
            f"?center={center}"
            f"&zoom={zoom}"
            f"&size=600x400"
            f"{markers_param}"
            f"&key={GOOGLE_MAPS_API_KEY}"
        )
        
        return {
            "provider": "google",
            "available": True,
            "url": url
        }
        
    except Exception as e:
        return {"provider": "google", "available": False, "error": str(e)}

@router.post("/signals/fx/record")
async def fx_record(base: str = "USD", quote: str = "MAD"):
    base = base.upper()
    quote = quote.upper()
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r1 = await client.get(f"https://open.er-api.com/v6/latest/{base}")
            r1.raise_for_status()
            j1 = r1.json()
            if j1.get("result") == "success" and quote in j1.get("rates", {}):
                rate = float(j1["rates"][quote])
                provider = "er-api"
                async with SessionLocal() as s:
                    await s.execute(
                        text("""
                            INSERT INTO fx_rates (base, quote, rate, provider)
                            VALUES (:base, :quote, :rate, :provider)
                        """),
                        {"base": base, "quote": quote, "rate": rate, "provider": provider},
                    )
                    await s.commit()
                return {"ok": True, "base": base, "quote": quote, "rate": rate, "provider": provider}
        except Exception:
            pass

        try:
            r2 = await client.get(
                f"https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/{base.lower()}/{quote.lower()}.json"
            )
            r2.raise_for_status()
            j2 = r2.json()
            rate = j2.get(quote.lower())
            if rate is not None:
                rate = float(rate)
                provider = "fawazahmed0/currency-api"
                async with SessionLocal() as s:
                    await s.execute(
                        text("""
                            INSERT INTO fx_rates (base, quote, rate, provider)
                            VALUES (:base, :quote, :rate, :provider)
                        """),
                        {"base": base, "quote": quote, "rate": rate, "provider": provider},
                    )
                    await s.commit()
                return {"ok": True, "base": base, "quote": quote, "rate": rate, "provider": provider}
        except Exception:
            pass

    return {"ok": False, "error": f"Could not record FX for {base}/{quote}"}

@router.get("/signals/fx/history")
async def fx_history(base: str = "USD", quote: str = "MAD", limit: int = 30):
    base = base.upper()
    quote = quote.upper()
    limit = max(1, min(limit, 365))
    async with SessionLocal() as s:
        res = await s.execute(
            text("""
                SELECT base, quote, rate, provider, captured_at
                FROM fx_rates
                WHERE base = :base AND quote = :quote
                ORDER BY captured_at DESC
                LIMIT :limit
            """),
            {"base": base, "quote": quote, "limit": limit},
        )
        rows = res.fetchall()
    return {
        "base": base,
        "quote": quote,
        "count": len(rows),
        "points": [
            {
                "rate": float(r.rate),
                "provider": r.provider,
                "captured_at": r.captured_at.isoformat() if hasattr(r.captured_at, "isoformat") else str(r.captured_at),
            }
            for r in rows
        ],
    }