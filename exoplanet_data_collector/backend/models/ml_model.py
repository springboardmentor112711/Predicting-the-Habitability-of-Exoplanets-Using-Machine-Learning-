"""
Machine Learning Model for Exoplanet Habitability Prediction
"""

import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import warnings

warnings.filterwarnings('ignore')


class HabitabilityPredictor:
    """ML model for predicting exoplanet habitability"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'pl_rade', 'pl_bmasse', 'pl_orbper', 'pl_orbsmax', 'pl_eqt',
            'st_teff', 'st_rad', 'st_mass', 'sy_dist', 'pl_dens'
        ]
    
    def initialize(self):
        """Initialize the model"""
        model_path = os.path.join(os.path.dirname(__file__), 'best_habitability_model.pkl')
        scaler_path = os.path.join(os.path.dirname(__file__), 'ml_scaler.pkl')
        
        # Try to load pre-trained model, otherwise create default
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            try:
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path)
                print("[ML] Loaded pre-trained model and scaler")
            except Exception as e:
                print(f"[ML] Error loading pre-trained model: {e}. Using default model.")
                self._create_default_model()
        else:
            self._create_default_model()
    
    def _create_default_model(self):
        """Create a default Random Forest model for demo"""
        # Generate synthetic training data for initialization
        np.random.seed(42)
        n_samples = 100
        
        X = np.random.randn(n_samples, len(self.feature_names))
        # Create synthetic labels (roughly 60% habitable, 40% not habitable)
        y = np.random.binomial(1, 0.6, n_samples)
        
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Train Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(X_scaled, y)
        print("[ML] Initialized default Random Forest model")
    
    def predict(self, data_dict):
        """
        Make a prediction from a data dictionary
        
        Args:
            data_dict: Dictionary with feature values
            
        Returns:
            Dictionary with prediction results
        """
        if self.model is None or self.scaler is None:
            raise Exception("Model not initialized")
        
        # Extract features in correct order
        features = []
        for fname in self.feature_names:
            if fname in data_dict:
                features.append(float(data_dict[fname]))
            else:
                features.append(1.0)
        
        # Make prediction
        X = np.array(features).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        
        habitability_score = int(probabilities[1] * 100)
        
        # Classify habitability
        if habitability_score >= 70:
            classification = "Highly Habitable"
            color = "green"
        elif habitability_score >= 50:
            classification = "Moderately Habitable"
            color = "yellow"
        else:
            classification = "Low Habitability"
            color = "red"
        
        return {
            'prediction': int(prediction),
            'habitability_score': habitability_score,
            'classification': classification,
            'color': color,
            'probabilities': {
                'not_habitable': float(probabilities[0]),
                'habitable': float(probabilities[1])
            }
        }
    
    def save_model(self, model_dir=None):
        """Save the trained model"""
        if model_dir is None:
            model_dir = os.path.dirname(__file__)
        
        model_path = os.path.join(model_dir, 'trained_model.pkl')
        scaler_path = os.path.join(model_dir, 'scaler.pkl')
        
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, scaler_path)
        print(f"[ML] Model saved to {model_path}")
