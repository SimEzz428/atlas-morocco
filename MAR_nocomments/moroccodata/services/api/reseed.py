#!/usr/bin/env python3
"""
Script to clear and reseed the database with comprehensive data
"""
import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.db import SessionLocal
from app.models import City, Place
from sqlalchemy import select, delete

async def clear_and_seed():
    async with SessionLocal() as db:
        # Clear existing data
        print("Clearing existing data...")
        await db.execute(delete(Place))
        await db.execute(delete(City))
        await db.commit()
        print("Data cleared successfully!")
        
        # Import and run seed function
        from app.seed import seed
        result = await seed(db, force=True)
        print(f"Seeding result: {result}")

if __name__ == "__main__":
    asyncio.run(clear_and_seed())
