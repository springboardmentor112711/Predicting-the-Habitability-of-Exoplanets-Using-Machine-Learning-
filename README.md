# ExoHabit AI
**AI-Driven Exoplanet Habitability Prediction & Explainability Platform**

ExoHabit AI is a full-stack machine learning web application that predicts and explains the habitability of exoplanets using astrophysical data.  
It combines ML inference, statistical analysis, and interactive visualizations to support both global discovery and planet-level explainability.

---
## Access the site on: 

'''https://exohabit-ai.onrender.com/'''


## Key Capabilities

- Predicts habitability probability of exoplanets
- Ranks planets by habitability score
- Provides model explainability and insights
- Interactive dashboards and comparisons
- Exportable analytical reports (PDF / Excel)

---

## Machine Learning Pipeline

- Model: Scikit-learn Pipeline
- Preprocessing:
  - Missing value imputation
  - Feature scaling
  - One-hot encoding (star type)
- Training basis: Earth-relative astronomical units
- Explainability:
  - Feature importance
  - Correlation analysis

---

## Application Features

### Habitability Prediction
- Numeric parameter input
- Earth / Mars / Venus reference comparison
- Autofill using clustering

### Planet Ranking
- Sort and filter by astrophysical parameters
- Search and pagination
- Click-through detailed insights

### Insights and Explainability
- Feature importance visualization
- Habitability score distribution
- Star–planet correlation heatmap
- Planet vs Earth comparison

---

## Tech Stack

### Backend
- Flask (Python)
- Scikit-learn
- Pandas, NumPy
- PostgreSQL (Supabase)

### Frontend
- HTML + Jinja2
- Bootstrap 5
- Vanilla JavaScript
- Plotly.js

---

## Project Structure

```
ExoHabit-AI/
├── app.py
├── habitability_trained.pkl
├── templates/
├── static/
├── cleaned-dataset-m1.ipynb
└── requirements.txt
```


---

## Input Parameters

| Parameter | Unit |
|---------|------|
| Radius | Earth radii (R⊕) |
| Mass | Earth masses (M⊕) |
| Temperature | Kelvin |
| Distance | AU |
| Semi-major Axis | AU |
| Eccentricity | Unitless |
| Star Type | Spectral Class (M, K, G, F, A) |

---

## Run Locally

```bash
git clone https://github.com/your-username/ExoHabit-AI.git
cd ExoHabit-AI
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
