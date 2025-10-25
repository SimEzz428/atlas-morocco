import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.db import Base, get_session
from app.models import City, Place, Trip, TripItem

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def override_get_session():
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

@pytest_asyncio.fixture(scope="function")
async def setup_database():
    """Set up test database with tables and seed data."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed the database with test data
    from app.seed import seed
    async with TestingSessionLocal() as session:
        await seed(session, force=True)
    
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture(scope="function")
def client():
    return TestClient(app)

@pytest.mark.asyncio
async def test_health_endpoint(client):
    """Test the health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True

@pytest.mark.asyncio
async def test_cities_endpoint(client, setup_database):
    """Test the cities endpoint."""
    response = client.get("/cities")
    assert response.status_code == 200
    assert "cities" in response.json()

@pytest.mark.asyncio
async def test_city_search(client, setup_database):
    """Test city search functionality."""
    response = client.get("/cities?q=marrakech")
    assert response.status_code == 200
    data = response.json()
    assert "cities" in data

@pytest.mark.asyncio
async def test_trip_creation(client, setup_database):
    """Test trip creation."""
    trip_data = {
        "title": "Test Trip",
        "city_slug": "marrakech"
    }
    response = client.post("/trips", json=trip_data)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["title"] == "Test Trip"
    assert data["city_slug"] == "marrakech"

@pytest.mark.asyncio
async def test_trip_item_creation(client, setup_database):
    """Test trip item creation."""
    # First create a trip
    trip_response = client.post("/trips", json={"title": "Test Trip"})
    trip_id = trip_response.json()["id"]
    
    # Then add an item
    item_data = {
        "name": "Test Place",
        "category": "monument",
        "lat": 31.625,
        "lon": -7.989
    }
    response = client.post(f"/trips/{trip_id}/items", json=item_data)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["name"] == "Test Place"
    assert data["category"] == "monument"

@pytest.mark.asyncio
async def test_weather_api(client):
    """Test weather API."""
    response = client.get("/signals/weather?lat=31.6295&lon=-7.9811")
    assert response.status_code == 200
    data = response.json()
    assert "current_weather" in data

@pytest.mark.asyncio
async def test_fx_api(client):
    """Test FX API."""
    response = client.get("/signals/fx?base=USD&quote=MAD")
    assert response.status_code == 200
    data = response.json()
    assert "rate" in data
    assert data["rate"] > 0

@pytest.mark.asyncio
async def test_google_maps_no_key(client):
    """Test Google Maps API without key."""
    response = client.get("/maps/directions?origin=31.625,-7.989&destination=31.641,-8.003")
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is False
    assert data["provider"] == "none"

@pytest.mark.asyncio
async def test_plan_endpoint(client):
    """Test plan endpoint for frontend compatibility."""
    response = client.get("/plan")
    assert response.status_code == 200
    data = response.json()
    assert "tripPlans" in data
    assert isinstance(data["tripPlans"], list)

if __name__ == "__main__":
    pytest.main([__file__])
