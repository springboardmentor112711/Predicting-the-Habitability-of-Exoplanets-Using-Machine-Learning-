# 🌍 ExoHabitatAI

**AI-Powered Exoplanet Habitability Prediction System**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-lightgrey.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A machine learning application that analyzes exoplanet data to predict habitability potential, featuring a Flask REST API and interactive web dashboard.

---

## 📋 Overview

ExoHabitatAI processes planetary and stellar parameters through trained ML models to classify and rank exoplanets based on habitability scores.

### Features

- 🤖 **Machine Learning Models**: Random Forest, XGBoost, Logistic Regression with ensemble predictions
- 🌐 **REST API**: Comprehensive Flask backend with prediction and analytics endpoints
- 📊 **Interactive Dashboard**: Real-time visualizations using Plotly.js with multiple chart types
- 🏆 **Smart Rankings**: Advanced exoplanet ranking system with customizable top-N results
- 📄 **Export Functionality**: PDF and Excel export capabilities for reports and data
- 🎨 **Modern UI**: Responsive space-themed interface with dark mode
- 📈 **Analytics**: Comprehensive statistics and feature importance analysis
- 🔍 **Health Monitoring**: Built-in API health checks and error handling

---

## 🏗️ Project Structure

```
ExoHabitatAI/
├── app.py                  # Flask application
├── config.py               # Configuration
├── requirements.txt          # Dependencies
├── .gitattributes      
├── .gitignore             # Git ignore rules
│
├── api/                    # REST API
│   └── routes.py
│
├── src/                    # Source modules
│   ├── data_collection/
│   ├── preprocessing/
│   ├── ml/
│   └── utils/
│
├── data/                   # Data files
│   ├── processed/
│   ├── raw/
│   └── models/
│
├── templates/              # HTML pages
│   ├── index.html
│   ├── dashboard.html
│   └── results.html
│
├── static/                 # CSS & JS
│   ├── css/
│   └── js/
│
├── visualization/          # Charts
│   └── dashboard.py
│
├── scripts/                # Utilities
│   ├── run_pipeline.py
│   └── test_export.py
│
├── docs/                   # Documentation
│   ├── EXPORT_GUIDE.md
│   ├── HABITABILITY_SCORE_INDEX.md
│   ├── PROJECT_OVERVIEW.md
│   └── QUICK_START.md               
```

---

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.8 or higher
- **pip**: Latest version
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for data and models

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)
- **Browser**: Modern browser with JavaScript enabled (Chrome, Firefox, Safari, Edge)
- **Internet**: Required for initial setup and data downloads

### Installation

```bash
# Clone repository
cd ExoHabitatAI

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

Open browser: **http://localhost:5000**

---

## 💻 Usage

### Web Interface

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Make predictions |
| Dashboard | `/dashboard` | View analytics |
| Rankings | `/results` | Top habitable exoplanets |

### Rankings Page Features

- **Show Top Filter**: Select 10, 25, 50, or 100 planets
- **Export PDF**: Download PDF report
- **Export Excel**: Download spreadsheet
- **Sortable Table**: View planet details

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict` | POST | Predict habitability |
| `/api/planets` | GET | Get exoplanet data |
| `/api/rankings?top=N` | GET | Get top N rankings |
| `/api/statistics` | GET | Dataset statistics |
| `/api/export/pdf?top=N` | GET | Export PDF |
| `/api/export/excel?top=N` | GET | Export Excel |
| `/api/health` | GET | Health check endpoint |

### Example: Predict Habitability

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "radius": 1.2,
    "mass": 2.5,
    "density": 5.5,
    "surface_temp": 288,
    "orbital_period": 365,
    "distance_from_star": 1.0,
    "star_type": "G",
    "star_temp": 5778,
    "metallicity": 0.0
  }'
```

### Example: Get Rankings

```bash
curl http://localhost:5000/api/rankings?top=10
```

### Example: Export

```bash
# Download PDF
curl -O http://localhost:5000/api/export/pdf?top=50

# Download Excel
curl -O http://localhost:5000/api/export/excel?top=100
```

---

## 🧠 Machine Learning

### Models

| Model | Purpose |
|-------|---------|
| Random Forest | Primary classifier |
| XGBoost | High-accuracy predictions |
| Logistic Regression | Baseline comparison |

### Features Used

**Planetary:**
- Radius, Mass, Density
- Surface Temperature
- Orbital Period
- Distance from Star

**Stellar:**
- Star Type (O, B, A, F, G, K, M)
- Star Temperature
- Luminosity
- Metallicity

**Engineered:**
- Habitability Score Index (HSI)
- Stellar Compatibility Index (SCI)
- Radius/Distance Ratio
- Mass/Radius Ratio

### Performance

- Accuracy: 85-92%
- Precision: 84-90%
- ROC-AUC: 0.88-0.94

---

## ⚙️ Configuration

Edit `config.py`:

```python
DATABASE_TYPE = 'csv'
DATA_PATH = 'data/processed/exoplanets_processed.csv'
MODEL_DIR = 'data/models/'
HOST = '0.0.0.0'
PORT = 5000
DEBUG = True
```

---

## 📦 Dependencies

```
pandas
numpy
scikit-learn
flask
matplotlib
seaborn
plotly
openpyxl
xlsxwriter
reportlab
xgboost
requests
```

Install all: `pip install -r requirements.txt`

---

## 🧪 Testing

```bash
# Test export functionality
python scripts/test_export.py

# Test API health
curl http://localhost:5000/api/health

# Test API rankings
curl http://localhost:5000/api/rankings?top=5
```

### Troubleshooting

**Common Issues:**

- **Port 5000 already in use**: Change port in `config.py` or kill process using `netstat -ano | findstr :5000`
- **Import errors**: Ensure virtual environment is activated and all dependencies are installed
- **Model loading errors**: Check that model files exist in `data/models/` directory
- **Data loading errors**: Verify CSV files exist in `data/processed/` directory
- **Memory errors**: Ensure sufficient RAM (8GB recommended for large datasets)

**Debug Mode:**
Set `DEBUG = True` in `config.py` for detailed error messages during development.

---

## 📚 Documentation

- [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) - Full details
- [docs/QUICK_START.md](docs/QUICK_START.md) - Setup guide
- [docs/HABITABILITY_SCORE_INDEX.md](docs/HABITABILITY_SCORE_INDEX.md) - HSI algorithm
- [docs/EXPORT_GUIDE.md](docs/EXPORT_GUIDE.md) - Export features

---

## � Deployment

### Local Development
```bash
# Follow Quick Start instructions above
python app.py
```

### Production Deployment

1. **Set production config**:
   ```python
   # config.py
   DEBUG = False
   HOST = '0.0.0.0'
   PORT = 8000
   ```

2. **Use WSGI server** (recommended for production):
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

3. **Docker deployment** (optional):
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["python", "app.py"]
   ```

### Environment Variables

Create a `.env` file for sensitive configuration:
```bash
# .env
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost/db
DEBUG=False
```

---

## 📊 Data

### Sources
- **Primary**: NASA Exoplanet Archive (confirmed exoplanets)
- **Secondary**: Kaggle datasets and astronomical surveys
- **Updates**: Data can be refreshed from official sources

### Dataset Statistics
- **Total Records**: 219,000+ exoplanets
- **Features**: 15+ planetary and stellar parameters
- **Data Types**: Numerical, categorical, and derived features
- **Update Frequency**: Regular updates from astronomical databases

### Key Features Used
**Planetary Parameters:**
- Radius, Mass, Density, Surface Temperature
- Orbital Period, Semi-major Axis, Eccentricity

**Stellar Parameters:**
- Star Type (O, B, A, F, G, K, M classifications)
- Star Temperature, Luminosity, Metallicity
- Stellar Age, Stellar Mass

**Engineered Features:**
- Habitability Score Index (HSI)
- Stellar Compatibility Index (SCI)
- Orbital zone classifications
- Mass-radius relationships

---

## 🤝 Contributing

1. Fork repository
2. Create branch: `git checkout -b feature/name`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/name`
5. Open Pull Request

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

- NASA Exoplanet Archive
- Kaggle Datasets
- scikit-learn, XGBoost, Flask, Plotly

---

**Made with ❤️ for exoplanet research**

*Last updated: January 20, 2026*

