# 🌍 ExoAI-Planet  
## Exoplanet Habitability Prediction Using Machine Learning

🚀 **Live Deployment:**  
https://exo-ai-planet-vc13.onrender.com/

ExoAI-Planet is a **Flask-based machine learning web application** that predicts the habitability of exoplanets using planetary and stellar parameters derived from **NASA Exoplanet data**.  

The system integrates an **XGBoost model**, **Flask REST APIs**, **database storage**, and **cloud deployment** into a complete end-to-end AI solution.

---

## 🎯 Project Objectives

- Predict whether an exoplanet is **Habitable** or **Not Habitable**
- Generate a **habitability probability score (0.0 – 1.0)**
- Provide predictions via **Flask REST APIs**
- Store and rank predictions in a database
- Deploy the application on cloud infrastructure

---

## ✨ Key Features

- 🤖 Machine learning–based habitability prediction using **XGBoost**
- 📊 Probability-based output for better interpretability
- 🌐 Flask backend with RESTful APIs
- 💾 Persistent storage of predictions
- 🏆 Ranked list of exoplanets based on confidence score

---

## 🧠 Machine Learning Model

**Algorithm Used:**  
- XGBoost Classifier (Extreme Gradient Boosting)

XGBoost is chosen for its high accuracy, ability to handle nonlinear relationships, and strong performance on structured scientific datasets.

---

## 📂 Dataset and Training

**Dataset:**  
- `NASA_Exoplanet_dataset.csv`  
- Source: **NASA Exoplanet Archive**

**Training Notebook:**  
- `file.ipynb`

The dataset is cleaned and preprocessed, and the trained model is exported and used directly by the Flask backend for real-time predictions.

---

## 🔢 Input Features

- Planet Radius  
- Planet Mass  
- Planet Density  
- Planet Equilibrium Temperature  
- Orbital Period  
- Semi-major Axis  
- Incident Stellar Flux  
- Stellar Luminosity  
- Stellar Effective Temperature  
- Stellar Mass  
- Stellar Radius  
- Stellar Metallicity  

---

## 📈 Model Output

- Habitability probability score **(0.0 – 1.0)**
- Binary classification:
  - **Habitable**
  - **Not Habitable**

---

## 🛠️ Technology Stack

**Frontend**
- HTML  
- CSS  
- JavaScript  
- Bootstrap  

**Backend**
- Python  
- Flask  
- Flask-CORS  

**Machine Learning**
- NumPy  
- Pandas  
- scikit-learn  
- XGBoost  
- Joblib  

**Database**
- Supabase (PostgreSQL)  
- SQLite  

**Deployment**
- Render  

---

## 🗂️ Project Structure

ExoAI-Planet/
├── static/
├── .gitignore
├── Procfile
├── app.py
├── build.sh
├── habitability_model.pkl
├── model_features.pkl
├── render.yaml
├── requirements.txt
├── runtime.txt
├── supabase_schema.sql
├── test_endpoints.py
├── vercel.json
└── README.md


---

## 🌐 Live Deployment

🔗 https://exo-ai-planet-vc13.onrender.com/

> ⏳ Note: The free Render instance may take a few seconds to start on the first request.

---

## 🔮 Future Enhancements

- Integrate NASA Exoplanet Archive API
- Add more astrophysical features
- Improve analytics and visualization
- Experiment with advanced machine learning models
