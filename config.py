"""
Configuration settings for ExoHabitatAI
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Data paths
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODELS_DIR = DATA_DIR / "models"

# Create directories if they don't exist
DATA_DIR.mkdir(exist_ok=True)
RAW_DATA_DIR.mkdir(exist_ok=True)
PROCESSED_DATA_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

# Database configuration
DATABASE_CONFIG = {
    "type": "csv",  # Options: "postgresql" or "csv"
    "postgresql": {
        "host": os.getenv("DB_HOST", "localhost"),
        "port": int(os.getenv("DB_PORT", 5432)),
        "database": os.getenv("DB_NAME", "exohabitat"),
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", "")
    },
    "csv": {
        "raw_file": str(RAW_DATA_DIR / "exoplanets_raw.csv"),
        "processed_file": str(PROCESSED_DATA_DIR / "exoplanets_processed.csv")
    }
}

# Model configuration
MODEL_CONFIG = {
    "random_forest": {
        "path": str(MODELS_DIR / "random_forest_model.pkl"),
        "n_estimators": 100,
        "max_depth": 10,
        "random_state": 42
    },
    "xgboost": {
        "path": str(MODELS_DIR / "xgboost_model.pkl"),
        "n_estimators": 100,
        "max_depth": 6,
        "learning_rate": 0.1,
        "random_state": 42
    },
    "scaler_path": str(MODELS_DIR / "scaler.pkl"),
    "encoder_path": str(MODELS_DIR / "encoder.pkl")
}

# Flask configuration
FLASK_CONFIG = {
    "host": "0.0.0.0",
    "port": 5000,
    "debug": True
}

# Data collection sources
DATA_SOURCES = {
    "nasa_archive": "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PS",
    "kaggle": "https://www.kaggle.com/datasets/kevinengel/exoplanet-database"
}

# Feature columns
PLANET_FEATURES = [
    "radius", "mass", "density", "surface_temp", 
    "orbital_period", "distance_from_star"
]

STAR_FEATURES = [
    "star_type", "star_luminosity", "star_temp", "metallicity"
]

ALL_FEATURES = PLANET_FEATURES + STAR_FEATURES

# Target variable
TARGET_VARIABLE = "habitability_class"  # Options: "habitability_class" or "habitability_score"

# Train/test split
TRAIN_TEST_SPLIT = 0.8
RANDOM_STATE = 42

# Habitability thresholds
HABITABILITY_THRESHOLDS = {
    "high": 0.75,
    "medium": 0.50,
    "low": 0.25
}

