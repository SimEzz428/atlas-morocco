from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from ..core.db import get_session
from ..models import City, Place
from ..seed import seed

router = APIRouter(prefix="/cities", tags=["cities"])

@router.post("/admin/seed")
async def admin_seed(db: AsyncSession = Depends(get_session), force: bool = False):
    """Seed the database with comprehensive city and place data. Idempotent operation unless force=True."""
    return await seed(db, force=force)

@router.post("/admin/clear")
async def admin_clear(db: AsyncSession = Depends(get_session)):
    """Clear all data from the database."""
    await db.execute(delete(Place))
    await db.execute(delete(City))
    await db.commit()
    return {"cleared": True, "message": "All data cleared from database"}

@router.get("")
async def list_cities(
    q: str = Query("", description="Search query for city names"),
    min_places: int = Query(0, description="Minimum number of places"),
    category: str = Query("", description="Filter by place category"),
    sort: str = Query("name", description="Sort by 'name' or 'popularity'"),
    db: AsyncSession = Depends(get_session)
):
    """Get all cities with optional search and filtering."""
    # Start with basic query
    query = select(City)
    
    # Apply search filter
    if q:
        query = query.where(City.name.ilike(f"%{q}%"))
    
    # For complex filters, we'll use a simpler approach
    if category or min_places > 0 or sort == "popularity":
        # Get all cities first, then filter in Python for simplicity
        result = await db.execute(query)
        all_cities = result.scalars().all()
        
        # Filter cities based on criteria
        filtered_cities = []
        for city in all_cities:
            # Get places for this city
            places_result = await db.execute(
                select(Place).where(Place.city_id == city.id)
            )
            places = places_result.scalars().all()
            
            # Apply category filter
            if category:
                if not any(place.category == category for place in places):
                    continue
            
            # Apply minimum places filter
            if min_places > 0 and len(places) < min_places:
                continue
            
            filtered_cities.append((city, len(places)))
        
        # Apply sorting
        if sort == "popularity":
            filtered_cities.sort(key=lambda x: x[1], reverse=True)
        else:
            filtered_cities.sort(key=lambda x: x[0].name)
        
        cities = [city for city, _ in filtered_cities]
    else:
        # Simple case - just apply search and name sorting
        query = query.order_by(City.name)
        result = await db.execute(query)
        cities = result.scalars().all()
    
    items = []
    for c in cities:
        items.append({
            "id": c.id, 
            "slug": c.slug, 
            "name": c.name, 
            "lat": c.lat, 
            "lon": c.lon
        })
    
    return {"cities": items}

# NEW: city detail (used by /api/cities/[slug] in the Next.js app)
@router.get("/{slug}")
async def city_detail(slug: str, db: AsyncSession = Depends(get_session)):
    """Get detailed information about a specific city including places and categories."""
    q = await db.execute(select(City).where(City.slug == slug))
    city = q.scalars().first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")

    # a few highlight places (adjust limit/order if you want)
    q_places = await db.execute(
        select(Place)
        .where(Place.city_id == city.id)
        .order_by(Place.id)
        .limit(8)
    )
    places = [
        {"id": p.id, "name": p.name, "category": p.category, "lat": p.lat, "lon": p.lon}
        for p in q_places.scalars()
    ]

    # simple category counts (handy for UI chips)
    q_cats = await db.execute(
        select(Place.category, func.count())
        .where(Place.city_id == city.id)
        .group_by(Place.category)
    )
    categories = {row[0]: row[1] for row in q_cats.all()}
    count = sum(categories.values())

    return {
        "city": {
            "id": city.id,
            "slug": city.slug,
            "name": city.name,
            "lat": city.lat,
            "lon": city.lon,
        },
        "places": places,
        "count": count,
        "categories": categories,
    }

@router.get("/{slug}/places")
async def city_places(slug: str, db: AsyncSession = Depends(get_session)):
    """Get all places for a specific city."""
    q = await db.execute(select(City).where(City.slug == slug))
    city = q.scalars().first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    
    q2 = await db.execute(select(Place).where(Place.city_id == city.id))
    places = [{"id": p.id, "name": p.name, "category": p.category, "lat": p.lat, "lon": p.lon} for p in q2.scalars()]
    return {"city": {"id": city.id, "slug": city.slug, "name": city.name}, "places": places}