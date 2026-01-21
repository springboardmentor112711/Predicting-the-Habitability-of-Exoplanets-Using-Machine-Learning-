import pandas as pd

df = pd.read_csv("exoplanet_imputed.csv")

print("✅ Before Final Imputation:\n")
print(df.isna().sum())

final_impute_cols = [
    "RadiusJpt",
    "PeriodDays",
    "HostStarMassSlrMass",
    "HostStarRadiusSlrRad",
    "HostStarMetallicity",
    "HostStarTempK"
]

for col in final_impute_cols:
    df[col] = df[col].fillna(df[col].median())

print("\n✅ After Final Imputation:\n")
print(df.isna().sum())

df.to_csv("exoplanet_final_ml_ready.csv", index=False)

print("\n🎉 FINAL CLEAN DATASET SAVED!")
print("✅ File: exoplanet_final_ml_ready.csv")
