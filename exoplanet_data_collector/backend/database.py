"""
Database Models for ExoHabitAI
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Planet(db.Model):
    """Exoplanet data model"""
    __tablename__ = 'planets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False, index=True)
    
    # Planetary parameters
    pl_rade = db.Column(db.Float, nullable=False)  # Planet Radius (Earth radii)
    pl_bmasse = db.Column(db.Float, nullable=False)  # Planet Mass (Earth masses)
    pl_orbper = db.Column(db.Float, nullable=False)  # Orbital Period (days)
    pl_orbsmax = db.Column(db.Float, nullable=False)  # Semi-major Axis (AU)
    pl_eqt = db.Column(db.Float, nullable=False)  # Equilibrium Temperature (K)
    
    # Stellar parameters
    st_teff = db.Column(db.Float, nullable=False)  # Stellar Effective Temperature (K)
    st_rad = db.Column(db.Float, nullable=False)  # Stellar Radius (Solar radii)
    st_mass = db.Column(db.Float, nullable=False)  # Stellar Mass (Solar masses)
    
    # System parameters
    sy_dist = db.Column(db.Float, nullable=False)  # Distance to System (parsecs)
    pl_dens = db.Column(db.Float, nullable=False)  # Planet Density (g/cm³)
    
    discovery_year = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    predictions = db.relationship('Prediction', backref='planet', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'pl_rade': self.pl_rade,
            'pl_bmasse': self.pl_bmasse,
            'pl_orbper': self.pl_orbper,
            'pl_orbsmax': self.pl_orbsmax,
            'pl_eqt': self.pl_eqt,
            'st_teff': self.st_teff,
            'st_rad': self.st_rad,
            'st_mass': self.st_mass,
            'sy_dist': self.sy_dist,
            'pl_dens': self.pl_dens,
            'discovery_year': self.discovery_year,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Prediction(db.Model):
    """Prediction result model"""
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    planet_id = db.Column(db.Integer, db.ForeignKey('planets.id'), nullable=True, index=True)
    
    habitability_score = db.Column(db.Integer, nullable=False)
    classification = db.Column(db.String(255), nullable=False)
    color = db.Column(db.String(50), nullable=False)
    prediction_result = db.Column(db.Integer, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'planet_id': self.planet_id,
            'habitability_score': self.habitability_score,
            'classification': self.classification,
            'color': self.color,
            'prediction_result': self.prediction_result,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
