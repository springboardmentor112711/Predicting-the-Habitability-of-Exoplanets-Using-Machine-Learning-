import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

class ExoplanetHabitabilityModel:
    def __init__(self, model_path: str = None):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'stellar_temperature', 'stellar_radius', 'stellar_mass',
            'planet_radius', 'planet_mass', 'orbital_period',
            'orbital_distance', 'eccentricity'
        ]
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
    
    def train(self, X: np.ndarray, y: np.ndarray):
        """Train the habitability prediction model"""
        # Normalize features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Train Random Forest model
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            random_state=42
        )
        self.model.fit(X_scaled, y)
    
    def predict(self, features: dict) -> dict:
        """Make habitability prediction for a single exoplanet"""
        if not self.model or not self.scaler:
            raise ValueError("Model not trained or loaded")
        
        # Extract and order features
        X = np.array([[
            features['stellar_temperature'],
            features['stellar_radius'],
            features['stellar_mass'],
            features['planet_radius'],
            features['planet_mass'],
            features['orbital_period'],
            features['orbital_distance'],
            features['eccentricity'],
        ]])
        
        # Scale and predict
        X_scaled = self.scaler.transform(X)
        probability = self.model.predict_proba(X_scaled)[0]
        prediction = self.model.predict(X_scaled)[0]
        
        return {
            'habitability_score': float(probability[1] * 100),
            'classification': 'Potentially Habitable' if prediction == 1 else 'Non-Habitable',
            'confidence': float(max(probability) * 100)
        }
    
    def save_model(self, path: str):
        """Save model and scaler to disk"""
        joblib.dump(self.model, f"{path}/model.pkl")
        joblib.dump(self.scaler, f"{path}/scaler.pkl")
    
    def load_model(self, path: str):
        """Load model and scaler from disk"""
        self.model = joblib.load(f"{path}/model.pkl")
        self.scaler = joblib.load(f"{path}/scaler.pkl")
