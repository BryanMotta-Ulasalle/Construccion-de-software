# config.py
import os
from dotenv import load_dotenv

# Load variables from .env into process environment
load_dotenv()

# Read values with defaults for safety
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "pass")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "task_db")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

# Build a SQLAlchemy-compatible connection URI using PostgreSQL driver
SQLALCHEMY_DATABASE_URI = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Disable event system overhead we don’t use
SQLALCHEMY_TRACK_MODIFICATIONS = False
