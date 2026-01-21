import pandas as pd

# ===============================
# 1️⃣ LOAD FINAL FEATURE DATASET
# ===============================
df = pd.read_csv("exoplanet_with_flux_teq.csv")

# ===============================
# 2️⃣ LIST OF DERIVED FEATURES
# (As per your project pipeline)
# ===============================
derived_features = [
    "PlanetDensity",        # From PlanetaryMassJpt & RadiusJpt
    "HostStarLuminosity",   # From HostStarRadiusSlrRad & HostStarTempK
    "InsolationFlux",       # From HostStarLuminosity & SemiMajorAxisAU
    "EquilibriumTemp"      # From HostStarTempK, HostStarRadiusSlrRad & SemiMajorAxisAU
]

print("✅ DERIVED FEATURE STATUS:\n")

for feature in derived_features:
    if feature in df.columns:
        print(f"✅ {feature} → PRESENT in dataset")
    else:
        print(f"❌ {feature} → MISSING from dataset")

print("\n✅ SAMPLE VALUES OF DERIVED FEATURES:\n")
print(df[derived_features].head())
