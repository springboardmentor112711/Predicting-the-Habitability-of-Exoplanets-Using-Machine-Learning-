# ExoHabitAI Backend - Flask API

A RESTful Flask API server for exoplanet habitability prediction with SQLite database integration.

## Features

- **Machine Learning**: Random Forest Classifier for habitability prediction
- **Database**: SQLite for persistent planet and prediction storage
- **REST API**: Full CRUD operations for planets
- **Ranking System**: Planets ranked by habitability score
- **CORS Support**: Enabled for frontend integration
- **Auto-Population**: Sample exoplanet data loaded on first run

## Installation & Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

Server starts on `http://localhost:5000`

## Database

Automatically creates SQLite database (`exohabitat.db`) with two tables:

**Planets Table** - Stores exoplanet data
**Predictions Table** - Stores prediction results linked to planets

Sample planets (TRAPPIST-1e, Proxima Centauri b, Kepler-452b) auto-populate on first run.

## API Endpoints

### 1. Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### 2. Make Prediction
```
POST /api/predict
Content-Type: application/json
```

Request Body:
```json
{
  "pl_rade": 1.0,
  "pl_bmasse": 1.0,
  "pl_orbper": 365,
  "pl_orbsmax": 1.0,
  "pl_eqt": 288,
  "st_teff": 5778,
  "st_rad": 1.0,
  "st_mass": 1.0,
  "sy_dist": 10.0,
  "pl_dens": 1.0
}
```

Response:
```json
{
  "success": true,
  "prediction": 1,
  "habitability_score": 75,
  "classification": "Highly Habitable",
  "color": "green",
  "probabilities": {
    "not_habitable": 0.25,
    "habitable": 0.75
  }
}
```

### 3. Add New Planet
```
POST /api/add_planet
Content-Type: application/json
```

Request Body (all fields required):
```json
{
  "name": "Kepler-442b",
  "pl_rade": 1.6,
  "pl_bmasse": 5.0,
  "pl_orbper": 384.8,
  "pl_orbsmax": 1.046,
  "pl_eqt": 265,
  "st_teff": 5757,
  "st_rad": 1.11,
  "st_mass": 1.04,
  "sy_dist": 141.0,
  "pl_dens": 1.19,
  "discovery_year": 2015
}
```

Response:
```json
{
  "success": true,
  "planet": { ...planet data... },
  "prediction": { ...prediction result... }
}
```

### 4. Get All Exoplanets
```
GET /api/exoplanets
```

Response:
```json
{
  "success": true,
  "exoplanets": [
    { ...planet data... },
    { ...planet data... }
  ]
}
```

### 5. Rank Planets by Habitability
```
GET /api/rank
```

Response:
```json
{
  "success": true,
  "total": 5,
  "planets": [
    {
      "planet": { ...planet data... },
      "prediction": { ...prediction result... }
    }
  ]
}
```

### 6. Get Model Information
```
GET /api/model-info
```

Response:
```json
{
  "success": true,
  "model_type": "Random Forest",
  "features": [
    "pl_rade", "pl_bmasse", "pl_orbper", "pl_orbsmax", "pl_eqt",
    "st_teff", "st_rad", "st_mass", "sy_dist", "pl_dens"
  ],
  "version": "1.0"
}
```

## Feature Descriptions

| Feature | Unit | Description |
|---------|------|-------------|
| pl_rade | R⊕ | Planet Radius (Earth radii) |
| pl_bmasse | M⊕ | Planet Mass (Earth masses) |
| pl_orbper | days | Orbital Period |
| pl_orbsmax | AU | Semi-major Axis (Astronomical Units) |
| pl_eqt | K | Equilibrium Temperature (Kelvin) |
| st_teff | K | Stellar Effective Temperature |
| st_rad | R☉ | Stellar Radius (Solar radii) |
| st_mass | M☉ | Stellar Mass (Solar masses) |
| sy_dist | pc | Distance to System (parsecs) |
| pl_dens | g/cm³ | Planet Density |

## Habitability Classification

- **Highly Habitable** (70-100): Green - Strong conditions for life
- **Moderately Habitable** (50-69): Yellow - Marginal conditions
- **Low Habitability** (0-49): Red - Poor conditions for life

## Error Handling

All endpoints return error responses with status codes:

```json
{
  "error": "Error message",
  "success": false
}
```

Common status codes:
- 200: Success
- 201: Resource created
- 400: Bad request
- 500: Server error

## Deployment

### Heroku

```bash
# Create Procfile
echo "web: python app.py" > Procfile
git push heroku main
```

### Railway / Other Platforms

Update the host and port in `app.run()` as needed for your platform.

## Environment Variables

- `FLASK_ENV`: Set to `production` for production use
- `FLASK_DEBUG`: Set to `0` for production

## Dependencies

See `requirements.txt` for full list. Key packages:
- Flask 2.3.3
- Flask-CORS 4.0.0
- Flask-SQLAlchemy 3.0.5
- scikit-learn 1.3.0
- pandas 2.0.3
- numpy 1.24.3
