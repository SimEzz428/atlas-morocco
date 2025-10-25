from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update, func
from typing import Optional, List
from pydantic import BaseModel
from datetime import date, datetime
import uuid

from ..core.db import get_session
from ..models import Trip, TripItem

router = APIRouter(prefix="/trips", tags=["trips"])

# Pydantic models for request/response
class TripCreate(BaseModel):
    title: Optional[str] = "Untitled Trip"
    city_slug: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None

class TripUpdate(BaseModel):
    title: Optional[str] = None
    city_slug: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class TripItemCreate(BaseModel):
    name: str
    category: str
    lat: float
    lon: float
    day_index: Optional[int] = 0
    order_index: Optional[int] = 0
    notes: Optional[str] = None
    place_id: Optional[int] = None

class TripItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    day_index: Optional[int] = None
    order_index: Optional[int] = None
    notes: Optional[str] = None
    place_id: Optional[int] = None

class TripOptimizeRequest(BaseModel):
    method: Optional[str] = "nearest"  # "nearest" or "two_opt"

@router.post("")
async def create_trip(trip_data: TripCreate, db: AsyncSession = Depends(get_session)):
    """Create a new trip."""
    trip_id = str(uuid.uuid4())
    slug = f"trip-{trip_id[:8]}"
    
    trip = Trip(
        id=trip_id,
        slug=slug,
        title=trip_data.title,
        city_slug=trip_data.city_slug,
        start_date=trip_data.start_date,
        end_date=trip_data.end_date,
        user_id=trip_data.user_id,
        session_id=trip_data.session_id
    )
    
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    
    return {
        "id": trip.id,
        "slug": trip.slug,
        "title": trip.title,
        "city_slug": trip.city_slug,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "user_id": trip.user_id,
        "session_id": trip.session_id,
        "created_at": trip.created_at,
        "updated_at": trip.updated_at
    }

@router.get("/{trip_id}")
async def get_trip(trip_id: str, db: AsyncSession = Depends(get_session)):
    """Get a trip with its items."""
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Get trip items
    items_result = await db.execute(
        select(TripItem)
        .where(TripItem.trip_id == trip_id)
        .order_by(TripItem.day_index, TripItem.order_index)
    )
    items = items_result.scalars().all()
    
    return {
        "trip": {
            "id": trip.id,
            "slug": trip.slug,
            "title": trip.title,
            "city_slug": trip.city_slug,
            "start_date": trip.start_date,
            "end_date": trip.end_date,
            "user_id": trip.user_id,
            "session_id": trip.session_id,
            "created_at": trip.created_at,
            "updated_at": trip.updated_at
        },
        "items": [
            {
                "id": item.id,
                "name": item.name,
                "category": item.category,
                "lat": item.lat,
                "lon": item.lon,
                "day_index": item.day_index,
                "order_index": item.order_index,
                "notes": item.notes,
                "place_id": item.place_id
            }
            for item in items
        ]
    }

@router.patch("/{trip_id}")
async def update_trip(trip_id: str, trip_data: TripUpdate, db: AsyncSession = Depends(get_session)):
    """Update a trip."""
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Update fields
    update_data = trip_data.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db.execute(
            update(Trip)
            .where(Trip.id == trip_id)
            .values(**update_data)
        )
        await db.commit()
    
    # Return updated trip
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one()
    
    return {
        "id": trip.id,
        "slug": trip.slug,
        "title": trip.title,
        "city_slug": trip.city_slug,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "user_id": trip.user_id,
        "session_id": trip.session_id,
        "created_at": trip.created_at,
        "updated_at": trip.updated_at
    }

@router.delete("/{trip_id}")
async def delete_trip(trip_id: str, db: AsyncSession = Depends(get_session)):
    """Delete a trip and all its items."""
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    await db.execute(delete(Trip).where(Trip.id == trip_id))
    await db.commit()
    
    return {"deleted": True, "trip_id": trip_id}

@router.get("")
async def list_trips(
    user_id: Optional[str] = Query(None),
    session_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_session)
):
    """List trips filtered by user_id or session_id."""
    query = select(Trip)
    
    if user_id:
        query = query.where(Trip.user_id == user_id)
    elif session_id:
        query = query.where(Trip.session_id == session_id)
    
    query = query.order_by(Trip.created_at.desc())
    
    result = await db.execute(query)
    trips = result.scalars().all()
    
    # Get item counts for each trip
    trip_list = []
    for trip in trips:
        count_result = await db.execute(
            select(func.count(TripItem.id)).where(TripItem.trip_id == trip.id)
        )
        items_count = count_result.scalar()
        
        trip_list.append({
            "id": trip.id,
            "slug": trip.slug,
            "title": trip.title,
            "city_slug": trip.city_slug,
            "start_date": trip.start_date,
            "end_date": trip.end_date,
            "user_id": trip.user_id,
            "session_id": trip.session_id,
            "created_at": trip.created_at,
            "updated_at": trip.updated_at,
            "items_count": items_count
        })
    
    return {"trips": trip_list}

@router.post("/{trip_id}/items")
async def create_trip_item(trip_id: str, item_data: TripItemCreate, db: AsyncSession = Depends(get_session)):
    """Add an item to a trip."""
    # Check if trip exists
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    item_id = str(uuid.uuid4())
    item = TripItem(
        id=item_id,
        trip_id=trip_id,
        name=item_data.name,
        category=item_data.category,
        lat=item_data.lat,
        lon=item_data.lon,
        day_index=item_data.day_index,
        order_index=item_data.order_index,
        notes=item_data.notes,
        place_id=item_data.place_id
    )
    
    db.add(item)
    await db.commit()
    await db.refresh(item)
    
    return {
        "id": item.id,
        "name": item.name,
        "category": item.category,
        "lat": item.lat,
        "lon": item.lon,
        "day_index": item.day_index,
        "order_index": item.order_index,
        "notes": item.notes,
        "place_id": item.place_id
    }

@router.patch("/{trip_id}/items/{item_id}")
async def update_trip_item(
    trip_id: str, 
    item_id: str, 
    item_data: TripItemUpdate, 
    db: AsyncSession = Depends(get_session)
):
    """Update a trip item."""
    result = await db.execute(
        select(TripItem)
        .where(TripItem.id == item_id)
        .where(TripItem.trip_id == trip_id)
    )
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Trip item not found")
    
    # Update fields
    update_data = item_data.model_dump(exclude_unset=True)
    if update_data:
        await db.execute(
            update(TripItem)
            .where(TripItem.id == item_id)
            .values(**update_data)
        )
        await db.commit()
    
    # Return updated item
    result = await db.execute(select(TripItem).where(TripItem.id == item_id))
    item = result.scalar_one()
    
    return {
        "id": item.id,
        "name": item.name,
        "category": item.category,
        "lat": item.lat,
        "lon": item.lon,
        "day_index": item.day_index,
        "order_index": item.order_index,
        "notes": item.notes,
        "place_id": item.place_id
    }

@router.delete("/{trip_id}/items/{item_id}")
async def delete_trip_item(trip_id: str, item_id: str, db: AsyncSession = Depends(get_session)):
    """Delete a trip item."""
    result = await db.execute(
        select(TripItem)
        .where(TripItem.id == item_id)
        .where(TripItem.trip_id == trip_id)
    )
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Trip item not found")
    
    await db.execute(delete(TripItem).where(TripItem.id == item_id))
    await db.commit()
    
    return {"deleted": True, "item_id": item_id}

@router.post("/{trip_id}/optimize")
async def optimize_trip(
    trip_id: str, 
    optimize_data: TripOptimizeRequest, 
    db: AsyncSession = Depends(get_session)
):
    """Optimize trip item order using nearest neighbor algorithm."""
    # Check if trip exists
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Get all items
    items_result = await db.execute(
        select(TripItem)
        .where(TripItem.trip_id == trip_id)
        .order_by(TripItem.day_index, TripItem.order_index)
    )
    items = items_result.scalars().all()
    
    if len(items) < 2:
        return {"items": [{"id": item.id, "name": item.name, "lat": item.lat, "lon": item.lon, "category": item.category} for item in items]}
    
    # Simple nearest neighbor optimization
    def calculate_distance(lat1, lon1, lat2, lon2):
        """Calculate approximate distance between two points."""
        return ((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2) ** 0.5
    
    # Start with first item
    optimized_items = [items[0]]
    remaining_items = items[1:]
    
    current_lat, current_lon = items[0].lat, items[0].lon
    
    while remaining_items:
        # Find nearest item
        nearest_item = min(remaining_items, key=lambda item: calculate_distance(
            current_lat, current_lon, item.lat, item.lon
        ))
        
        optimized_items.append(nearest_item)
        remaining_items.remove(nearest_item)
        current_lat, current_lon = nearest_item.lat, nearest_item.lon
    
    # Update order in database
    for i, item in enumerate(optimized_items):
        await db.execute(
            update(TripItem)
            .where(TripItem.id == item.id)
            .values(order_index=i)
        )
    
    await db.commit()
    
    return {
        "items": [
            {
                "id": item.id,
                "name": item.name,
                "lat": item.lat,
                "lon": item.lon,
                "category": item.category
            }
            for item in optimized_items
        ]
    }

# Frontend-compatible endpoint for existing /plan functionality
@router.get("/resolve")
async def resolve_plan_items(
    ids: str = Query(..., description="Comma-separated list of IDs"),
    trip_id: Optional[str] = Query(None, description="Optional trip ID to resolve from TripItems"),
    db: AsyncSession = Depends(get_session)
):
    """Resolve plan items by IDs. Can resolve from TripItems if trip_id provided, else from Places."""
    id_list = [id.strip() for id in ids.split(",") if id.strip()]
    
    if not id_list:
        return {"items": []}
    
    if trip_id:
        # Resolve from TripItems
        result = await db.execute(
            select(TripItem)
            .where(TripItem.trip_id == trip_id)
            .where(TripItem.id.in_(id_list))
        )
        items = result.scalars().all()
        
        return {
            "items": [
                {
                    "id": item.id,
                    "name": item.name,
                    "lat": item.lat,
                    "lon": item.lon,
                    "category": item.category
                }
                for item in items
            ]
        }
    else:
        # Resolve from Places (convert string IDs to integers)
        try:
            place_ids = [int(id) for id in id_list]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid place IDs")
        
        from ..models import Place
        result = await db.execute(
            select(Place)
            .where(Place.id.in_(place_ids))
        )
        places = result.scalars().all()
        
        return {
            "items": [
                {
                    "id": str(place.id),
                    "name": place.name,
                    "lat": place.lat,
                    "lon": place.lon,
                    "category": place.category
                }
                for place in places
            ]
        }
