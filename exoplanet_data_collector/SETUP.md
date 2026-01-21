# ExoHabitAI - Complete Setup & Deployment Guide

Comprehensive guide for running ExoHabitAI locally and deploying to production. Full-stack ML application with Flask backend, Next.js frontend, and Random Forest classifier.

**Technology Stack:**
- **Frontend**: Next.js 16 (React 19, TypeScript, Tailwind CSS v4)
- **Backend**: Flask REST API with SQLAlchemy ORM
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ML**: Random Forest Classifier (scikit-learn)
- **API**: 12 RESTful endpoints with CORS

## Quick Start (5 minutes)

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on: `http://localhost:5000`

### Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

**Open:** http://localhost:3000

---

## Detailed Setup Instructions

### Backend (Flask)

#### 1. Python Environment Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Installs:**
- Flask 2.3.3 - Web framework
- Flask-CORS 4.0.0 - Cross-origin requests
- Flask-SQLAlchemy 3.0.5 - Database ORM
- scikit-learn 1.3.0 - ML library
- pandas 2.0.3 - Data processing
- numpy 1.24.3 - Numerical computing
- joblib 1.3.1 - Model persistence
- xgboost 2.0.0 - Advanced ML models

#### 3. Run the Server

```bash
python app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:5000
 * Database initialized
 * Loaded pre-trained model (or initialized default model)
```

#### 4. Verify Installation

```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{"status": "healthy", "model_loaded": true}
```

---

### Frontend (Next.js)

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Environment Configuration

File: `.env.local` (already created)

```
NEXT_PUBLIC_API_BASE=http://localhost:5000
```

For production, update to your deployed backend URL.

#### 3. Run Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local
```

#### 4. Build for Production

```bash
npm run build
npm run start
```

---

## Using the Application

### Interactive Demo Page

**URL**: http://localhost:3000/demo

**Features:**
- **Make Predictions**: Enter planet parameters or load samples
- **View Rankings**: See all planets ranked by habitability
- **Add Custom Planets**: Save new planets to database
- **Real-time Results**: Instant ML predictions with scores

### Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Project overview and features |
| Model | `/model` | ML architecture and metrics |
| Usage | `/usage` | 4-module pipeline guide |
| Demo | `/demo` | Interactive predictor and rankings |
| Docs | `/docs` | Complete API reference |

---

## API Endpoints Reference

### 1. Health Check
```
GET /api/health
```
Verify backend is running.

### 2. Make Prediction
```
POST /api/predict
Content-Type: application/json

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
Returns habitability prediction and score.

### 3. Add Planet
```
POST /api/add_planet
Content-Type: application/json

{
  "name": "Planet Name",
  "pl_rade": 1.0,
  "pl_bmasse": 1.0,
  "pl_orbper": 365,
  "pl_orbsmax": 1.0,
  "pl_eqt": 288,
  "st_teff": 5778,
  "st_rad": 1.0,
  "st_mass": 1.0,
  "sy_dist": 10.0,
  "pl_dens": 1.0,
  "discovery_year": 2020
}
```
Adds new planet to database and returns prediction.

### 4. Get Exoplanets
```
GET /api/exoplanets
```
Returns list of all exoplanets (auto-populated with samples).

### 5. Rank Planets
```
GET /api/rank
```
Returns planets ranked by habitability score (highest first).

### 6. Model Info
```
GET /api/model-info
```
Returns ML model details and feature list.

**See `/backend/README.md` for complete API documentation.**

---

## Testing the Setup

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Get sample planets
curl http://localhost:5000/api/exoplanets

# Get rankings
curl http://localhost:5000/api/rank

# Make prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"pl_rade":1.0,"pl_bmasse":1.0,"pl_orbper":365,"pl_orbsmax":1.0,"pl_eqt":288,"st_teff":5778,"st_rad":1.0,"st_mass":1.0,"sy_dist":10.0,"pl_dens":1.0}'
```

### Test Frontend

1. Open http://localhost:3000
2. Navigate through all pages
3. Go to `/demo` and test:
   - Load sample planets
   - Make predictions
   - View rankings
   - Add custom planet

---

## Troubleshooting

### Backend Issues

**Port 5000 Already in Use**
```python
# Edit backend/app.py, change port:
app.run(debug=True, host='0.0.0.0', port=5001)
```

**Module Import Errors**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Database Errors - Reset Database**
```bash
# Delete the SQLite database
rm backend/exohabitat.db

# Restart backend - it will recreate the database
python app.py
```

**Model Not Loading**
- First run uses default Random Forest model
- To use trained model: place `.pkl` files in `backend/models/`

### Frontend Issues

**Port 3000 Already in Use**
```bash
npm run dev -- -p 3001
```

**CORS Errors**
- Ensure backend running on port 5000
- Check `.env.local` has `NEXT_PUBLIC_API_BASE=http://localhost:5000`
- Verify Flask CORS enabled

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Blank Page or No Data**
- Check browser console (F12)
- Verify backend API responding: `curl http://localhost:5000/api/health`
- Check network tab for API calls

---

## Database

### SQLite (Development)

Automatically created at `backend/exohabitat.db`

**Tables:**
- **planets** - Exoplanet data
- **predictions** - Prediction results

**Sample Data** - Auto-populated on first run:
- TRAPPIST-1e
- Proxima Centauri b
- Kepler-452b

### PostgreSQL (Production)

For production deployment, update connection string in `backend/app.py`:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/exohabitat'
```

---

## Production Deployment

### Deploy Backend (Heroku)

```bash
cd backend

# Create Procfile if not exists
echo "web: python app.py" > Procfile

# Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

# Create and deploy
heroku create exohabitat-api
heroku config:set FLASK_ENV=production
git push heroku main

# View logs
heroku logs --tail
```

Backend URL: `https://exohabitat-api.herokuapp.com`

### Deploy Backend (Railway)

```bash
cd backend

# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Deploy Backend (AWS/Render)

- Set environment variables for production
- Use PostgreSQL for database
- Configure GUNICORN for WSGI server
- Enable HTTPS

### Deploy Frontend (Vercel)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in dashboard:
# NEXT_PUBLIC_API_BASE=https://your-backend-url.com
```

### Deploy Frontend (Netlify)

```bash
cd frontend

# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

---

## Production Checklist

- [ ] Update `NEXT_PUBLIC_API_BASE` to deployed backend
- [ ] Enable HTTPS on frontend and backend
- [ ] Set `FLASK_ENV=production`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Implement proper error handling
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Add authentication (optional)
- [ ] Test all features in production
- [ ] Set up automated backups

---

## Environment Variables

### Backend (Optional)
```
FLASK_ENV=production  # production or development
FLASK_DEBUG=0         # 0 for production
```

### Frontend (Required)
```
NEXT_PUBLIC_API_BASE=http://localhost:5000
```

---

## Next Steps

1. **Integrate Trained Model**: Replace default model with your trained classifier
2. **Add Features**: Implement filtering, favorites, comparisons
3. **User Accounts**: Add authentication and user profiles
4. **Real Data**: Connect NASA Exoplanet Archive API
5. **Analytics**: Track predictions and user metrics
6. **Mobile**: Build React Native version

---

## Support & Resources

- **API Documentation**: See `/backend/README.md`
- **Frontend Code**: `/frontend/` directory
- **Research Paper**: `AI_Machine-Learning-Approach-*.pdf`
- **Usage Guide**: http://localhost:3000/usage

---

## License

MIT License
