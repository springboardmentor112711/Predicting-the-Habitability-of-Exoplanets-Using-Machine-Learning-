from flask import Flask, render_template,request,redirect,url_for,jsonify,send_file
from flask_cors import CORS #to handle cross origin requests like frontend to backend and vice versa
from sqlalchemy import create_engine, text
import xgboost as xgb
import joblib
import pandas as pd
from urllib.parse import quote_plus

from dotenv import load_dotenv # You might be missing this line!
import os 
import json
from threading import Lock

load_dotenv()

app=Flask(__name__)  #Flask app instance creation

CORS(app) #Cross-Origin Resource Sharing to allow requests from different origins like frontend to backend
# Encode password to handle special characters like @
DB_URL = f"postgresql://{os.getenv('DB_USER')}:{quote_plus(os.getenv('DB_PASSWORD'))}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(DB_URL, pool_pre_ping=True, pool_recycle=3600)

# --- Model Loading with joblib and xgboost.Booster ---
preprocessor = joblib.load("preprocessor.pkl")
model = xgb.Booster()
model.load_model("habitability_trained.json")
cluster_model=joblib.load("cluster_model.pkl")
cluster_scaler=joblib.load("cluster_scaler.pkl")
cluster_defaults=joblib.load("cluster_defaults.pkl")

# --- Thread-safe lock for duplicate prevention during concurrent requests ---
db_write_lock = Lock()

# --- Create unique constraint for duplicate prevention at database level ---
try:
    with engine.begin() as conn:
        # First, clean up existing duplicates by keeping only the first occurrence
        conn.execute(text("""
            DELETE FROM exoplanets 
            WHERE id NOT IN (
                SELECT MIN(id) FROM exoplanets 
                GROUP BY 
                    ROUND(CAST(radius AS numeric), 2),
                    ROUND(CAST(mass AS numeric), 2),
                    ROUND(CAST(temp AS numeric), 1)
            )
        """))
        
        # Now create the unique constraint
        conn.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS idx_planet_unique_characteristics
            ON exoplanets (
                ROUND(CAST(radius AS numeric), 2),
                ROUND(CAST(mass AS numeric), 2),
                ROUND(CAST(temp AS numeric), 1)
            );
        """))
    print("✅ Database cleaned and unique constraint for duplicate prevention is active")
except Exception as e:
    print(f"⚠️ Could not setup unique constraint: {e}")

@app.route('/',methods=["GET"]) #this is endpoint for rendering home page
def home():
    return render_template("home.html")

@app.route('/predict', methods=["GET"])#predict page rendering endpoint
def predict_page():
    return render_template("predict.html")

@app.route('/rank', methods=["GET"])# rank page rendering endpoint
def rank_page():
    return render_template("rank.html")

@app.route('/insights', methods=["GET"])# insights page rendering endpoint
def insights_page():
    return render_template("insights.html")
    
@app.route("/db_test",methods=["GET"])#database connection test endpoint
def db_test():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1;")).fetchone()
            return jsonify({
                "status":"success",
                "message":"Database connection successful",
                "result":result[0] if result else None
            })
    except Exception as e:
        return jsonify({
            "status":"error",
            "message":"Database connection failed",
            "error":str(e)
        }),500
        
@app.route('/predict', methods=["POST"])#predict endpoint for handling prediction requests
def predict():
    data = request.get_json()
    autofill = data.get("autofill", False)
    input_df=None
    # =============================
    # MANUAL MODE (ALL INPUTS)
    # =============================
    if not autofill:
        required_fields = [
            'radius',
            'mass',
            'temp',
            'orbital_period',
            'distance_star',
            'star_temp',
            'eccentricity',
            'semi_major_axis',
            'star_type'
        ]

        # Check for missing or empty fields
        missing_fields = [
            field for field in required_fields
            if field not in data or data[field] is None or str(data[field]).strip() == ""
        ]

        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields
            }), 400

        # Build input DataFrame inside the if block
        input_df = pd.DataFrame([{
            field: data[field] for field in required_fields
        }])

    # =============================
    # AUTOFILL MODE (ONLY radius, mass, temp)
    # =============================
    else:
        compulsory_fields = ['radius', 'mass', 'temp']
        missing = [field for field in compulsory_fields if field not in data]

        if missing:
            return jsonify({
                "error": "Missing compulsory fields for autofill",
                "missing_fields": missing
            }), 400 

        try:
            radius = float(data['radius'])
            mass = float(data['mass'])
            temp = float(data['temp'])
        except (ValueError, TypeError):
            return jsonify({
                "error": "radius, mass and temp must be numeric values"
            }), 400

        # Step 1: Predict cluster
        cluster_input = cluster_scaler.transform([[radius, mass, temp]])
        cluster_id = int(cluster_model.predict(cluster_input)[0])

        # Step 2: Get defaults for that cluster
        defaults = cluster_defaults[cluster_id]

        # Step 3: Build full input DataFrame inside the else block
        input_df = pd.DataFrame([{
            'radius': radius,
            'mass': mass,
            'temp': temp,
            'orbital_period': defaults['orbital_period'],
            'distance_star': defaults['distance_star'],
            'star_temp': defaults['star_temp'],
            'eccentricity': defaults['eccentricity'],
            'semi_major_axis': defaults['semi_major_axis'],
            'star_type': defaults['star_type']
        }])

    # =============================
    # VALIDATE NUMERIC INPUTS
    # =============================
    numeric_fields = [
        'radius',
        'mass',
        'temp',
        'orbital_period',
        'distance_star',
        'star_temp',
        'eccentricity',
        'semi_major_axis'
    ]
    numeric_df = input_df[numeric_fields].apply(pd.to_numeric, errors='coerce')
    if numeric_df.isna().any().any():
        return jsonify({
            "error": "Invalid or missing numeric values",
            "missing_fields": [col for col in numeric_fields if numeric_df[col].isna().any()]
        }), 400

    # =============================
    # PREPROCESS DATA WITH SCALER
    # =============================
    scaled_input = preprocessor.transform(input_df)
    
    # =============================
    # CREATE DMATRIX WITH FEATURE NAMES
    # =============================
    feature_names = list(preprocessor.get_feature_names_out())
    dmatrix = xgb.DMatrix(scaled_input, feature_names=feature_names)
    
    # =============================
    # FINAL ML PREDICTION
    # =============================
    probability = float(model.predict(dmatrix)[0])
    prediction = 1 if probability >= 0.5 else 0
    
    # CHECK FOR DUPLICATES AND SAVE TO DATABASE
    duplicate_found = False
    planet_id = None
    try:
        # Use thread-safe lock to prevent race conditions on concurrent requests
        with db_write_lock:
            with engine.begin() as conn:
                # Check if planet with same core characteristics already exists
                # Using ROUND for more reliable floating-point comparison
                existing = conn.execute(text("""
                    SELECT id FROM exoplanets 
                    WHERE ROUND(CAST(radius AS numeric), 2) = ROUND(CAST(:radius AS numeric), 2)
                    AND ROUND(CAST(mass AS numeric), 2) = ROUND(CAST(:mass AS numeric), 2)
                    AND ROUND(CAST(temp AS numeric), 1) = ROUND(CAST(:temp AS numeric), 1)
                    LIMIT 1
                """), {
                    "radius": float(input_df["radius"][0]),
                    "mass": float(input_df["mass"][0]),
                    "temp": float(input_df["temp"][0])
                }).fetchone()
                
                # Only insert if no duplicate found
                if not existing:
                    insert_result = conn.execute(text("""
                    INSERT INTO exoplanets
                    (radius, mass, temp, orbital_period, distance_star, star_temp,
                     eccentricity, semi_major_axis, star_type, habitability_probability)
                    VALUES (:radius, :mass, :temp, :orbital_period, :distance_star, :star_temp,
                            :eccentricity, :semi_major_axis, :star_type, :probability)
                    RETURNING id
                    """), {
                        "radius": float(input_df["radius"][0]),
                        "mass": float(input_df["mass"][0]),
                        "temp": float(input_df["temp"][0]),
                        "orbital_period": float(input_df["orbital_period"][0]),
                        "distance_star": float(input_df["distance_star"][0]),
                        "star_temp": float(input_df["star_temp"][0]),
                        "eccentricity": float(input_df["eccentricity"][0]),
                        "semi_major_axis": float(input_df["semi_major_axis"][0]),
                        "star_type": input_df["star_type"][0],
                        "probability": probability
                    })
                    inserted_row = insert_result.fetchone()
                    planet_id = inserted_row[0] if inserted_row else None
                    print("✅ New planet added to database (ID: {})".format(planet_id))
                else:
                    duplicate_found = True
                    planet_id = existing[0]
                    print("⚠️ Duplicate planet detected (ID: {}) - skipping insert".format(planet_id))
    except Exception as e:
        print(f"❌ Database operation failed: {e}")
        return jsonify({
            "error": "Database operation failed",
            "details": str(e)
        }), 500
    
    
    return jsonify({
        "mode": "autofill" if autofill else "manual",
        "habitable": prediction,
        "habitability_score": round(probability, 4),
        "duplicate": duplicate_found,
        "planet_id": planet_id
    })

    
@app.route('/rank-data',methods=["GET"])#rank endpoint for ranking exoplanets based on habitability probability
def rank():
    try:
        # Use SQLAlchemy connection context manager for proper pooling
        with engine.connect() as conn:
            df = pd.read_sql(text("""
                SELECT id, radius, mass, temp, habitability_probability 
                FROM exoplanets 
                ORDER BY habitability_probability DESC
            """), conn)
            
            df = df.fillna(0)
            df["rank"] = range(1, len(df) + 1)
            
            return jsonify({
                "planets": df.to_dict(orient="records")
            })
    except Exception as e:
        print(f"❌ Query failed: {e}")
        return jsonify({"error": "Failed to fetch ranking data"}), 500

@app.route('/planet/<int:planet_id>', methods=["GET"])
def planet_detail(planet_id):
    with engine.connect() as conn:
        df = pd.read_sql(
            text("""
            SELECT id, radius, mass, temp, orbital_period, distance_star, star_temp,
                   eccentricity, semi_major_axis, star_type, habitability_probability
            FROM exoplanets
            WHERE id = :planet_id
            LIMIT 1
            """),
            conn,
            params={"planet_id": planet_id}
        )

    if df.empty:
        return jsonify({"error": "Planet not found"}), 404

    return jsonify({"planet": df.iloc[0].to_dict()})
#df.iloc[0].to_dict() converts the first row of dataframe to dictionary
    
    
@app.route('/predict_input',methods=["POST"])#endpoint to validate user input for prediction
def predict_input():
    data=request.get_json()  #getting data from form submitted by user
    required_fields=[
        'radius',
        'mass',
        'temp',
        'orbital_period',
        'distance_star',
        'star_temp',
        'eccentricity',
        'semi_major_axis',
        'star_type'
    ]
    
    missing=[field for field in required_fields if field not in data]
    if missing:
        return jsonify({
            "error":"Missing fields",
            "missing_fields":missing
        }),400
    return jsonify({
        "message":"Input submitted successfully",
        "input_data":data
    }),200
    
@app.route("/planets", methods=["GET"])#endpoint to fetch exoplanet data from database
def get_planets():
    try:
        with engine.connect() as conn:
            df = pd.read_sql(text("SELECT * FROM exoplanets LIMIT 10;"), conn)
            return jsonify({
                "planets": df.to_dict(orient="records")
            })
    except Exception as e:
        print(f"❌ Query failed: {e}")
        return jsonify({"error": "Failed to fetch planets"}), 500
    
@app.route("/feature-importance", methods=["GET"])
def feature_importance():
    try:
        # Use gain for more meaningful importance values
        importance_dict = model.get_score(importance_type='gain')
        
        # Get feature names from preprocessor
        feature_names = preprocessor.get_feature_names_out().tolist()
        
        # Aggregate importances back to original feature names
        base_importance = {
            "radius": 0.0,
            "mass": 0.0,
            "temp": 0.0,
            "orbital_period": 0.0,
            "distance_star": 0.0,
            "star_temp": 0.0,
            "eccentricity": 0.0,
            "semi_major_axis": 0.0,
            "star_type": 0.0
        }

        for idx, feature_name in enumerate(feature_names):
            # XGBoost Booster uses f0, f1, f2... internally
            xgb_feature_key = f"f{idx}"
            importance = float(importance_dict.get(xgb_feature_key, 0))

            # Normalize ColumnTransformer prefixes, if any
            base_name = feature_name.split("__", 1)[-1]
            if base_name.startswith("star_type_"):
                base_name = "star_type"

            if base_name in base_importance:
                base_importance[base_name] += importance

        # Normalize to percentages for a cleaner chart
        total = sum(base_importance.values())
        result = []
        for key in base_importance:
            value = (base_importance[key] / total) if total > 0 else 0
            result.append({
                "feature": key,
                "importance": round(value, 4)
            })

        return jsonify({
            "feature_importance": sorted(result, key=lambda x: x["importance"], reverse=True)
        })

    except Exception as e:
        print(f"❌ Feature importance error: {e}")
        return jsonify({"error": str(e)}), 500




#@app.route("/feature-importance-plot",methods=["GET"])#feature importance plot endpoint
#def feature_importnace_plot():
 #   import matplotlib.pyplot as plt
    
  # importances=model.feature_importances_#getting feature importances from model
   # feature_names=model.feature_names_in_ #getting feature names from model
    
    #plt.figure(figsize=(8,5))
    #plt.barh(feature_names,importances) #barh for horizontal bar plot
    #plt.xlabel("Importance")
    #plt.ylabel("Feature Importance for Habitability Prediction")
    #plt.tight_layout()#tight_layout means adjust plot to fit in figure area
    
    #file_path="static/feature_importance.png"
    #plt.savefig(file_path)
    #plt.close()
    
    #r#eturn jsonify({"image":file_path})

   #the logic behind this entire endpoint is to generate a bar plot of feature importances using matplotlib
   #and save it to a file called feature_importance.png in the static folder
   

@app.route("/score-distribution",methods=["GET"])#score distribution endpoint
def score_distribution():
    try:
        with engine.connect() as conn:
            df=pd.read_sql(text("SELECT habitability_probability FROM exoplanets;"),conn)#fetching habitability probabilities from exoplanets table
            
            return jsonify({
                "scores":df['habitability_probability'].dropna().tolist() #converting series to list to send as json response
            })
    except Exception as e:
        print(f"❌ Query failed: {e}")
        return jsonify({"error": "Failed to fetch score distribution"}), 500

@app.route("/correlations", methods=["GET"])#correlations endpoint
#WHY correlations? to analyze relationships between features and habitability scores
def correlations():
    try:
        with engine.connect() as conn:
            df = pd.read_sql(text("""
                SELECT radius,mass,temp,orbital_period,distance_star,
                       star_temp,eccentricity,semi_major_axis,habitability_probability 
                FROM exoplanets
            """), conn)

            corr = df.corr().round(3).fillna(0)

            return jsonify({
                "labels": corr.columns.tolist(),
                "matrix": corr.values.tolist()
            })
    except Exception as e:
        print(f"❌ Query failed: {e}")
        return jsonify({"error": "Failed to fetch correlations"}), 500


@app.route("/export") #data export endpoint
def export(): 
    from openpyxl import Workbook #importing openpyxl to create excel files
    
    try:
        with engine.connect() as conn:
            df=pd.read_sql(text("SELECT * FROM exoplanets ORDER BY habitability_probability DESC LIMIT 10;"),conn) 
            #fetching top 10 exoplanets based on habitability probability
            
            wb=Workbook() #creating workbook object to hold excel data
            ws=wb.active #getting active worksheet from workbook
            ws.title="Top 10 Habitable Exoplanets" #setting worksheet title
            
            ws.append(df.columns.tolist()) #adding header row with column names
            for row in df.itertuples(index=False): #iterating over dataframe rows without index
                #itertuples returns namedtuples for each row
                #example: Row(id=1,radius=1.5,mass=2.0,...)
                ws.append(list(row)) #adding each row to worksheet
                
            file_path = "static/top_10_habitable_exoplanets.xlsx" #file path to save excel file
            wb.save(file_path) #saving workbook to file
            
            return send_file(file_path,as_attachment=True) #sending file as attachment for download
    except Exception as e:
        print(f"❌ Export failed: {e}")
        return jsonify({"error": "Failed to export data"}), 500


@app.route("/export-pdf", methods=["GET"])#pdf export endpoint
def export_pdf():
    from reportlab.platypus import SimpleDocTemplate,Table 
    #what is reportlab.platypus? it is a library to create pdf documents in python
    #other alternatives are fpdf,PyPDF2,etc
    #why SimpleDocTemplate and Table? SimpleDocTemplate is used to create simple pdf documents
    #Table is used to create tables in pdf documents
    from reportlab.lib.pagesizes import A4
    #A4 is a standard page size for documents
    
    try:
        with engine.connect() as conn:
            df=pd.read_sql(text("SELECT * FROM exoplanets ORDER BY habitability_probability DESC LIMIT 10;"),conn)
            
            doc=SimpleDocTemplate("static/top_10_habitable_exoplanets.pdf",pagesize=A4)
            table=Table([df.columns.tolist()]+ df.values.tolist())
            #what does the above line mean?
            #it creates a table with header row as column names and data rows as exoplanet data
            # df.columns.tolist() + df.values.tolist() creates a list of lists where first inner list is header row and rest are data rows
            #example: [["col1","col2",...],["data1_row1","data2_row1",...],...]
            
            doc.build([table]) #building pdf document with the table
            
            return send_file("static/top_10_habitable_exoplanets.pdf",as_attachment=True) #sending pdf file as attachment for download
    except Exception as e:
        print(f"❌ PDF Export failed: {e}")
        return jsonify({"error": "Failed to export PDF"}), 500


@app.route("/exoplanet-facts")
def exoplanet_facts():
    with open("static/data/exoplanet_facts.json", "r", encoding="utf-8") as f:
        return jsonify(json.load(f))


if __name__=="__main__":#main method to run the flask app
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
