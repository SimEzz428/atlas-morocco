from fastapi import APIRouter, HTTPException
from ..core.db import get_db
from ..models import City  # adjust import if model path differs

router = APIRouter()

@router.get("/cities")
async def list_cities():
    return {
        "cities": [
            {"id": 1, "slug": "marrakech", "name": "Marrakech", "lat": 31.6295, "lon": -7.9811},
            {"id": 2, "slug": "fes", "name": "Fès", "lat": 34.033, "lon": -4.983},
            {"id": 3, "slug": "essaouira", "name": "Essaouira", "lat": 31.51, "lon": -9.77},
        ]
    }

@router.get("/cities/{slug}")
async def get_city(slug: str):
    cities = {
        "marrakech": {
            "city": {"name": "Marrakech", "slug": "marrakech"},
            "places": [
                {"name": "Marrakech Medina", "category": "architecture"},
                {"name": "Jemaa el-Fnaa", "category": "food"},
                {"name": "Jardin Majorelle", "category": "architecture"},
            ],
        },
        "fes": {
            "city": {"name": "Fès", "slug": "fes"},
            "places": [
                {"name": "Medina of Fès", "category": "architecture"},
                {"name": "Bou Inania Madrasa", "category": "architecture"},
            ],
        },
        "essaouira": {
            "city": {"name": "Essaouira", "slug": "essaouira"},
            "places": [
                {"name": "Essaouira Citadel", "category": "architecture"},
                {"name": "Old Port", "category": "harbor"},
            ],
        },
    }
    city = cities.get(slug)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city