from flask import Flask, render_template,request,redirect,url_for,jsonify
from flask_cors import CORS
import os
import pandas as pd
import joblib
import psycopg2 #importing psycopg2 to connect to postgresql database in supabase
app=Flask(__name__)  #Flask app instance creation
CORS(app) #enabling CORS for flask app,,what is CORS?
model=joblib.load("habitability_trained.pkl") #loading the trained model:)
cluster_model=joblib.load("cluster_model.pkl")
cluster_scaler=joblib.load("cluster_scaler.pkl")
cluster_defaults=joblib.load("cluster_defaults.pkl")

def get_db_connection():
    conn=psycopg2.connect( #connecting to postgresql database in supabase
        host=os.getenv("SUPABASE_DB_HOST"),
        user=os.getenv("SUPABASE_DB_USER"),
        password=os.getenv("SUPABASE_DB_PASSWORD"),
        port=os.getenv("SUPABASE_DB_PORT"),
        database=os.getenv("SUPABASE_DB_DATABASE")
    )
    return conn

@app.route('/',methods=["GET"])
def home():
    return render_template("home.html")

@app.route('/predict', methods=["GET"])
def predict_page():
    return render_template("predict.html")

@app.route('/rank', methods=["GET"])
def rank_page():
    return render_template("rank.html")

@app.route('/insights', methods=["GET"])
def insights_page():
    return render_template("insights.html")
    
@app.route("/db_test",methods=["GET"])
def db_test():
    try:
        conn=get_db_connection()
        cursor=conn.cursor()
        cursor.execute("SELECT 1;")
        result=cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({
            "status":"success",
            "message":"Database connection successful",
            "result":result
        })
    except Exception as e:
        return jsonify({
            "status":"error",
            "message":"Database connection failed",
            "error":str(e)
        }),500
        
@app.route('/predict', methods=["POST"])
def predict():
    data = request.get_json()
    autofill = data.get("autofill", False)

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

        # Check for missing fields
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields
            }), 400

        # Build input DataFrame
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

        # Step 3: Build full input
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
    # FINAL ML PREDICTION
    # =============================
    prediction = int(model.predict(input_df)[0])
    probability = float(model.predict_proba(input_df)[0][1])

    return jsonify({
        "mode": "autofill" if autofill else "manual",
        "habitable": prediction,
        "habitability_score": round(probability, 4)
    })

    
@app.route('/rank',methods=["POST"])
def rank():
    data=request.get_json()
    df=pd.DataFrame(data)
    df['habitability_probability']=model.predict_proba(df)[:,1].tolist() #[:,1] to get probability of class 1 for all rows
    #creating probability column in dataframe for each exoplanet
    df["rank"]=df['habitability_probability'].rank(ascending=False)#creating rank column based on probability and assigning rank in descending order
    df=df.sort_values(by='rank')# sorting dataframe based on rank
    return jsonify({
        "ranked_exoplanets":df.to_dict(orient="records") #df.to.dict means converting dataframe to dictionary
        #why dictionary because it has many rows and each record is a planet's data
        #so we send it as list of dictionaries(records) in json format. Example:[{"planet1_data"},{...}],say planet1_data has keys like mass,radius,etc
    })
    
@app.route('/predict_input',methods=["POST"])
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
    
@app.route("/planets", methods=["GET"])
def get_planets():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM exoplanets LIMIT 10;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify({
        "planets": rows
    })
    
    
#@app.route("/feature-importance")
#def feature_importance():
#    return jsonify({
#        "message":"Feature importance endpoint coming soon"
#    })


#@app.route("/score-distribution")
#def score_distribution():
#    return jsonify({
#        "message":"Score distribution endpoint coming soon"
#    })

#@app.route("/correlations")
#def correlations():
#    return jsonify({
#        "message":"Correlations endpoint coming soon"
#    })

#@app.route("/export")
#def export_data():
#    return jsonify({
#        "message":"Data export endpoint coming soon"
#    })

if __name__=="__main__":
    app.run(debug=True)