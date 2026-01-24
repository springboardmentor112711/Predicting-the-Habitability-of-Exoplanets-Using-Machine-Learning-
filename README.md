# 🌌 ExoHabit AI  
### AI-Powered Exoplanet Habitability Analysis & Explainability Platform

ExoHabit AI is a **full-stack machine learning web application** that predicts, ranks, and explains the habitability of exoplanets using astrophysical parameters.  
The system combines **ML inference**, **data analytics**, and **interactive visualizations** to provide both **global insights** and **planet-specific explainability**.

---

## 🚀 Features

### 🔮 Habitability Prediction
- Predicts whether an exoplanet is habitable
- Outputs a **habitability probability score**
- Supports:
  - **Numeric input mode**
  - **Comparative mode** (Earth / Mars / Venus references)
  - **Autofill mode** using clustering

---

### 🏆 Planet Ranking
- Ranks exoplanets based on habitability probability
- Supports:
  - Sorting (radius, mass, temperature, habitability)
  - Search / filtering
  - Pagination
- Clickable rows redirect to **detailed insights**

---

### 📊 Insights & Explainability

#### All Planets Insights
- Feature importance (model explainability)
- Habitability score distribution
- Star–planet correlation heatmap

#### Single Planet Insights
- Habitability progress bar
- Risk classification (Low / Medium / High)
- Parameter table
- Planet vs Earth comparison chart

---

### 📁 Data Export
- Download **Top 10 Habitable Exoplanets** as:
  - Excel report
  - PDF report

---

## 🧠 Machine Learning Overview

- Model: **Scikit-learn Pipeline**
- Preprocessing:
  - Missing value imputation
  - Feature scaling (StandardScaler / MinMaxScaler)
  - One-hot encoding for categorical features (star type)
- Training data uses **Earth-relative astronomical units**
- Explainability via:
  - Feature importance
  - Correlation analysis

---

## 🏗️ Tech Stack

### Backend
- Flask (Python)
- Scikit-learn
- Joblib
- PostgreSQL (Supabase)
- Pandas, NumPy

### Frontend
- HTML + Jinja2 Templates
- Bootstrap 5
- Vanilla JavaScript
- Plotly.js (visualizations)

### Tools
- Git & GitHub
- VS Code
- Jupyter Notebook

---

## 📂 Project Structure

