from flask import Flask, render_template,request,redirect,url_for,jsonify
from flask_cors import CORS #to handle cross origin requests like frontend to backend and vice versa
from flask import send_file #to send files as response for download
import os 
import json
import pandas as pd
import joblib #to load trained machine learning model
import psycopg2 #importing psycopg2 to connect to postgresql database in supabase

app=Flask(__name__)  #Flask app instance creation

CORS(app) #Cross-Origin Resource Sharing to allow requests from different origins like frontend to backend
model=joblib.load("habitability_trained.pkl") #loading the trained model:)
cluster_model=joblib.load("cluster_model.pkl")
cluster_scaler=joblib.load("cluster_scaler.pkl")
cluster_defaults=joblib.load("cluster_defaults.pkl")


def get_db_connection():
    conn=psycopg2.connect( #connecting to posgresql database in supabase
        host=os.getenv("SUPABASE_DB_HOST"),
        user=os.getenv("SUPABASE_DB_USER"),
        password=os.getenv("SUPABASE_DB_PASSWORD"),
        port=os.getenv("SUPABASE_DB_PORT"),
        database=os.getenv("SUPABASE_DB_DATABASE")
    )
    return conn

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
        conn=get_db_connection()#getting database connection
        cursor=conn.cursor()#creating cursor object to execute sql queries
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
        
@app.route('/predict', methods=["POST"])#predict endpoint for handling prediction requests
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
    
    # >>> ADD THIS BLOCK HERE <<<
# SAVE PREDICTION TO SUPABASE 
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
        INSERT INTO exoplanets
        (radius, mass, temp, orbital_period, distance_star, star_temp,
         eccentricity, semi_major_axis, star_type, habitability_probability)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            float(input_df["radius"][0]),
            float(input_df["mass"][0]),
            float(input_df["temp"][0]),
            float(input_df["orbital_period"][0]),
            float(input_df["distance_star"][0]),
            float(input_df["star_temp"][0]),
            float(input_df["eccentricity"][0]),
            float(input_df["semi_major_axis"][0]),
            input_df["star_type"][0],
            probability
        ))
        conn.commit()
    except Exception as e:
        print("❌ Database insert failed:", e)
        
    finally:
        try:
            cur.close()
            conn.close()
        except:
            pass
    
    
    return jsonify({
        "mode": "autofill" if autofill else "manual",
        "habitable": prediction,
        "habitability_score": round(probability, 4)
    })

    
@app.route('/rank-data',methods=["GET"])#rank endpoint for ranking exoplanets based on habitability probability
def rank():
    conn=get_db_connection() #getting database connection
    df=pd.read_sql("""
        SELECT id, radius, mass, temp, habitability_probability
        FROM exoplanets
        ORDER BY habitability_probability DESC
    """, conn)
    conn.close()
    df=df.fillna(0)
    df["rank"]=range(1,len(df)+1)
    return jsonify({
        "planets": df.to_dict(orient="records") #converting dataframe to list of dictionaries
        #example: [{"id":1,"radius":1.5,...},{"id":2,"radius":2.0,...},...]
    })


@app.route('/planet/<int:planet_id>', methods=["GET"])
def planet_detail(planet_id):
    conn = get_db_connection()
    df = pd.read_sql(
        """
        SELECT id, radius, mass, temp, orbital_period, distance_star, star_temp,
               eccentricity, semi_major_axis, star_type, habitability_probability
        FROM exoplanets
        WHERE id = %s
        LIMIT 1
        """,
        conn,
        params=(planet_id,)
    )
    conn.close()

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
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM exoplanets LIMIT 10;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify({
        "planets": rows
    })
    
@app.route("/feature-importance", methods=["GET"])
def feature_importance():
    try:
        xgb_model = model.steps[-1][1]   # extract real model
        #[-1][1] means last step of pipeline and second element (the model itself)..not the pipeline object

        importances = xgb_model.feature_importances_ #example: [0.1,0.2,0.3,...] importance scores for each feature
        feature_names = model.feature_names_in_ #example: ['radius','mass','temp',...] feature names used in training

        result = []
        for f, i in zip(feature_names, importances): #zipping feature names and importances together
            result.append({
                "feature": f,
                "importance": round(float(i), 4)
            })

        return jsonify({
            "feature_importance": sorted(result, key=lambda x: x["importance"], reverse=True) #sorting by importance descending
        })

    except Exception as e:
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
    conn =get_db_connection() #why connect to database? to fetch habitability scores of exoplanets
    df=pd.read_sql("SELECT habitability_probability FROM exoplanets;",conn)#fetching habitability probabilities from exoplanets table
    conn.close()
    
    return jsonify({
        "scores":df['habitability_probability'].dropna().tolist() #converting series to list to send as json response
    })

@app.route("/correlations", methods=["GET"])#correlations endpoint
#WHY correlations? to analyze relationships between features and habitability scores
def correlations():
    conn = get_db_connection()
    df = pd.read_sql("""
        SELECT radius,mass,temp,orbital_period,distance_star,
               star_temp,eccentricity,semi_major_axis,habitability_probability 
        FROM exoplanets
    """, conn)
    conn.close()

    corr = df.corr().round(3).fillna(0)

    return jsonify({
        "labels": corr.columns.tolist(),
        "matrix": corr.values.tolist()
    })


@app.route("/export") #data export endpoint
def export(): 
    from openpyxl import Workbook #importing openpyxl to create excel files
    
    conn=get_db_connection() #connecting to database to fetch exoplanet data
    df=pd.read_sql("SELECT * FROM exoplanets ORDER BY habitability_probability DESC LIMIT 10;",conn) 
    #fetching top 10 exoplanets based on habitability probability
    conn.close()
    
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


@app.route("/export-pdf", methods=["GET"])#pdf export endpoint
def export_pdf():
    from reportlab.platypus import SimpleDocTemplate,Table 
    #what is reportlab.platypus? it is a library to create pdf documents in python
    #other alternatives are fpdf,PyPDF2,etc
    #why SimpleDocTemplate and Table? SimpleDocTemplate is used to create simple pdf documents
    #Table is used to create tables in pdf documents
    from reportlab.lib.pagesizes import A4
    #A4 is a standard page size for documents
    
    conn=get_db_connection() #connecting to database to fetch exoplanet data
    df=pd.read_sql("SELECT * FROM exoplanets ORDER BY habitability_probability DESC LIMIT 10;",conn)
    conn.close()
    
    doc=SimpleDocTemplate("static/top_10_habitable_exoplanets.pdf",pagesize=A4)
    table=Table([df.columns.tolist()]+ df.values.tolist())
    #what does the above line mean?
    #it creates a table with header row as column names and data rows as exoplanet data
    # df.columns.tolist() + df.values.tolist() creates a list of lists where first inner list is header row and rest are data rows
    #example: [["col1","col2",...],["data1_row1","data2_row1",...],...]
    
    doc.build([table]) #building pdf document with the table
    
    return send_file("static/top_10_habitable_exoplanets.pdf",as_attachment=True) #sending pdf file as attachment for download


@app.route("/exoplanet-facts")
def exoplanet_facts():
    with open("static/data/exoplanet_facts.json", "r", encoding="utf-8") as f:
        return jsonify(json.load(f))


if __name__=="__main__":#main method to run the flask app
    port=int(os.getenv("PORT",5000)) #getting port from environment variable or default to 5000
    app.run(host="0.0.0.0",port=port)
