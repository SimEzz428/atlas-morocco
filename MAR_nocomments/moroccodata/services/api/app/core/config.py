import os

def db_url() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    
    # Use SQLite for local development if no PostgreSQL is available
    if os.getenv("USE_SQLITE", "true").lower() == "true":
        return "sqlite+aiosqlite:///./moroccodata.db"
    
    # PostgreSQL configuration
    user = os.getenv("POSTGRES_USER", "md_user")
    pwd = os.getenv("POSTGRES_PASSWORD", "md_pass")
    host = os.getenv("POSTGRES_HOST", "db")
    port = os.getenv("POSTGRES_PORT", "5432")
    db = os.getenv("POSTGRES_DB", "moroccodata")
    return f"postgresql+asyncpg://{user}:{pwd}@{host}:{port}/{db}"