# Predicting the Habitability of Exoplanets Using Machine Learning

## Overview

This project uses machine learning algorithms to predict whether exoplanets discovered by NASA are potentially habitable. By analyzing various planetary and stellar characteristics, the system provides habitability classifications and scores that could help astronomers prioritize planets for further study.

## Problem Statement

With thousands of exoplanets discovered, it's challenging to determine which ones might support life. This project addresses that challenge by creating an automated system that evaluates habitability based on scientific data from the NASA Exoplanet Archive.

## Features

- Data preprocessing and cleaning of NASA exoplanet datasets
- Feature engineering based on astrophysical principles
- Multiple machine learning models for habitability prediction
- REST API for real-time predictions
- Database integration for storing planet data
- Ranking system to identify most promising candidates

## Technology Stack

- **Programming Language**: Python 3.8+
- **Machine Learning**: Scikit-learn, XGBoost
- **Web Framework**: Flask
- **Database**: SQLite
- **Data Analysis**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn

## Dataset

The project uses data from the NASA Exoplanet Archive, which includes:
- Planetary characteristics (radius, mass, orbital period)
- Stellar properties (temperature, luminosity, metallicity)
- Orbital parameters (eccentricity, distance from star)

After cleaning and preprocessing, approximately 6,000 unique exoplanets are available for analysis.

## Methodology

### 1. Data Preprocessing
- Handling missing values
- Removing duplicates
- Filtering out invalid or uncertain measurements
- Normalizing features for model training

### 2. Feature Engineering
Created derived features including:
- Planet density calculations
- Stellar luminosity estimates
- Habitability score index
- Stellar compatibility metrics
- Distance-based radiation exposure

### 3. Model Development
Implemented and compared multiple algorithms:
- Linear Regression (baseline)
- Random Forest
- XGBoost (best performance)

Both regression (habitability score) and classification (habitable/non-habitable) approaches were developed.

### 4. Model Evaluation
- Cross-validation to prevent overfitting
- Multiple metrics: RMSE, R², Accuracy, Precision, Recall, ROC-AUC
- Feature importance analysis
- Hyperparameter optimization

## API Endpoints

The Flask API provides the following endpoints:

**GET /**
- Returns API status and available routes

**POST /add_planet**
- Add a new planet to the database
- Requires planet characteristics as JSON input

**POST /predict**
- Predicts habitability for given planet parameters
- Returns habitability classification and score

**GET /rank**
- Returns ranked list of planets by habitability score
- Optional parameter: `top=N` to limit results

## Installation

```bash
# Clone the repository
git clone https://github.com/springboardmentor112711/Predicting-the-Habitability-of-Exoplanets-Using-Machine-Learning-.git

# Navigate to project directory
cd Predicting-the-Habitability-of-Exoplanets-Using-Machine-Learning-

# Install required packages
pip install -r requirements.txt

# Run the application
python app.py
```

## Project Structure

```
project/
├── backend/
│   ├── app.py                  # Flask application
│   ├── models/                 # Trained ML models
│   ├── data/                   # Dataset files
│   └── requirements.txt        # Dependencies
├── notebooks/                  # Jupyter notebooks for analysis
└── README.md
```

## Results

The XGBoost model achieved the best performance:
- Classification ROC-AUC: ~0.83
- Strong correlation between predictions and actual habitability indicators
- Feature importance analysis revealed key factors affecting habitability

## Future Improvements

- Develop interactive web frontend
- Implement multi-class habitability classification
- Add explainable AI features (SHAP values)
- Deploy to cloud platform
- Integrate real-time data updates from NASA
- Add user authentication and personalized dashboards

## Acknowledgments

- NASA Exoplanet Archive for providing the dataset
- Springboard Mentor Program for guidance and support

## Deployment link

https://exo-frontend.onrender.com/
