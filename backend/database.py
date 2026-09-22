import certifi
from motor.motor_asyncio import AsyncIOMotorClient
try:
    from .config import settings
except (ImportError, ValueError):
    from config import settings

client_options = {
    "serverSelectionTimeoutMS": 5000,
}

try:
    client_options["tlsCAFile"] = certifi.where()
except Exception:
    pass

# Initialize connection client with local certifi TLS cert file
client = AsyncIOMotorClient(settings.mongodb_uri, **client_options)

# Use db: time_pilot_db
db = client.time_pilot_db
