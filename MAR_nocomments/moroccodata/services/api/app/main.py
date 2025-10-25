from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .routers.cities import router as cities_router
from .routers.signals import router as signals_router
from .routers.health import router as health_router
from .routers.trips import router as trips_router

app = FastAPI(title="MoroccoData API", version="1.0.0")

# Mount feature routers
app.include_router(health_router)
app.include_router(cities_router)
app.include_router(signals_router)
app.include_router(trips_router)

# Frontend-compatible /plan endpoint
@app.get("/plan")
async def plan_endpoint():
    """Frontend-compatible plan endpoint that returns empty trip plans."""
    return {"tripPlans": []}