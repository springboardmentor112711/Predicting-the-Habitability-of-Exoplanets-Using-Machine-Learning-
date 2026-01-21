from flask import Flask, request, jsonify, send_file, render_template
import joblib
import pandas as pd
import numpy as np
import io
from werkzeug.serving import run_simple


app = Flask(__name__)
# --------- HOME ROUTE (ADD HERE) ----------
@app.route("/")
def home():
    return render_template("index.html")

# ---------------- LOAD MODEL ----------------
model = joblib.load("habitable_model_xgboost.joblib")
print("MODEL LOADED")

EXPECTED_COLUMNS = list(model.feature_names_in_)
print("EXPECTED FEATURES:", EXPECTED_COLUMNS)

# ---------------- LOAD TRAINING DATA FOR CORRELATIONS ----------------
train_df = pd.read_csv("final_processed_data1.csv")  # Replace with your CSV
train_numeric = train_df[EXPECTED_COLUMNS]  # only model features

# ---------------- PREDICTION ROUTE ----------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # --- USER INPUT ---
        pl_bmasse = float(data["planet_mass_earth"])
        pl_orbper = float(data["orbital_period_days"])
        sy_dist   = float(data["orbit_distance_au"])
        st_teff   = float(data["star_temperature_k"])
        pl_rade   = float(data["star_radius_solar"])

        # --- BASE FEATURES ---
        base_features = {
            "pl_bmasse_Scaled": pl_bmasse,
            "pl_orbper_Scaled": pl_orbper,
            "sy_dist_Scaled": sy_dist,
            "st_teff_Scaled": st_teff,
            "pl_rade_Scaled": pl_rade
        }

        # --- ENGINEERED FEATURES ---
        engineered_features = {
    "Insulation_Factor_Scaled": st_teff / (sy_dist + 1e-6),
    "pl_bmassprov_Unknown": 0,
    "pl_radeerr1": pl_rade * 0.05,
    "pl_radeerr2": pl_rade * 0.02,
    "pl_radjerr1": pl_rade * 0.01,
    "pl_radjerr2": pl_rade * 0.03,
    "st_tefferr1": st_teff * 0.01,
    "st_tefferr2": st_teff * 0.02,
    "sy_disterr1": sy_dist * 0.05,
    "sy_disterr2": sy_dist * 0.02,
    # ----- ADD MISSING FEATURES -----
    "st_met_Scaled": 1.0,
    "st_meterr1": 0.0,
    "st_meterr2": 0.0,
    "soltype_Published Confirmed": 1,
    "soltype_TESS Project Candidate": 0
}


        # --- MERGE FEATURES ---
        full_input = {**base_features, **engineered_features}
        df = pd.DataFrame([full_input])
        df = df.reindex(columns=EXPECTED_COLUMNS, fill_value=0)

        # --- MODEL PREDICTION ---
        prob = model.predict_proba(df)[0][1]
        prediction = int(prob >= 0.45)

        # --- FEATURE IMPORTANCE (handle pipeline) ---
        try:
            if hasattr(model, 'named_steps'):
                last_step = list(model.named_steps.values())[-1]
                fi = last_step.feature_importances_
            else:
                fi = model.feature_importances_
        except:
            fi = [0]*len(EXPECTED_COLUMNS)

        main_features = ['pl_bmasse_Scaled','pl_orbper_Scaled','sy_dist_Scaled','st_teff_Scaled','pl_rade_Scaled']
        fi_values = [float(dict(zip(EXPECTED_COLUMNS, fi)).get(f,0)) for f in main_features]

        # --- HABITABILITY SCORE DISTRIBUTION ---
# repeat same input slightly perturbed (simulation)
# Safe fix: only add noise to numeric columns
        all_scores = []
        for _ in range(50):
          noisy_df = df.copy()
          numeric_cols = noisy_df.select_dtypes(include=np.number).columns
          noisy_df[numeric_cols] += np.random.normal(0, 0.01, noisy_df[numeric_cols].shape)
          s = model.predict_proba(noisy_df)[0][1]
          all_scores.append(float(s))


        # --- CORRELATION MATRIX ---
        correlations = train_numeric.corr().round(2).values.tolist()
        correlations = [[float(c) for c in row] for row in correlations]

        # --- RETURN JSON ---
        return jsonify({
            "habitability_score": float(round(prob,4)),
            "habitable": int(prediction),
            "feature_importance": fi_values,
            "all_scores": all_scores,
            "correlations": correlations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ---------------- EXPORT ANALYSIS TO EXCEL ----------------
@app.route("/export_csv", methods=["POST"])
def export_csv():
    try:
        data = request.get_json()
        fi = data["feature_importance"]
        scores = data["all_scores"]
        correlations = data["correlations"]

        df_fi = pd.DataFrame({
            "Feature": ['Planet Mass','Orbital Period','Orbit Distance','Star Temp','Star Radius'],
            "Importance": fi
        })
        df_scores = pd.DataFrame({"Habitability_Score": scores})
        df_corr = pd.DataFrame(correlations, columns=['Mass','Period','Distance','Temp','Radius'],
                               index=['Mass','Period','Distance','Temp','Radius'])

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df_fi.to_excel(writer, sheet_name="Feature Importance", index=False)
            df_scores.to_excel(writer, sheet_name="Score Distribution", index=False)
            df_corr.to_excel(writer, sheet_name="Correlation Matrix")
        output.seek(0)
        return send_file(output, download_name="planet_analysis.xlsx", as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ---------------- EXPORT ANALYSIS TO PDF ----------------
@app.route("/export_pdf", methods=["POST"])
def export_pdf():
    try:
        from matplotlib.backends.backend_pdf import PdfPages
        import matplotlib.pyplot as plt
        import seaborn as sns

        data = request.get_json()
        fi = data["feature_importance"]
        scores = data["all_scores"]
        correlations = data["correlations"]

        output = io.BytesIO()
        with PdfPages(output) as pdf:
            # Feature Importance
            plt.figure(figsize=(6,4))
            plt.bar(['Planet Mass','Orbital Period','Orbit Distance','Star Temp','Star Radius'],
                    fi, color=['#6366f1','#22d3ee','#4ade80','#fbbf24','#f472b6'])
            plt.title("Feature Importance")
            pdf.savefig()
            plt.close()

            # Score Distribution
            plt.figure(figsize=(6,4))
            plt.hist(scores, bins=15, color='#6366f1', edgecolor='black')
            plt.title("Habitability Score Distribution")
            pdf.savefig()
            plt.close()

            # Correlation Matrix
            plt.figure(figsize=(6,4))
            sns.heatmap(correlations, annot=True, xticklabels=['Mass','Period','Distance','Temp','Radius'],
                        yticklabels=['Mass','Period','Distance','Temp','Radius'], cmap="viridis")
            plt.title("Correlation Matrix")
            pdf.savefig()
            plt.close()

        output.seek(0)
        return send_file(output, download_name="planet_analysis.pdf", as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ---------------- SERVE RANKING CSV ----------------
@app.route("/exoplanet_habitability_ranking.csv")
def serve_ranking():
    try:
        # This sends the 100-row file to your browser
        return send_file("exoplanet_habitability_ranking.csv", mimetype='text/csv')
    except Exception as e:
        return jsonify({"error": str(e)}), 404

# ---------------- MAIN ----------------
if __name__ == "__main__":
    run_simple("127.0.0.1", 5000, app, use_reloader=False)
