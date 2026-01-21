# ExoHabitAI - Exoplanet Habitability Prediction

A comprehensive full-stack ML application for predicting exoplanet habitability with advanced machine learning, REST API, and responsive web interface. Built with Next.js 16 (frontend) and Flask (backend).

## Project Structure

```
ExoHabitAI/
├── backend/
│   ├── app.py                # Flask REST API with 12 endpoints
│   ├── database.py           # SQLAlchemy models (Planet, Prediction)
│   ├── config.py             # Environment configuration
│   ├── models/
│   │   ├── ml_model.py       # Random Forest implementation
│   │   ├── trained_model.pkl # Trained classifier
│   │   └── scaler.pkl        # Feature scaler
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment template
│   └── README.md             # Backend documentation
│
└── frontend/
    ├── app/
    │   ├── page.tsx              # Home page with features
    │   ├── demo/page.tsx         # Interactive predictor
    │   ├── model/page.tsx        # Model documentation
    │   ├── usage/page.tsx        # ML pipeline guide
    │   ├── docs/page.tsx         # API reference
    │   ├── layout.tsx            # Root layout
    │   └── globals.css           # Global styles
    ├── components/
    │   ├── navigation.tsx        # Navigation bar
    │   ├── footer.tsx            # Footer component
    │   └── ui/                   # shadcn/ui components
    ├── .env.local               # Environment config
    ├── package.json
    ├── tsconfig.json
    └── next.config.mjs
```

## Features

- **Interactive Predictor** - Real-time habitability predictions with live results visualization
- **12 REST API Endpoints** - Complete CRUD operations, search, filtering, ranking, statistics
- **ML Model** - Random Forest Classifier (100 estimators, 89% accuracy)
- **Database** - SQLAlchemy with Planet and Prediction models
- **5 Frontend Pages** - Home, Demo, Model, Usage, Docs
- **Comprehensive Docs** - API reference, ML pipeline guide, model architecture
- **Sample Planets** - Pre-loaded TRAPPIST-1e, Kepler-452b, Proxima Centauri b
- **Responsive Design** - Dark-themed UI with Tailwind CSS, mobile-friendly

## Quick Start

### Backend Setup (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Server runs on `http://localhost:5000`

### Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

**Open in browser:** http://localhost:3000

## ML Model

**Algorithm:** Random Forest Classifier
- **Estimators:** 100 decision trees
- **Max Depth:** 10 levels
- **Accuracy:** 89%
- **Precision:** 0.87 (Habitable class)
- **Recall:** 0.91 (Habitable class)
- **Inference Time:** <100ms per prediction

**Input Features (10 Parameters):**

Planetary Properties:
- `pl_rade` - Radius (Earth radii)
- `pl_bmasse` - Mass (Earth masses)
- `pl_orbper` - Orbital Period (days)
- `pl_orbsmax` - Semi-major Axis (AU)
- `pl_eqt` - Equilibrium Temperature (K)
- `pl_dens` - Density (g/cm³)

Stellar Properties:
- `st_teff` - Effective Temperature (K)
- `st_rad` - Radius (Solar radii)
- `st_mass` - Mass (Solar masses)
- `sy_dist` - Distance to System (parsecs)

**Habitability Classifications:**
- **Highly Habitable** (70-100%) - Strong life conditions
- **Moderately Habitable** (50-69%) - Marginal conditions
- **Low Habitability** (0-49%) - Unfavorable conditions

**Training Pipeline (4 Modules):**
1. Data Collection & Standardization - NASA Exoplanet Archive
2. Data Cleaning & Feature Engineering - Outlier removal, habitability scoring
3. ML Dataset Preparation - Train-test split, feature scaling
4. Model Training & Evaluation - RF training, cross-validation

## API Endpoints (12 Total)

### Core Functionality
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/predict` | Predict habitability |
| POST | `/api/add_planet` | Add exoplanet to database |
| GET | `/api/exoplanets` | Get all exoplanets |
| GET | `/api/rank` | Planets ranked by habitability |

### Data Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/planet/:id` | Get planet details |
| PUT | `/api/planet/:id` | Update planet |
| DELETE | `/api/planet/:id` | Delete planet |

### Analytics & Search
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/statistics` | Habitability statistics |
| GET | `/api/search?q=name` | Search planets |
| GET | `/api/filter` | Filter by classification/score |
| GET | `/api/model-info` | Model architecture info |

### Example: Make Prediction
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Response:**
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

## Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with features, how it works, ML pipeline |
| Predictor | `/demo` | Interactive predictor with planet ranking & statistics |
| Model | `/model` | ML architecture, features, performance metrics |
| Pipeline | `/usage` | 4-module ML pipeline with Python code examples |
| API Docs | `/docs` | Complete REST API reference with examples |

## Technology Stack

**Frontend (Next.js 16):**
- React 19.2
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide icons
- Fetch API for HTTP requests

**Backend (Flask):**
- Python 3.8+
- Flask 2.3.3
- SQLAlchemy ORM
- scikit-learn (Random Forest)
- pandas (data processing)
- numpy (numerical computing)
- joblib (model serialization)

**Database:**
- SQLite (development)
- PostgreSQL (production-ready)

## Deployment

### Backend (Heroku/Railway)
```bash
cd backend
# Ensure Procfile exists: web: python app.py
git push heroku main
```

### Frontend (Vercel)
```bash
cd frontend
vercel
# Update API_BASE in demo/page.tsx to deployed backend
```

## Testing

1. **Check backend health:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Make test prediction:**
   ```bash
   curl -X POST http://localhost:5000/api/predict \
     -H "Content-Type: application/json" \
     -d '{"pl_rade":1.0,"pl_bmasse":1.0,"pl_orbper":365,"pl_orbsmax":1.0,"pl_eqt":288,"st_teff":5778,"st_rad":1.0,"st_mass":1.0,"sy_dist":10.0,"pl_dens":1.0}'
   ```

3. **Open demo:** Navigate to http://localhost:3000/demo

## References

- NASA Exoplanet Archive: https://exoplanetarchive.ipac.caltech.edu/
- Scientific Research: "AI Machine Learning Approach for Predicting the Habitability Potential of Exoplanets"

## License

MIT License
