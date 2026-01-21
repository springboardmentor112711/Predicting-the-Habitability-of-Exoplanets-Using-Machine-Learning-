from flask import Flask, render_template, request, jsonify
import numpy as np
import shap
import joblib
import sqlite3
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import pandas as pd
from sklearn.preprocessing import StandardScaler  # added scaler support
from database import init_db
init_db()

app = Flask(__name__)

# ---------------- LOAD MODEL AND SCALER ---------------- #
model = joblib.load("habitability_model.pkl")

# Load scaler if used during training
try:
    scaler = joblib.load("scaler.pkl")
except:
    scaler = None  # assume no scaling if not found

# ---------------- SHAP SETUP ---------------- #
# background must match the number of features (7)
background = np.zeros((1, 7))
explainer = shap.KernelExplainer(model.predict_proba, background)

# ---------------- DATABASE FUNCTIONS ---------------- #
def save_to_db(data, probability):
    conn = sqlite3.connect("habitability.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO predictions 
    (pl_orbper, pl_rade, st_teff, st_rad, st_mass, st_met, sy_dist, probability)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (*data[0], probability))

    conn.commit()
    conn.close()


def update_ranks():
    conn = sqlite3.connect("habitability.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id FROM predictions
    ORDER BY probability DESC
    """)
    rows = cursor.fetchall()

    rank = 1
    for row in rows:
        cursor.execute(
            "UPDATE predictions SET rank=? WHERE id=?",
            (rank, row[0])
        )
        rank += 1

    conn.commit()
    conn.close()

# ---------------- HELPER FUNCTION ---------------- #
def preprocess_input(X):
    """Scale inputs if scaler exists."""
    if scaler:
        return scaler.transform(X)
    return X

# ---------------- WEB INTERFACE ---------------- #
@app.route("/", methods=["GET", "POST"])
def predict():
    explanation_html = None
    probability = None
    label = None

    if request.method == "POST":
        X = np.array([[ 
            float(request.form["pl_orbper"]),
            float(request.form["pl_rade"]),
            float(request.form["st_teff"]),
            float(request.form["st_rad"]),
            float(request.form["st_mass"]),
            float(request.form["st_met"]),
            float(request.form["sy_dist"])
        ]])

        # Preprocess input
        X_scaled = preprocess_input(X)

        # Predict probability
        probability = round(model.predict_proba(X_scaled)[0][1] * 100, 2)
        label = "Habitable 🌍" if probability > 50 else "Non-Habitable ❌"

        # Save prediction
        save_to_db(X, probability)

        # Update ranking
        update_ranks()

        # ---------------- SHAP Explanation ---------------- #
        try:
            shap_values = explainer.shap_values(X_scaled)
            shap.initjs()
            feature_shap_values = shap_values[0][1]  # first sample, all 7 features
            expected_value = explainer.expected_value[0]

            force_plot = shap.force_plot(
                expected_value,
                feature_shap_values,
                X[0],
                feature_names=[
                    "Orbital Period", "Planet Radius", "Star Temp",
                    "Star Radius", "Star Mass", "Metallicity", "Distance"
                ]
            )
            explanation_html = force_plot.html()

        except Exception as e:
            explanation_html = f"<p>SHAP explanation unavailable: {e}</p>"

    return render_template(
        "index.html",
        probability=probability,
        label=label,
        explanation_html=explanation_html
    )

# ---------------- REST API ---------------- #
@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.json["features"]
    X = np.array([data])
    X_scaled = preprocess_input(X)

    probability = round(model.predict_proba(X_scaled)[0][1] * 100, 2)
    label = "Habitable 🌍" if probability > 50 else "Non-Habitable ❌"

    save_to_db(X, probability)
    update_ranks()

    return jsonify({
        "probability": probability,
        "label": label
    })

# ---------------- RANKING API ---------------- #
@app.route("/api/rank", methods=["GET"])
def rank_planets():
    conn = sqlite3.connect("habitability.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM predictions
    ORDER BY rank ASC
    """)
    rows = cursor.fetchall()
    conn.close()

    return jsonify(rows)

# ---------------- RANK PAGE ---------------- #
@app.route("/rank")
def rank_page():
    conn = sqlite3.connect("habitability.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        pl_orbper,
        pl_rade,
        st_teff,
        st_rad,
        st_mass,
        st_met,
        sy_dist,
        probability,
        rank
    FROM predictions
    ORDER BY rank ASC
    """)
    rows = cursor.fetchall()
    conn.close()

    return render_template("rank.html", rows=rows)

# ---------------- DASHBOARD ---------------- #
@app.route("/dashboard")
def dashboard():
    conn = sqlite3.connect("habitability.db")
    df = pd.read_sql_query("SELECT * FROM predictions", conn)
    conn.close()

    try:
        shap_values = explainer.shap_values(df.iloc[:, :7].values)
        feature_importance = np.mean(np.abs(shap_values[0][1]), axis=0)
        features = [
            "Orbital Period", "Planet Radius", "Star Temp",
            "Star Radius", "Star Mass", "Metallicity", "Distance"
        ]

        plt.figure(figsize=(8,5))
        sns.barplot(x=features, y=feature_importance)
        plt.title("Feature Importance (SHAP)")
        plt.xticks(rotation=45)
        plt.tight_layout()

        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plot_url = base64.b64encode(img.getvalue()).decode()

    except Exception as e:
        plot_url = None

    return render_template("dashboard.html", plot_url=plot_url)

# ---------------- INSIGHTS / DASHBOARD ---------------- #
@app.route("/insights")
def insights():
    conn = sqlite3.connect("habitability.db")
    df = np.array(
        conn.execute("""
        SELECT 
            pl_orbper, pl_rade, st_teff, st_rad,
            st_mass, st_met, sy_dist, probability
        FROM predictions
        """).fetchall()
    )
    conn.close()

    if len(df) == 0:
        return render_template("insights.html", plots={})

    plots = {}
    feature_names = [
        "Orbital Period", "Planet Radius", "Star Temp",
        "Star Radius", "Star Mass", "Metallicity", "Distance"
    ]

    try:
        shap_values = explainer.shap_values(df[:, :7])
        importance = np.mean(np.abs(shap_values[0][1]), axis=0)

        plt.figure(figsize=(7,4))
        sns.barplot(x=importance, y=feature_names)
        plt.title("Feature Importance (SHAP)")
        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        plt.close()
        plots["importance"] = base64.b64encode(buf.getvalue()).decode()

    except Exception:
        plots["importance"] = None

    # Habitability Score Distribution
    plt.figure(figsize=(6,4))
    sns.histplot(df[:, 7], bins=10, kde=True)
    plt.title("Habitability Score Distribution")
    plt.xlabel("Probability (%)")
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    plots["distribution"] = base64.b64encode(buf.getvalue()).decode()

    # Correlation Heatmap
    plt.figure(figsize=(7,5))
    sns.heatmap(
        np.corrcoef(df.T),
        xticklabels=feature_names + ["Probability"],
        yticklabels=feature_names + ["Probability"],
        cmap="coolwarm",
        annot=False
    )
    plt.title("Feature Correlation Heatmap")
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    plots["correlation"] = base64.b64encode(buf.getvalue()).decode()

    return render_template("insights.html", plots=plots)

# ---------------- RUN APP ---------------- #
if __name__ == "__main__":
    app.run(debug=True)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
