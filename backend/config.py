import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Search and load environment configs
for env_file in [".tmb", ".env", "backend/.tmb", "backend/.env"]:
    if os.path.exists(env_file):
        load_dotenv(env_file)

class Settings(BaseSettings):
    mongodb_uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    port: int = int(os.getenv("PORT", 8000))

settings = Settings()
