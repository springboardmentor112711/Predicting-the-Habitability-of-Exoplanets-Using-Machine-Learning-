from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np

app = Flask(__name__)

# Load model & scaler
model = pickle.load(open("model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = [
        data["pl_orbper"],
        data["pl_rade"],
        data["st_teff"],
        data["st_mass"],
        data["sy_dist"]
    ]

    features = np.array(features).reshape(1, -1)
    features_scaled = scaler.transform(features)

    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0][1]

    result = "Habitable" if prediction == 1 else "Non-Habitable"

    return jsonify({
        "prediction": result,
        "probability": round(probability * 100, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
