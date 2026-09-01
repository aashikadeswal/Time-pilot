import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

# Initialize connection client with local certifi TLS cert file
client = AsyncIOMotorClient(settings.mongodb_uri, tlsCAFile=certifi.where())

# Use db: time_pilot_db
db = client.time_pilot_db
