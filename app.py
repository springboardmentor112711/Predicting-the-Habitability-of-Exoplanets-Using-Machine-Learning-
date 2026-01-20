from flask import Flask, request, jsonify, render_template, send_file
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load trained model
model = joblib.load("model/habitability_model.pkl")

# Load ranked planet data for Top-10
ranked_df = pd.read_csv("ranked_exoplanet_habitability.csv")

@app.route('/')
def home():
    return render_template('index.html')



@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/about")
def about():
    return render_template("about.html")

# ===============================
# Predict Single Planet
# ===============================
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True) or {}

    try:
        features = np.array([[ 
            float(data['planet_radius']),
            float(data['planet_mass']),
            float(data['orbital_period']),
            float(data['equilibrium_temp']),
            float(data['distance_from_star']),
            float(data['stellar_temp']),
            float(data['stellar_metallicity'])
        ]])
    except (KeyError, TypeError, ValueError):
        return jsonify({
            "error": "Invalid or missing input fields"
        }), 400

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    # Habitability score (scaled confidence)
    score = round(probability, 3)

    return jsonify({
        "habitability": "Habitable" if prediction == 1 else "Non-Habitable",
        "confidence": round(probability * 100, 2),
        "score": score,
        "input_data": {
            "planet_radius": float(data['planet_radius']),
            "planet_mass": float(data['planet_mass']),
            "orbital_period": float(data['orbital_period']),
            "equilibrium_temp": float(data['equilibrium_temp']),
            "distance_from_star": float(data['distance_from_star']),
            "stellar_temp": float(data['stellar_temp']),
            "stellar_metallicity": float(data['stellar_metallicity'])
        }
    })


# ===============================
# Top 10 Habitable Planets
# ===============================
@app.route('/top10_dynamic', methods=['POST'])
def top10_dynamic():
    df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")

    feature_cols = [
        "pl_rade", "pl_bmasse", "pl_orbper",
        "pl_eqt", "pl_orbsmax", "st_teff", "st_met"
    ]

    df = df.dropna(subset=feature_cols)

    X = df[feature_cols].values
    probs = model.predict_proba(X)[:, 1]

    df["habitability_score"] = probs

    top10 = df.sort_values(
        by="habitability_score",
        ascending=False
    ).head(10)

    result = []
    for _, row in top10.iterrows():
        result.append({
            "name": row["pl_name"],
            "score": round(row["habitability_score"], 3),
            "class": "Highly Habitable" if row["habitability_score"] >= 0.75 else "Moderately Habitable"
        })

    return jsonify(result)

# ADD Module-7
# -------------------------
# MODULE 7: EXPORT PDF
# -------------------------
# Feature Importance Plot (Function + API)
@app.route("/plot/feature_importance")
def feature_importance_plot():
    # Use a non-GUI backend for headless servers
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from pathlib import Path
    from sklearn.inspection import permutation_importance

    # --- COSMIC THEME SETUP ---
    plt.style.use('dark_background')
    plt.rcParams.update({
        "figure.facecolor": "#050608",
        "axes.facecolor": "#0b0d12",
        "axes.edgecolor": "#00f2ff",
        "axes.linewidth": 1.2,
        "text.color": "#ffffff",
        "axes.labelcolor": "#a0aab5",
        "xtick.color": "#a0aab5",
        "ytick.color": "#a0aab5",
        "font.family": "sans-serif",
    })
    # --------------------------

    features = [
        "Planet Radius", "Planet Mass", "Orbital Period",
        "Equilibrium Temp", "Distance from Star",
        "Stellar Temp", "Metallicity"
    ]

    # Resolve the actual estimator (pipeline vs bare model)
    estimator = model.named_steps.get("model", model) if hasattr(model, "named_steps") else model

    # Try to get feature importances from the estimator, otherwise fall back to permutation importance
    if hasattr(estimator, "feature_importances_"):
        importances = estimator.feature_importances_
    elif hasattr(estimator, "coef_"):
        # Models like LogisticRegression expose coefficients instead of importances
        importances = abs(estimator.coef_).ravel()
    else:
        # Fallback: compute permutation importance on a small sample to avoid blocking
        df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")
        feature_cols = [
            "pl_rade", "pl_bmasse", "pl_orbper",
            "pl_eqt", "pl_orbsmax", "st_teff", "st_met"
        ]
        df = df.dropna(subset=feature_cols)

        # Limit rows for speed; 500 rows is usually enough to estimate importance
        sample = df[feature_cols].head(500)
        target = (df.get("habitability_class") or pd.Series(np.zeros(len(sample))))[: len(sample)]
        model_for_importance = model if hasattr(model, "predict") else estimator
        result = permutation_importance(model_for_importance, sample, target, n_repeats=5, random_state=42)
        importances = result.importances_mean

    # Ensure the plots folder exists
    plots_dir = Path("static/plots")
    plots_dir.mkdir(parents=True, exist_ok=True)

    plt.figure(figsize=(10, 6))
    # Cyan bars with glow-like edge
    plt.barh(features, importances, color="#00f2ff", alpha=0.7, edgecolor="#00f2ff", linewidth=1.5)
    
    plt.xlabel("Importance", fontsize=12, fontweight='bold')
    plt.title("Feature Importance for Habitability Prediction", fontsize=16, pad=20, color="#00f2ff")
    plt.grid(color='#2a3b55', linestyle='--', linewidth=0.5, alpha=0.5)
    plt.tight_layout()

    path = plots_dir / "feature_importance.png"
    plt.savefig(path, dpi=300, facecolor="#050608")
    plt.close()

    return jsonify({"image": path.as_posix()})

# Habitability Score Distribution
@app.route("/plot/habitability_distribution")
def habitability_distribution():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    # --- COSMIC THEME SETUP ---
    plt.style.use('dark_background')
    plt.rcParams.update({
        "figure.facecolor": "#050608",
        "axes.facecolor": "#0b0d12",
        "axes.edgecolor": "#7000ff", # Secondary accent
        "axes.linewidth": 1.2,
        "text.color": "#ffffff",
        "axes.labelcolor": "#a0aab5",
        "xtick.color": "#a0aab5",
        "ytick.color": "#a0aab5",
    })
    # --------------------------

    df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")
    feature_cols = ["pl_rade","pl_bmasse","pl_orbper","pl_eqt","pl_orbsmax","st_teff","st_met"]
    df = df.dropna(subset=feature_cols)

    scores = model.predict_proba(df[feature_cols])[:,1]

    plt.figure(figsize=(10, 6))
    # Histogram with purple accent
    n, bins, patches = plt.hist(scores, bins=30, color="#7000ff", alpha=0.7, edgecolor="#9d50ff", linewidth=1.2)
    
    plt.xlabel("Habitability Score", fontsize=12, fontweight='bold')
    plt.ylabel("Number of Planets", fontsize=12, fontweight='bold')
    plt.title("Habitability Score Distribution", fontsize=16, pad=20, color="#7000ff")
    plt.grid(color='#2a3b55', linestyle='--', linewidth=0.5, alpha=0.5)
    plt.tight_layout()

    path = "static/plots/habitability_distribution.png"
    plt.savefig(path, dpi=300, facecolor="#050608")
    plt.close()

    return jsonify({"image": path})

# Star–Planet Correlation Plot
@app.route("/plot/star_planet_correlation")
def star_planet_correlation():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    # --- COSMIC THEME SETUP ---
    plt.style.use('dark_background')
    plt.rcParams.update({
        "figure.facecolor": "#050608",
        "axes.facecolor": "#0b0d12",
        "axes.edgecolor": "#ffffff", 
        "axes.linewidth": 0.8,
        "text.color": "#ffffff",
        "axes.labelcolor": "#a0aab5",
        "xtick.color": "#a0aab5",
        "ytick.color": "#a0aab5",
    })
    # --------------------------

    df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")
    df = df.dropna(subset=["pl_eqt","st_teff"])

    plt.figure(figsize=(10, 6))
    
    # Scatter with mixed glow effect
    plt.scatter(df["st_teff"], df["pl_eqt"], alpha=0.6, s=25, c="#00f2ff", edgecolors="none")
    
    plt.xlabel("Stellar Temperature (K)", fontsize=12)
    plt.ylabel("Planet Equilibrium Temperature (K)", fontsize=12)
    plt.title("Star–Planet Temperature Correlation", fontsize=16, pad=20, color="#ffffff")
    plt.grid(color='#2a3b55', linestyle='--', linewidth=0.5, alpha=0.5)
    plt.tight_layout()

    path = "static/plots/star_planet_correlation.png"
    plt.savefig(path, dpi=300, facecolor="#050608")
    plt.close()

    return jsonify({"image": path})

# ===============================
# DYNAMIC USER INPUT VISUALIZATIONS
# ===============================

@app.route("/plot/user_comparison", methods=['POST'])
def user_comparison_plot():
    """Dynamic plot showing user's planet vs known exoplanets"""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from pathlib import Path
    
    data = request.get_json(silent=True) or {}
    
    try:
        user_radius = float(data['planet_radius'])
        user_mass = float(data['planet_mass'])
        user_temp = float(data['equilibrium_temp'])
        user_score = float(data.get('score', 0))
    except (KeyError, ValueError):
        return jsonify({"error": "Missing required fields"}), 400
    
    # --- COSMIC THEME SETUP ---
    plt.style.use('dark_background')
    plt.rcParams.update({
        "figure.facecolor": "#050608",
        "axes.facecolor": "#0b0d12",
        "axes.edgecolor": "#00f2ff",
        "axes.linewidth": 1.2,
        "text.color": "#ffffff",
        "axes.labelcolor": "#a0aab5",
        "xtick.color": "#a0aab5",
        "ytick.color": "#a0aab5",
        "font.family": "sans-serif",
    })
    
    # Load dataset
    df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")
    feature_cols = ["pl_rade", "pl_bmasse", "pl_orbper", "pl_eqt", "pl_orbsmax", "st_teff", "st_met"]
    df = df.dropna(subset=feature_cols)
    
    # Calculate habitability scores
    scores = model.predict_proba(df[feature_cols])[:, 1]
    df["habitability_score"] = scores
    
    # Separate habitable and non-habitable
    habitable = df[df["habitability_score"] >= 0.5]
    non_habitable = df[df["habitability_score"] < 0.5]
    
    # Create plot
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    # Plot 1: Radius vs Mass
    ax1.scatter(non_habitable["pl_rade"], non_habitable["pl_bmasse"], 
                alpha=0.4, s=30, c="#555555", label="Non-Habitable", edgecolors="none")
    ax1.scatter(habitable["pl_rade"], habitable["pl_bmasse"], 
                alpha=0.6, s=30, c="#00ff88", label="Habitable", edgecolors="none")
    ax1.scatter(user_radius, user_mass, 
                s=300, c="#ff0066", marker="*", label="YOUR PLANET", 
                edgecolors="#ffffff", linewidths=2, zorder=5)
    
    ax1.set_xlabel("Planet Radius (Earth Radii)", fontsize=11, fontweight='bold')
    ax1.set_ylabel("Planet Mass (Earth Masses)", fontsize=11, fontweight='bold')
    ax1.set_title("Your Planet vs Known Exoplanets", fontsize=13, color="#00f2ff", pad=15)
    ax1.legend(loc="upper right", fontsize=9)
    ax1.grid(color='#2a3b55', linestyle='--', linewidth=0.5, alpha=0.5)
    
    # Plot 2: Temperature Distribution
    ax2.scatter(habitable["pl_eqt"], habitable["habitability_score"], 
                alpha=0.6, s=30, c="#00ff88", label="Habitable", edgecolors="none")
    ax2.scatter(non_habitable["pl_eqt"], non_habitable["habitability_score"], 
                alpha=0.4, s=30, c="#555555", label="Non-Habitable", edgecolors="none")
    ax2.scatter(user_temp, user_score, 
                s=300, c="#ff0066", marker="*", label="YOUR PLANET", 
                edgecolors="#ffffff", linewidths=2, zorder=5)
    
    ax2.set_xlabel("Equilibrium Temperature (K)", fontsize=11, fontweight='bold')
    ax2.set_ylabel("Habitability Score", fontsize=11, fontweight='bold')
    ax2.set_title("Temperature vs Habitability", fontsize=13, color="#00f2ff", pad=15)
    ax2.legend(loc="upper right", fontsize=9)
    ax2.grid(color='#2a3b55', linestyle='--', linewidth=0.5, alpha=0.5)
    
    plt.tight_layout()
    
    plots_dir = Path("static/plots")
    plots_dir.mkdir(parents=True, exist_ok=True)
    path = plots_dir / "user_comparison.png"
    plt.savefig(path, dpi=300, facecolor="#050608")
    plt.close()
    
    return jsonify({"image": path.as_posix()})


@app.route("/plot/user_feature_analysis", methods=['POST'])
def user_feature_analysis_plot():
    """Shows which features contribute to habitability for user's planet"""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from pathlib import Path
    
    data = request.get_json(silent=True) or {}
    
    try:
        user_features = {
            "Planet Radius": float(data['planet_radius']),
            "Planet Mass": float(data['planet_mass']),
            "Orbital Period": float(data['orbital_period']),
            "Equilibrium Temp": float(data['equilibrium_temp']),
            "Distance from Star": float(data['distance_from_star']),
            "Stellar Temp": float(data['stellar_temp']),
            "Metallicity": float(data['stellar_metallicity'])
        }
    except (KeyError, ValueError):
        return jsonify({"error": "Missing required fields"}), 400
    
    # --- COSMIC THEME SETUP ---
    plt.style.use('dark_background')
    plt.rcParams.update({
        "figure.facecolor": "#050608",
        "axes.facecolor": "#0b0d12",
        "axes.edgecolor": "#7000ff",
        "axes.linewidth": 1.2,
        "text.color": "#ffffff",
        "axes.labelcolor": "#a0aab5",
        "xtick.color": "#a0aab5",
        "ytick.color": "#a0aab5",
        "font.family": "sans-serif",
    })
    
    # Load dataset for comparison
    df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")
    feature_cols = ["pl_rade", "pl_bmasse", "pl_orbper", "pl_eqt", "pl_orbsmax", "st_teff", "st_met"]
    df = df.dropna(subset=feature_cols)
    
    # Get habitable planets for baseline
    scores = model.predict_proba(df[feature_cols])[:, 1]
    habitable_df = df[scores >= 0.5]
    
    # Calculate averages
    habitable_avg = {
        "Planet Radius": habitable_df["pl_rade"].mean(),
        "Planet Mass": habitable_df["pl_bmasse"].mean(),
        "Orbital Period": habitable_df["pl_orbper"].mean(),
        "Equilibrium Temp": habitable_df["pl_eqt"].mean(),
        "Distance from Star": habitable_df["pl_orbsmax"].mean(),
        "Stellar Temp": habitable_df["st_teff"].mean(),
        "Metallicity": habitable_df["st_met"].mean()
    }
    
    # Normalize user features to habitable average (percentage)
    normalized_user = {}
    for key in user_features:
        if habitable_avg[key] != 0:
            normalized_user[key] = (user_features[key] / habitable_avg[key]) * 100
        else:
            normalized_user[key] = 100
    
    # Create plot
    fig, ax = plt.subplots(figsize=(10, 6))
    
    features = list(normalized_user.keys())
    values = list(normalized_user.values())
    
    # Color based on closeness to 100% (ideal)
    colors = ['#00ff88' if 80 <= v <= 120 else '#ff9900' if 50 <= v <= 150 else '#ff0066' for v in values]
    
    bars = ax.barh(features, values, color=colors, alpha=0.7, edgecolor='#ffffff', linewidth=1)
    
    # Add reference line at 100%
    ax.axvline(100, color='#00f2ff', linestyle='--', linewidth=2, label='Habitable Baseline', alpha=0.8)
    
    ax.set_xlabel("Percentage of Habitable Average", fontsize=12, fontweight='bold')
    ax.set_title("Your Planet's Features vs Habitable Planets", fontsize=16, pad=20, color="#7000ff")
    ax.legend(loc="lower right", fontsize=10)
    ax.grid(color='#2a3b55', linestyle='--', linewidth=0.5, alpha=0.5, axis='x')
    
    # Add value labels
    for i, (bar, val) in enumerate(zip(bars, values)):
        ax.text(val + 5, i, f'{val:.0f}%', va='center', fontsize=9, color='#ffffff')
    
    plt.tight_layout()
    
    plots_dir = Path("static/plots")
    plots_dir.mkdir(parents=True, exist_ok=True)
    path = plots_dir / "user_feature_analysis.png"
    plt.savefig(path, dpi=300, facecolor="#050608")
    plt.close()
    
    return jsonify({"image": path.as_posix()})


@app.route("/plot/user_score_context", methods=['POST'])
def user_score_context_plot():
    """Shows user's habitability score in context of all planets"""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from pathlib import Path
    
    data = request.get_json(silent=True) or {}
    
    try:
        user_score = float(data['score'])
    except (KeyError, ValueError):
        return jsonify({"error": "Missing score field"}), 400
    
    # --- COSMIC THEME SETUP ---
    plt.style.use('dark_background')
    plt.rcParams.update({
        "figure.facecolor": "#050608",
        "axes.facecolor": "#0b0d12",
        "axes.edgecolor": "#00f2ff",
        "axes.linewidth": 1.2,
        "text.color": "#ffffff",
        "axes.labelcolor": "#a0aab5",
        "xtick.color": "#a0aab5",
        "ytick.color": "#a0aab5",
        "font.family": "sans-serif",
    })
    
    # Load dataset
    df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")
    feature_cols = ["pl_rade", "pl_bmasse", "pl_orbper", "pl_eqt", "pl_orbsmax", "st_teff", "st_met"]
    df = df.dropna(subset=feature_cols)
    
    scores = model.predict_proba(df[feature_cols])[:, 1]
    
    # Create plot
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Histogram
    n, bins, patches = ax.hist(scores, bins=30, color="#7000ff", alpha=0.7, edgecolor="#9d50ff", linewidth=1.2)
    
    # Add user's score as vertical line
    ax.axvline(user_score, color='#ff0066', linestyle='--', linewidth=3, label=f'YOUR PLANET (Score: {user_score:.3f})')
    
    # Calculate percentile
    percentile = (scores < user_score).sum() / len(scores) * 100
    
    # Add text annotation
    y_pos = max(n) * 0.8
    ax.text(user_score, y_pos, f'  Better than\n  {percentile:.1f}% of planets', 
            color='#ff0066', fontsize=11, fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#0b0d12', edgecolor='#ff0066', linewidth=2))
    
    ax.set_xlabel("Habitability Score", fontsize=12, fontweight='bold')
    ax.set_ylabel("Number of Planets", fontsize=12, fontweight='bold')
    ax.set_title("Where Your Planet Stands", fontsize=16, pad=20, color="#00f2ff")
    ax.legend(loc="upper right", fontsize=10)
    ax.grid(color='#2a3b55', linestyle='--', linewidth=0.5, alpha=0.5)
    
    plt.tight_layout()
    
    plots_dir = Path("static/plots")
    plots_dir.mkdir(parents=True, exist_ok=True)
    path = plots_dir / "user_score_context.png"
    plt.savefig(path, dpi=300, facecolor="#050608")
    plt.close()
    
    return jsonify({"image": path.as_posix()})

# Export Top-10 as Excel
@app.route("/export/excel")
def export_excel():
    from pathlib import Path
    df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")

    feature_cols = ["pl_rade","pl_bmasse","pl_orbper","pl_eqt","pl_orbsmax","st_teff","st_met"]
    df = df.dropna(subset=feature_cols)

    df["score"] = model.predict_proba(df[feature_cols])[:,1]
    top10 = df.sort_values(by="score", ascending=False).head(10)

    output_dir = Path("static")
    output_dir.mkdir(parents=True, exist_ok=True)
    path = output_dir / "top10_exoplanets.xlsx"

    try:
        # Prefer openpyxl if available; otherwise pandas will fall back.
        top10.to_excel(path, index=False)
        return jsonify({"file": path.as_posix()})
    except ImportError:
        # Fallback to CSV when an Excel writer backend is missing.
        csv_path = output_dir / "top10_exoplanets.csv"
        top10.to_csv(csv_path, index=False)
        return jsonify({"file": csv_path.as_posix(), "note": "openpyxl missing; returned CSV"})
    except Exception as exc:  # Surface any other issue instead of failing silently.
        return jsonify({"error": f"Export failed: {exc}"}), 500

# Export Top-10 as PDF

@app.route("/export/pdf")
def export_pdf():
    from pathlib import Path

    # Delay import so we can catch missing dependency and return JSON
    try:
        from reportlab.platypus import SimpleDocTemplate, Paragraph
        from reportlab.lib.styles import getSampleStyleSheet
    except Exception as exc:
        return jsonify({"error": f"PDF export unavailable: {exc}"}), 500

    df = pd.read_csv("Confirmed Exoplanet (Planetary System).csv")
    feature_cols = ["pl_rade","pl_bmasse","pl_orbper","pl_eqt","pl_orbsmax","st_teff","st_met"]
    df = df.dropna(subset=feature_cols)

    df["score"] = model.predict_proba(df[feature_cols])[:,1]
    top10 = df.sort_values(by="score", ascending=False).head(10)

    output_dir = Path("static")
    output_dir.mkdir(parents=True, exist_ok=True)
    path = output_dir / "top10_exoplanets.pdf"

    try:
        doc = SimpleDocTemplate(str(path))  # reportlab expects a string filename
        styles = getSampleStyleSheet()
        content = []

        content.append(Paragraph("Top 10 Habitable Exoplanets", styles["Title"]))

        for _, row in top10.iterrows():
            content.append(
                Paragraph(f"{row['pl_name']} — Score: {round(row['score'],3)}", styles["Normal"])
            )

        doc.build(content)
        return jsonify({"file": path.as_posix()})
    except Exception as exc:
        return jsonify({"error": f"Export failed: {exc}"}), 500

# Download Dataset
@app.route("/download_dataset")
def download_dataset():
    path = "Confirmed Exoplanet (Planetary System).csv"
    return send_file(path, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True)