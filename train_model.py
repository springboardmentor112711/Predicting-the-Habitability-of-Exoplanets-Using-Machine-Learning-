import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Load dataset
df = pd.read_csv("backend\exoplanet_module2_ready.csv")

# Features used during training
FEATURE_COLUMNS = [
    "pl_orbper",
    "pl_rade",
    "st_mass",
    "st_rad",
    "st_teff",
    "st_met",
    "sy_dist"
]
print(df.columns)

X = df[FEATURE_COLUMNS]
y = df["habitability_binary"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
print("\nMODEL REPORT:\n")
print(classification_report(y_test, y_pred))

# Save model & scaler
joblib.dump(model, "habitability_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\n✅ Model and scaler saved successfully")
