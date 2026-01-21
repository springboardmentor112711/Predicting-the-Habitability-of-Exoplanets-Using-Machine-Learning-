🪐 Exoplanet Habitability Prediction Using Machine Learning

📌 Project Summary

This project is an end-to-end machine learning–based web application designed to predict the habitability of exoplanets. It combines data preprocessing, model training, Flask backend APIs, database integration, and a browser-based user interface to provide predictions, rankings, and analytical insights.

The system accepts planetary parameters, processes them through a trained ML model, and returns habitability classification, scores, and rankings, supported by visual dashboards.

🎯 Problem Statement

With the rapid discovery of exoplanets, manually assessing habitability is impractical. This project automates the process by learning from historical exoplanet data and identifying patterns that indicate potential habitability.

🗂️ Project Structure (Actual)

EXOPLANET PROJECT/

│

├── backend/

│ ├── static/

│ │ └── style.css

│ │

│ ├── templates/

│ │ ├── index.html # Input form

│ │ ├── dashboard.html # Overview dashboard

│ │ ├── insights.html # Feature & data insights

│ │ ├── rank.html # Planet ranking

│ │ └── reset.html # Reset / clear data

│ │

│ ├── app.py # Flask application

│ ├── database.py # SQLite DB operations

│ ├── habitability.db # Local database

│ ├── habitability_model.pkl

│ ├── scaler.pkl

│ ├── render.yaml # Deployment config

│ └── requirements.txt

│

├── data & models/

│ ├── exoplanet.csv

│ ├── exoplanet_clean.csv

│ ├── exoplanet_module2_ready.csv

│ ├── habitability_model.pkl

│ ├── backup_models/

│ └── train_model.py

│

├── temp_backup/

├── Test/

├── .gitignore

└── README.md

🧠 Machine Learning Workflow

🔹 Dataset Preparation

Cleaned raw exoplanet datasets

Removed missing and irrelevant values

Selected features with strong correlation to habitability

Prepared datasets for training and testing (80:20 split)

🔹 Target Variable

Binary classification: Habitable / Non-Habitable

Habitability score for ranking purposes

🤖 Models Implemented

Random Forest Classifier (primary)

XGBoost Classifier (multi-level habitability)

Logistic Regression / SVM (comparison)

📊 Evaluation Metrics

Accuracy

Precision

Recall

F1-score

ROC-AUC

🧪 Model Training

Model training is handled in:

train_model.py

Outputs:

habitability_model.pkl

scaler.pkl

These are loaded directly into the Flask backend for inference.

🌐 Backend (Flask API)

Core Responsibilities

Accept user input via web forms

Preprocess inputs using trained scaler

Predict habitability using ML model

Store predictions in SQLite database

Return results in structured format

Key Files

app.py – API routes & logic

database.py – Database interactions

habitability.db – Stored predictions

🖥️ Frontend (UI)

Built using HTML, CSS, and Bootstrap.

Pages Included

Home Page: Input planetary parameters

Dashboard: Summary of predictions

Insights: Feature influence and trends

Ranking: Sorted list of exoplanets by habitability score

Reset: Clears stored data

📈 Visualization & Insights

Feature importance analysis

Habitability score distributions

Correlation analysis between planetary parameters

Ranking tables for top candidate exoplanets

🚀 Deployment

Deployment-ready using Render

Configuration included in render.yaml

Flask backend with model & database integration

🛠️ Technologies Used

Python

Flask

Scikit-learn

XGBoost

Pandas, NumPy

Matplotlib, Seaborn

SQLite

HTML, CSS, Bootstrap

Git & GitHub

📌 How to Run Locally

pip install -r requirements.txt

python backend/app.py

Open browser:

http://127.0.0.1:5000

📚 Academic Relevance

This project demonstrates:

Applied Machine Learning

Model evaluation and comparison

Backend–ML integration

Data-driven decision systems

End-to-end AI application development

👤 Author

Anand Joel

📜 License

Developed strictly for academic and educational purposes.
