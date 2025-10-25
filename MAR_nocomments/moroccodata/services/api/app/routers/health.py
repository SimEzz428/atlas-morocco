from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from ..core.db import get_session

router = APIRouter()

@router.get("/health")
async def health(db: AsyncSession = Depends(get_session)):
    result = await db.execute(text("SELECT 1"))
    row = result.scalar()
    return {"ok": True, "db": bool(row)}