# 🌍 Exoplanet Habitability Prediction using Machine Learning

This project focuses on predicting the **habitability of exoplanets** using **physics-based feature engineering and machine learning**. The current stage of the project completes the **entire data preprocessing and scientific feature generation pipeline**, making the dataset fully ready for ML model training.

---

## 📌 Project Objective

To build an AI system that:
- Analyzes **planetary and host star characteristics**
- Applies **astrophysical formulas**
- Predicts whether an exoplanet is **potentially habitable**

---

## ✅ Current Project Status (Completed So Far)

- ✔ Raw dataset loading  
- ✔ Full missing value analysis  
- ✔ Null value visualization  
- ✔ Removal of unnecessary & high-null columns  
- ✔ Physics-based feature derivation  
- ✔ Complete missing value imputation  
- ✔ Energy & temperature modeling  
- ✔ Final ML-ready dataset generation  

> 🚀 The project is now **ready for habitability labeling and ML model training**.

---

## 📂 Dataset Description

The dataset contains real astronomical features related to exoplanets and their host stars.

### ✅ Core Features Used

| Feature | Description |
|--------|-------------|
| `PlanetaryMassJpt` | Mass of the planet |
| `RadiusJpt` | Radius of the planet |
| `PeriodDays` | Orbital period |
| `SemiMajorAxisAU` | Distance from host star |
| `Eccentricity` | Orbital shape |
| `SurfaceTempK` | Observed surface temperature |
| `HostStarMassSlrMass` | Host star mass |
| `HostStarRadiusSlrRad` | Host star radius |
| `HostStarMetallicity` | Host star chemical composition |
| `HostStarTempK` | Host star temperature |
| `PlanetDensity` | Derived: Rocky vs gaseous planet indicator |
| `HostStarLuminosity` | Derived: Stellar energy output |
| `InsolationFlux` | Derived: Energy received by planet |
| `EquilibriumTemp` | Derived: Estimated planetary surface temperature |

✅ **Final Dataset Size:**


---

## ⚙️ Data Processing Pipeline (Completed)

### 🔹 1. Raw Data Loading
The raw exoplanet dataset is loaded into a Pandas DataFrame for analysis.

---

### 🔹 2. Missing Value Analysis & Visualization
- A complete null value report was generated.
- A bar graph visualization was created to identify:
  - High-null columns
  - Columns requiring imputation

---

### 🔹 3. Dropping Unnecessary Columns
Non-informative and very high-null columns were removed, such as:
- Orbital orientation angles
- Sky coordinates
- Discovery metadata
- Time-update fields

This reduced noise and dimensionality.

---

### 🔹 4. Feature Engineering (Physics-Based Derivations)

#### ✅ Planet Density
\[
Density = \frac{Mass}{Radius^3}
\]
Used to classify planets as rocky or gaseous.

#### ✅ Host Star Luminosity
\[
Luminosity = R_{star}^2 \times T_{star}^4
\]
Controls energy output and habitable zone boundaries.

---

### 🔹 5. Missing Value Imputation
Median imputation was applied to all important scientific features to ensure:
- Zero data loss
- Stable data distributions
- No NaN propagation into derived features

✅ After imputation, the dataset contains **zero missing values**.

---

### 🔹 6. Feature Engineering (Physics-Based Derivations)

#### ✅ Planet Density
\[
Density = \frac{Mass}{Radius^3}
\]
Used to classify planets as rocky or gaseous.

#### ✅ Host Star Luminosity
\[
Luminosity = R_{star}^2 \times T_{star}^4
\]
Controls energy output and habitable zone boundaries.

---
### 🔹 7. Energy & Temperature Modeling

#### ✅ Insolation Flux
\[
S = \frac{L_{star}}{a^2}
\]
Represents energy received by the planet relative to Earth.

#### ✅ Equilibrium Temperature
\[
T_{eq} = T_{star} \times \sqrt{\frac{R_{star}}{2a}}
\]
Estimates the expected planetary surface temperature.

These are the **strongest predictors of liquid water potential**.

---

### 🔹 8. Final ML-Ready Dataset Creation
The fully processed dataset is saved as:


This file is now **ready for:**
- Habitability labeling
- Class imbalance analysis
- Random Forest & XGBoost training

---

## 📊 Visualizations Implemented So Far

- ✅ Null value bar graph (raw dataset)
- ✅ Feature preview after cleaning
- ✅ Energy and temperature feature validation

---

## 🧠 Machine Learning (Upcoming)

The next development phase will include:

- 🔜 Habitability label generation (0 = Not Habitable, 1 = Habitable)
- 🔜 Class imbalance handling (SMOTE / class weighting)
- 🔜 Model training (Random Forest, XGBoost)
- 🔜 Model evaluation (Accuracy, Precision, Recall, F1, ROC-AUC)
- 🔜 Feature importance analysis

---

## 🛠️ Technologies Used

- Python  
- Pandas  
- NumPy  
- Matplotlib  
- Jupyter Notebook  
- Scikit-learn (upcoming)

---

## 📌 Use Case

- Astronomical research  
- Exoplanet candidate filtering  
- AI-assisted space exploration  
- Academic and research projects  

---

## ✅ Author

**Guruprasad S**  
Final Year B.Tech – CSE  
AI & Machine Learning Enthusiast  

---

## 📜 License

This project is for **academic and research purposes**.
