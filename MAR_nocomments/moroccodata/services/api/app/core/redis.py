import os
import json
from typing import Any, Optional
import redis

def get_client() -> redis.Redis:
    host = os.getenv("REDIS_HOST", "redis")
    port = int(os.getenv("REDIS_PORT", "6379"))
    try:
        return redis.Redis(host=host, port=port, decode_responses=True)
    except Exception:
        # Return None if Redis is not available
        return None

r = get_client()

def cache_get(key: str) -> Optional[Any]:
    if r is None:
        return None
    try:
        v = r.get(key)
        if v is None:
            return None
        try:
            return json.loads(v)
        except Exception:
            return v
    except Exception:
        return None

def cache_set(key: str, value: Any, ttl_sec: int) -> None:
    if r is None:
        return
    try:
        r.set(key, json.dumps(value), ex=ttl_sec)
    except Exception:
        pass