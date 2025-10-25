from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from .models import City, Place

async def seed(db: AsyncSession, force: bool = False):
    try:
        # Always clear existing data for now to ensure fresh data
        print("Clearing existing data...")
        await db.execute(delete(Place))
        await db.execute(delete(City))
        await db.commit()
        print("Data cleared successfully!")
    except Exception as e:
        print(f"Error clearing data: {e}")
        # Continue anyway, might be first run

    # Define comprehensive city data
    cities_data = [
        {
            "slug": "marrakech",
            "name": "Marrakech",
            "lat": 31.6295,
            "lon": -7.9811,
            "meta": {"region": "Marrakech-Safi", "population": 928850},
            "places": [
                {"name": "Jemaa el-Fnaa", "category": "market", "lat": 31.625, "lon": -7.989, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Jardin Majorelle", "category": "garden", "lat": 31.641, "lon": -8.003, "extra": {"visit_time": 90, "cost": "70 MAD"}},
                {"name": "Bahia Palace", "category": "palace", "lat": 31.625, "lon": -7.988, "extra": {"visit_time": 60, "cost": "70 MAD"}},
                {"name": "Koutoubia Mosque", "category": "mosque", "lat": 31.625, "lon": -7.988, "extra": {"visit_time": 30, "cost": "Free"}},
                {"name": "Saadian Tombs", "category": "monument", "lat": 31.625, "lon": -7.988, "extra": {"visit_time": 45, "cost": "70 MAD"}},
                {"name": "El Badi Palace", "category": "palace", "lat": 31.625, "lon": -7.988, "extra": {"visit_time": 60, "cost": "70 MAD"}},
                {"name": "Marrakech Museum", "category": "museum", "lat": 31.625, "lon": -7.988, "extra": {"visit_time": 90, "cost": "50 MAD"}},
            ]
        },
        {
            "slug": "fes",
            "name": "Fès",
            "lat": 34.033,
            "lon": -4.983,
            "meta": {"region": "Fès-Meknès", "population": 1112072},
            "places": [
                {"name": "Fes el-Bali", "category": "medina", "lat": 34.033, "lon": -4.983, "extra": {"visit_time": 180, "cost": "Free"}},
                {"name": "Al Quaraouiyine University", "category": "monument", "lat": 34.033, "lon": -4.983, "extra": {"visit_time": 30, "cost": "Free"}},
                {"name": "Chouara Tannery", "category": "workshop", "lat": 34.033, "lon": -4.983, "extra": {"visit_time": 45, "cost": "20 MAD"}},
                {"name": "Bou Inania Madrasa", "category": "monument", "lat": 34.033, "lon": -4.983, "extra": {"visit_time": 60, "cost": "20 MAD"}},
                {"name": "Dar Batha Museum", "category": "museum", "lat": 34.033, "lon": -4.983, "extra": {"visit_time": 90, "cost": "20 MAD"}},
                {"name": "Merinid Tombs", "category": "viewpoint", "lat": 34.033, "lon": -4.983, "extra": {"visit_time": 45, "cost": "Free"}},
                {"name": "Fes Pottery Cooperative", "category": "workshop", "lat": 34.033, "lon": -4.983, "extra": {"visit_time": 60, "cost": "Free"}},
            ]
        },
        {
            "slug": "essaouira",
            "name": "Essaouira",
            "lat": 31.51,
            "lon": -9.77,
            "meta": {"region": "Marrakech-Safi", "population": 194030},
            "places": [
                {"name": "Essaouira Medina", "category": "medina", "lat": 31.51, "lon": -9.77, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Essaouira Beach", "category": "beach", "lat": 31.51, "lon": -9.77, "extra": {"visit_time": 180, "cost": "Free"}},
                {"name": "Skala de la Ville", "category": "fortress", "lat": 31.51, "lon": -9.77, "extra": {"visit_time": 60, "cost": "60 MAD"}},
                {"name": "Essaouira Port", "category": "port", "lat": 31.51, "lon": -9.77, "extra": {"visit_time": 90, "cost": "Free"}},
                {"name": "Sidi Mohammed Ben Abdallah Museum", "category": "museum", "lat": 31.51, "lon": -9.77, "extra": {"visit_time": 60, "cost": "20 MAD"}},
                {"name": "Jewish Cemetery", "category": "monument", "lat": 31.51, "lon": -9.77, "extra": {"visit_time": 30, "cost": "Free"}},
                {"name": "Essaouira Wind Surfing", "category": "activity", "lat": 31.51, "lon": -9.77, "extra": {"visit_time": 240, "cost": "300 MAD"}},
            ]
        },
        {
            "slug": "casablanca",
            "name": "Casablanca",
            "lat": 33.5731,
            "lon": -7.5898,
            "meta": {"region": "Casablanca-Settat", "population": 3356888},
            "places": [
                {"name": "Hassan II Mosque", "category": "mosque", "lat": 33.608, "lon": -7.632, "extra": {"visit_time": 90, "cost": "130 MAD"}},
                {"name": "Old Medina", "category": "medina", "lat": 33.573, "lon": -7.590, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Corniche Ain Diab", "category": "beach", "lat": 33.573, "lon": -7.590, "extra": {"visit_time": 180, "cost": "Free"}},
                {"name": "Mohammed V Square", "category": "monument", "lat": 33.573, "lon": -7.590, "extra": {"visit_time": 30, "cost": "Free"}},
                {"name": "Casablanca Cathedral", "category": "monument", "lat": 33.573, "lon": -7.590, "extra": {"visit_time": 45, "cost": "Free"}},
                {"name": "Central Market", "category": "market", "lat": 33.573, "lon": -7.590, "extra": {"visit_time": 90, "cost": "Free"}},
                {"name": "Villa des Arts", "category": "museum", "lat": 33.573, "lon": -7.590, "extra": {"visit_time": 60, "cost": "20 MAD"}},
            ]
        },
        {
            "slug": "rabat",
            "name": "Rabat",
            "lat": 34.0209,
            "lon": -6.8416,
            "meta": {"region": "Rabat-Salé-Kénitra", "population": 577827},
            "places": [
                {"name": "Hassan Tower", "category": "monument", "lat": 34.021, "lon": -6.842, "extra": {"visit_time": 60, "cost": "70 MAD"}},
                {"name": "Rabat Medina", "category": "medina", "lat": 34.021, "lon": -6.842, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Kasbah of the Udayas", "category": "fortress", "lat": 34.021, "lon": -6.842, "extra": {"visit_time": 90, "cost": "Free"}},
                {"name": "Royal Palace", "category": "palace", "lat": 34.021, "lon": -6.842, "extra": {"visit_time": 30, "cost": "Free"}},
                {"name": "Chellah Necropolis", "category": "monument", "lat": 34.021, "lon": -6.842, "extra": {"visit_time": 90, "cost": "70 MAD"}},
                {"name": "Archaeological Museum", "category": "museum", "lat": 34.021, "lon": -6.842, "extra": {"visit_time": 90, "cost": "20 MAD"}},
                {"name": "Rabat Beach", "category": "beach", "lat": 34.021, "lon": -6.842, "extra": {"visit_time": 180, "cost": "Free"}},
            ]
        },
        {
            "slug": "agadir",
            "name": "Agadir",
            "lat": 30.4278,
            "lon": -9.5981,
            "meta": {"region": "Souss-Massa", "population": 924000},
            "places": [
                {"name": "Agadir Beach", "category": "beach", "lat": 30.428, "lon": -9.598, "extra": {"visit_time": 240, "cost": "Free"}},
                {"name": "Agadir Kasbah", "category": "fortress", "lat": 30.428, "lon": -9.598, "extra": {"visit_time": 60, "cost": "Free"}},
                {"name": "Souk El Had", "category": "market", "lat": 30.428, "lon": -9.598, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Valley of the Birds", "category": "park", "lat": 30.428, "lon": -9.598, "extra": {"visit_time": 90, "cost": "Free"}},
                {"name": "Agadir Marina", "category": "port", "lat": 30.428, "lon": -9.598, "extra": {"visit_time": 60, "cost": "Free"}},
                {"name": "Memorial Museum", "category": "museum", "lat": 30.428, "lon": -9.598, "extra": {"visit_time": 60, "cost": "20 MAD"}},
                {"name": "Paradise Valley", "category": "nature", "lat": 30.428, "lon": -9.598, "extra": {"visit_time": 180, "cost": "200 MAD"}},
            ]
        },
        {
            "slug": "tangier",
            "name": "Tangier",
            "lat": 35.7595,
            "lon": -5.8340,
            "meta": {"region": "Tanger-Tétouan-Al Hoceïma", "population": 947952},
            "places": [
                {"name": "Tangier Medina", "category": "medina", "lat": 35.760, "lon": -5.834, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Cap Spartel", "category": "viewpoint", "lat": 35.760, "lon": -5.834, "extra": {"visit_time": 60, "cost": "Free"}},
                {"name": "Hercules Caves", "category": "monument", "lat": 35.760, "lon": -5.834, "extra": {"visit_time": 45, "cost": "20 MAD"}},
                {"name": "Tangier Beach", "category": "beach", "lat": 35.760, "lon": -5.834, "extra": {"visit_time": 180, "cost": "Free"}},
                {"name": "American Legation Museum", "category": "museum", "lat": 35.760, "lon": -5.834, "extra": {"visit_time": 60, "cost": "20 MAD"}},
                {"name": "Grand Socco", "category": "market", "lat": 35.760, "lon": -5.834, "extra": {"visit_time": 90, "cost": "Free"}},
                {"name": "Kasbah Museum", "category": "museum", "lat": 35.760, "lon": -5.834, "extra": {"visit_time": 60, "cost": "20 MAD"}},
            ]
        },
        {
            "slug": "chefchaouen",
            "name": "Chefchaouen",
            "lat": 35.1714,
            "lon": -5.2697,
            "meta": {"region": "Tanger-Tétouan-Al Hoceïma", "population": 42910},
            "places": [
                {"name": "Chefchaouen Medina", "category": "medina", "lat": 35.171, "lon": -5.270, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Ras El Maa Waterfall", "category": "nature", "lat": 35.171, "lon": -5.270, "extra": {"visit_time": 60, "cost": "Free"}},
                {"name": "Spanish Mosque", "category": "mosque", "lat": 35.171, "lon": -5.270, "extra": {"visit_time": 45, "cost": "Free"}},
                {"name": "Outa El Hammam Square", "category": "monument", "lat": 35.171, "lon": -5.270, "extra": {"visit_time": 30, "cost": "Free"}},
                {"name": "Kasbah Museum", "category": "museum", "lat": 35.171, "lon": -5.270, "extra": {"visit_time": 60, "cost": "20 MAD"}},
                {"name": "Local Artisan Shops", "category": "shopping", "lat": 35.171, "lon": -5.270, "extra": {"visit_time": 90, "cost": "Free"}},
                {"name": "Akchour Waterfalls", "category": "nature", "lat": 35.171, "lon": -5.270, "extra": {"visit_time": 240, "cost": "50 MAD"}},
            ]
        },
        {
            "slug": "meknes",
            "name": "Meknes",
            "lat": 33.8935,
            "lon": -5.5473,
            "meta": {"region": "Fès-Meknès", "population": 835695},
            "places": [
                {"name": "Bab Mansour", "category": "monument", "lat": 33.894, "lon": -5.547, "extra": {"visit_time": 30, "cost": "Free"}},
                {"name": "Meknes Medina", "category": "medina", "lat": 33.894, "lon": -5.547, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Moulay Ismail Mausoleum", "category": "monument", "lat": 33.894, "lon": -5.547, "extra": {"visit_time": 45, "cost": "Free"}},
                {"name": "Dar Jamai Museum", "category": "museum", "lat": 33.894, "lon": -5.547, "extra": {"visit_time": 90, "cost": "20 MAD"}},
                {"name": "Heri es-Souani", "category": "monument", "lat": 33.894, "lon": -5.547, "extra": {"visit_time": 60, "cost": "70 MAD"}},
                {"name": "Place El-Hedim", "category": "monument", "lat": 33.894, "lon": -5.547, "extra": {"visit_time": 30, "cost": "Free"}},
                {"name": "Volubilis", "category": "monument", "lat": 33.894, "lon": -5.547, "extra": {"visit_time": 120, "cost": "70 MAD"}},
            ]
        },
        {
            "slug": "ouarzazate",
            "name": "Ouarzazate",
            "lat": 30.9195,
            "lon": -6.8938,
            "meta": {"region": "Drâa-Tafilalet", "population": 71067},
            "places": [
                {"name": "Ait Ben Haddou", "category": "monument", "lat": 30.920, "lon": -6.894, "extra": {"visit_time": 120, "cost": "Free"}},
                {"name": "Atlas Film Studios", "category": "museum", "lat": 30.920, "lon": -6.894, "extra": {"visit_time": 90, "cost": "80 MAD"}},
                {"name": "Taourirt Kasbah", "category": "fortress", "lat": 30.920, "lon": -6.894, "extra": {"visit_time": 60, "cost": "20 MAD"}},
                {"name": "Ouarzazate Museum", "category": "museum", "lat": 30.920, "lon": -6.894, "extra": {"visit_time": 60, "cost": "20 MAD"}},
                {"name": "Fint Oasis", "category": "nature", "lat": 30.920, "lon": -6.894, "extra": {"visit_time": 90, "cost": "Free"}},
                {"name": "Draa Valley", "category": "nature", "lat": 30.920, "lon": -6.894, "extra": {"visit_time": 180, "cost": "Free"}},
                {"name": "Zagora Desert", "category": "nature", "lat": 30.920, "lon": -6.894, "extra": {"visit_time": 240, "cost": "300 MAD"}},
            ]
        }
    ]

    # Create cities
    cities = []
    for city_data in cities_data:
        city = City(
            slug=city_data["slug"],
            name=city_data["name"],
            lat=city_data["lat"],
            lon=city_data["lon"],
            meta=city_data["meta"]
        )
        cities.append(city)
    
    db.add_all(cities)
    await db.flush()  # Get IDs for places

    # Create places for each city
    all_places = []
    for i, city_data in enumerate(cities_data):
        city = cities[i]
        for place_data in city_data["places"]:
            place = Place(
                city_id=city.id,
                name=place_data["name"],
                category=place_data["category"],
                lat=place_data["lat"],
                lon=place_data["lon"],
                extra=place_data["extra"]
            )
            all_places.append(place)
    
    try:
        db.add_all(all_places)
        await db.commit()
        
        return {
            "seeded": True, 
            "cities_count": len(cities), 
            "places_count": len(all_places),
            "message": f"Successfully seeded {len(cities)} cities with {len(all_places)} places"
        }
    except Exception as e:
        print(f"Error seeding data: {e}")
        await db.rollback()
        return {
            "seeded": False,
            "error": str(e),
            "message": "Failed to seed database"
        }