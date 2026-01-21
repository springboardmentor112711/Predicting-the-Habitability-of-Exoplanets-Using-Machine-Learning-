# ExoHabitAI - Quick Reference Guide

Fast commands to get ExoHabitAI running and testing.

## Startup (2 Terminals)

### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

**Then open:** http://localhost:3000

---

## API Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Make Prediction
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

### Get All Planets
```bash
curl http://localhost:5000/api/exoplanets
```

### Get Rankings
```bash
curl http://localhost:5000/api/rank
```

### Get Statistics
```bash
curl http://localhost:5000/api/statistics
```

### Add Planet
```bash
curl -X POST http://localhost:5000/api/add_planet \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New-Planet",
    "pl_rade": 1.5,
    "pl_bmasse": 1.0,
    "pl_orbper": 365,
    "pl_orbsmax": 1.0,
    "pl_eqt": 288,
    "st_teff": 5778,
    "st_rad": 1.0,
    "st_mass": 1.0,
    "sy_dist": 10.0,
    "pl_dens": 1.0,
    "discovery_year": 2024
  }'
```

---

## All 12 API Endpoints

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | GET | `/api/health` | Health check |
| 2 | POST | `/api/predict` | Predict habitability |
| 3 | POST | `/api/add_planet` | Add planet to DB |
| 4 | GET | `/api/exoplanets` | Get all planets |
| 5 | GET | `/api/rank` | Rank by habitability |
| 6 | GET | `/api/planet/:id` | Get planet details |
| 7 | PUT | `/api/planet/:id` | Update planet |
| 8 | DELETE | `/api/planet/:id` | Delete planet |
| 9 | GET | `/api/statistics` | Get stats |
| 10 | GET | `/api/search?q=name` | Search planets |
| 11 | GET | `/api/filter` | Filter planets |
| 12 | GET | `/api/model-info` | Model details |

---

## Frontend Pages

| URL | Page | Features |
|-----|------|----------|
| `/` | Home | Features, how it works, CTA |
| `/demo` | Predictor | Interactive form, rankings, stats |
| `/model` | Model Docs | Architecture, metrics, features |
| `/usage` | Pipeline | 4 modules with code examples |
| `/docs` | API Ref | All 12 endpoints documented |

---

## Configuration

### Backend .env
```
FLASK_ENV=development
DATABASE_URL=sqlite:///exohabitat.db
```

### Frontend .env.local
```
NEXT_PUBLIC_API_BASE=http://localhost:5000
```

---

## Database Reset

```bash
cd backend
rm exohabitat.db
python app.py
```

---

## Build for Production

### Backend
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## Deploy to Heroku (Backend)

```bash
cd backend

# Create Procfile
echo "web: python app.py" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
heroku logs --tail
```

---

## Deploy to Vercel (Frontend)

```bash
cd frontend
vercel

# Then set environment variable:
# NEXT_PUBLIC_API_BASE=https://your-backend-url.com
```

---

## Troubleshooting

### Port Already in Use
```bash
# Backend
python app.py --port 5001

# Frontend
npm run dev -- -p 3001
```

### CORS Error
1. Ensure backend running
2. Check .env.local: `NEXT_PUBLIC_API_BASE=http://localhost:5000`
3. Restart frontend: `npm run dev`

### Database Locked
```bash
cd backend
rm exohabitat.db
python app.py
```

### Module Not Found
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

---

## Sample Planets (Pre-loaded)

- TRAPPIST-1e
- Proxima Centauri b
- Kepler-452b

---

## ML Model Details

- **Algorithm**: Random Forest (100 trees)
- **Accuracy**: 89%
- **Input Features**: 10 (planetary & stellar)
- **Output**: Habitability score (0-100%) + classification
- **Training Data**: Synthetic (default) or custom
- **Model Size**: 2-3 MB

---

## Input Parameters (10 Total)

```
Planetary:
- pl_rade (radius, Earth radii)
- pl_bmasse (mass, Earth masses)
- pl_orbper (period, days)
- pl_orbsmax (axis, AU)
- pl_eqt (temperature, K)
- pl_dens (density, g/cm³)

Stellar:
- st_teff (temperature, K)
- st_rad (radius, Solar radii)
- st_mass (mass, Solar masses)
- sy_dist (distance, parsecs)
```

---

## Habitability Classifications

- **Highly Habitable** (70-100%) - Green
- **Moderately Habitable** (50-69%) - Yellow
- **Low Habitability** (0-49%) - Red

---

## File Structure

```
ExoHabitAI/
├── backend/ (Flask, 12 endpoints)
│   ├── app.py
│   ├── database.py
│   ├── config.py
│   ├── models/ml_model.py
│   ├── requirements.txt
│   └── README.md
├── frontend/ (Next.js, 5 pages)
│   ├── app/
│   │   ├── page.tsx
│   │   ├── demo/page.tsx
│   │   ├── model/page.tsx
│   │   ├── usage/page.tsx
│   │   ├── docs/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   ├── .env.local
│   └── package.json
├── README.md (comprehensive)
├── SETUP.md (deployment)
└── QUICK_REFERENCE.md (this file)
```

---

## Quick Stats

- **Lines of Code**: 2000+
- **API Endpoints**: 12
- **Frontend Pages**: 5
- **Database Tables**: 2
- **ML Accuracy**: 89%
- **Prediction Time**: <100ms
- **Responsive Design**: Yes
- **Mobile Friendly**: Yes

---

## Documentation Links

- **Full README**: `README.md`
- **Setup Guide**: `SETUP.md`
- **Project Summary**: `PROJECT_SUMMARY.md`
- **API Docs**: http://localhost:3000/docs (when running)
- **Model Info**: http://localhost:3000/model
- **Pipeline Guide**: http://localhost:3000/usage
- **Backend README**: `/backend/README.md`

---

## Next Steps

1. Start backend: `cd backend && python app.py`
2. Start frontend: `cd frontend && npm run dev`
3. Open: http://localhost:3000
4. Try the demo: http://localhost:3000/demo
5. Read docs: http://localhost:3000/docs

---

## Support

- Check browser console (F12) for errors
- Check server terminal for backend logs
- See SETUP.md for troubleshooting
- Review API docs at `/docs`

---

**Happy predicating!**
