from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Import custom modules
from database import db, Planet, Prediction
from models.ml_model import HabitabilityPredictor
from config import config

# Create Flask app
app = Flask(__name__)

# Load configuration
env = os.getenv('FLASK_ENV', 'development')
app.config.from_object(config.get(env, config['default']))

# Initialize extensions
CORS(app)
db.init_app(app)

# Global ML model instance
predictor = HabitabilityPredictor()

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': predictor.model is not None
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    """Make habitability prediction"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Get prediction from ML model
        result = predictor.predict(data)
        
        # Save to database
        planet_id = data.get('planet_id', None)
        
        prediction_record = Prediction(
            planet_id=planet_id,
            habitability_score=result['habitability_score'],
            classification=result['classification'],
            color=result['color'],
            prediction_result=result['prediction']
        )
        db.session.add(prediction_record)
        db.session.commit()
        
        return jsonify({'success': True, **result})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/add_planet', methods=['POST'])
def add_planet():
    """Add a new planet to the database"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'name', 'pl_rade', 'pl_bmasse', 'pl_orbper', 'pl_orbsmax',
            'pl_eqt', 'st_teff', 'st_rad', 'st_mass', 'sy_dist', 'pl_dens'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if planet already exists
        existing = Planet.query.filter_by(name=data['name']).first()
        if existing:
            return jsonify({'error': f"Planet '{data['name']}' already exists"}), 400
        
        # Create new planet
        planet = Planet(
            name=data['name'],
            pl_rade=float(data['pl_rade']),
            pl_bmasse=float(data['pl_bmasse']),
            pl_orbper=float(data['pl_orbper']),
            pl_orbsmax=float(data['pl_orbsmax']),
            pl_eqt=float(data['pl_eqt']),
            st_teff=float(data['st_teff']),
            st_rad=float(data['st_rad']),
            st_mass=float(data['st_mass']),
            sy_dist=float(data['sy_dist']),
            pl_dens=float(data['pl_dens']),
            discovery_year=int(data.get('discovery_year', 0))
        )
        
        db.session.add(planet)
        db.session.commit()
        
        # Make prediction for the new planet
        prediction_data = {k: getattr(planet, k) for k in predictor.feature_names}
        prediction_result = predictor.predict(prediction_data)
        
        return jsonify({
            'success': True,
            'planet': planet.to_dict(),
            'prediction': prediction_result
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/rank', methods=['GET'])
def rank_planets():
    """Get all planets ranked by habitability score"""
    try:
        planets = Planet.query.all()
        ranked_planets = []
        
        for planet in planets:
            # Get latest prediction for this planet
            latest_pred = Prediction.query.filter_by(planet_id=planet.id).order_by(
                Prediction.created_at.desc()
            ).first()
            
            if latest_pred:
                ranked_planets.append({
                    'planet': planet.to_dict(),
                    'prediction': latest_pred.to_dict()
                })
        
        # Sort by habitability score descending
        ranked_planets.sort(
            key=lambda x: x['prediction']['habitability_score'],
            reverse=True
        )
        
        return jsonify({
            'success': True,
            'total': len(ranked_planets),
            'planets': ranked_planets
        })
    
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/exoplanets', methods=['GET'])
def get_exoplanets():
    """Get all exoplanets from database"""
    try:
        planets = Planet.query.all()
        
        # If no planets in database, populate with samples
        if not planets:
            sample_planets = [
                {
                    'name': 'Proxima Centauri b',
                    'pl_rade': 1.27,
                    'pl_bmasse': 1.27,
                    'pl_orbper': 11.186,
                    'pl_orbsmax': 0.0485,
                    'pl_eqt': 234,
                    'st_teff': 3042,
                    'st_rad': 0.14,
                    'st_mass': 0.12,
                    'sy_dist': 1.3,
                    'pl_dens': 0.78,
                    'discovery_year': 2016
                },
                {
                    'name': 'TRAPPIST-1e',
                    'pl_rade': 0.92,
                    'pl_bmasse': 0.62,
                    'pl_orbper': 6.099,
                    'pl_orbsmax': 0.02925,
                    'pl_eqt': 246,
                    'st_teff': 2566,
                    'st_rad': 0.117,
                    'st_mass': 0.089,
                    'sy_dist': 12.1,
                    'pl_dens': 0.73,
                    'discovery_year': 2017
                },
                {
                    'name': 'Kepler-452b',
                    'pl_rade': 1.6,
                    'pl_bmasse': 5.0,
                    'pl_orbper': 384.8,
                    'pl_orbsmax': 1.046,
                    'pl_eqt': 265,
                    'st_teff': 5757,
                    'st_rad': 1.11,
                    'st_mass': 1.04,
                    'sy_dist': 141.0,
                    'pl_dens': 1.19,
                    'discovery_year': 2015
                }
            ]
            
            for sample in sample_planets:
                if not Planet.query.filter_by(name=sample['name']).first():
                    new_planet = Planet(**sample)
                    db.session.add(new_planet)
            db.session.commit()
            planets = Planet.query.all()
        
        return jsonify({
            'success': True,
            'exoplanets': [planet.to_dict() for planet in planets]
        })
    
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        'success': True,
        'model_type': 'Random Forest Classifier',
        'features': predictor.feature_names,
        'version': '1.0'
    })


@app.route('/api/planet/<int:planet_id>', methods=['GET'])
def get_planet(planet_id):
    """Get specific planet by ID"""
    try:
        planet = Planet.query.get(planet_id)
        if not planet:
            return jsonify({'error': 'Planet not found'}), 404
        
        # Get latest prediction
        latest_pred = Prediction.query.filter_by(planet_id=planet_id).order_by(
            Prediction.created_at.desc()
        ).first()
        
        return jsonify({
            'success': True,
            'planet': planet.to_dict(),
            'prediction': latest_pred.to_dict() if latest_pred else None
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/planet/<int:planet_id>', methods=['DELETE'])
def delete_planet(planet_id):
    """Delete a planet"""
    try:
        planet = Planet.query.get(planet_id)
        if not planet:
            return jsonify({'error': 'Planet not found'}), 404
        
        db.session.delete(planet)
        db.session.commit()
        
        return jsonify({'success': True, 'message': f"Planet '{planet.name}' deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/planet/<int:planet_id>', methods=['PUT'])
def update_planet(planet_id):
    """Update planet data"""
    try:
        planet = Planet.query.get(planet_id)
        if not planet:
            return jsonify({'error': 'Planet not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        allowed_fields = [
            'name', 'pl_rade', 'pl_bmasse', 'pl_orbper', 'pl_orbsmax',
            'pl_eqt', 'st_teff', 'st_rad', 'st_mass', 'sy_dist', 'pl_dens',
            'discovery_year'
        ]
        
        for field in allowed_fields:
            if field in data:
                if field == 'discovery_year':
                    setattr(planet, field, int(data[field]))
                else:
                    setattr(planet, field, float(data[field]))
        
        db.session.commit()
        
        # Make new prediction with updated data
        prediction_data = {k: getattr(planet, k) for k in predictor.feature_names}
        prediction_result = predictor.predict(prediction_data)
        
        return jsonify({
            'success': True,
            'planet': planet.to_dict(),
            'prediction': prediction_result
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """Get all predictions"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        predictions = Prediction.query.order_by(
            Prediction.created_at.desc()
        ).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'predictions': [p.to_dict() for p in predictions.items],
            'total': predictions.total,
            'pages': predictions.pages,
            'current_page': page
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get habitability statistics"""
    try:
        total_planets = Planet.query.count()
        
        predictions = Prediction.query.all()
        
        if not predictions:
            return jsonify({
                'success': True,
                'total_planets': 0,
                'total_predictions': 0,
                'average_habitability': 0,
                'habitability_distribution': {
                    'highly_habitable': 0,
                    'moderately_habitable': 0,
                    'low_habitability': 0
                }
            })
        
        total_predictions = len(predictions)
        avg_habitability = sum(p.habitability_score for p in predictions) / total_predictions
        
        # Count by classification
        highly_habitable = sum(1 for p in predictions if p.classification == 'Highly Habitable')
        moderately_habitable = sum(1 for p in predictions if p.classification == 'Moderately Habitable')
        low_habitability = sum(1 for p in predictions if p.classification == 'Low Habitability')
        
        return jsonify({
            'success': True,
            'total_planets': total_planets,
            'total_predictions': total_predictions,
            'average_habitability': round(avg_habitability, 2),
            'habitability_distribution': {
                'highly_habitable': highly_habitable,
                'moderately_habitable': moderately_habitable,
                'low_habitability': low_habitability
            }
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/search', methods=['GET'])
def search():
    """Search planets by name"""
    try:
        query = request.args.get('q', '', type=str)
        
        if not query or len(query) < 2:
            return jsonify({'error': 'Query must be at least 2 characters'}), 400
        
        planets = Planet.query.filter(
            Planet.name.ilike(f'%{query}%')
        ).all()
        
        return jsonify({
            'success': True,
            'query': query,
            'results': [planet.to_dict() for planet in planets],
            'count': len(planets)
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/filter', methods=['GET'])
def filter_planets():
    """Filter planets by habitability"""
    try:
        classification = request.args.get('classification', '', type=str)
        min_score = request.args.get('min_score', 0, type=int)
        max_score = request.args.get('max_score', 100, type=int)
        
        predictions = Prediction.query.filter(
            Prediction.habitability_score.between(min_score, max_score)
        )
        
        if classification:
            predictions = predictions.filter_by(classification=classification)
        
        predictions = predictions.order_by(Prediction.habitability_score.desc()).all()
        
        results = []
        for pred in predictions:
            planet = Planet.query.get(pred.planet_id)
            if planet:
                results.append({
                    'planet': planet.to_dict(),
                    'prediction': pred.to_dict()
                })
        
        return jsonify({
            'success': True,
            'filters': {
                'classification': classification,
                'min_score': min_score,
                'max_score': max_score
            },
            'results': results,
            'count': len(results)
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


def init_db():
    """Initialize the database"""
    with app.app_context():
        db.create_all()
        print("[DB] Database tables created")


if __name__ == '__main__':
    with app.app_context():
        init_db()
    
    # Initialize ML model
    predictor.initialize()
    
    print("[APP] Starting ExoHabitAI Flask API on http://0.0.0.0:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
