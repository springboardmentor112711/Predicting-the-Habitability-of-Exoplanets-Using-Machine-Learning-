import pandas as pd

def merge_exoplanet_datasets(habitable_path, non_habitable_path, output_path):
    """
    Merge habitable and non-habitable exoplanet datasets
    and save as a single ML-ready CSV file.
    """

    print("🔄 Loading datasets...")

    # Load files
    df_hab = pd.read_csv(habitable_path)
    df_non = pd.read_csv(non_habitable_path)

    print(f"✅ Habitable dataset loaded: {df_hab.shape[0]} rows")
    print(f"✅ Non-Habitable dataset loaded: {df_non.shape[0]} rows")

    # Ensure correct labels
    df_hab["Habitable"] = 1
    df_non["Habitable"] = 0

    # Combine datasets
    df_combined = pd.concat([df_hab, df_non], ignore_index=True)

    # Shuffle for ML fairness
    df_combined = df_combined.sample(frac=1, random_state=42).reset_index(drop=True)

    print("\n📊 Final Dataset Summary:")
    print(df_combined["Habitable"].value_counts())
    print(f"Total Rows: {df_combined.shape[0]}")
    print(f"Total Columns: {df_combined.shape[1]}")

    # Save output
    df_combined.to_csv(output_path, index=False)
    print(f"\n💾 Merged dataset saved as: {output_path}")


# ---------------------------------------------
# Run the function
# ---------------------------------------------
if __name__ == "__main__":
    merge_exoplanet_datasets(
        habitable_path="data/Exo-planets(habitable).csv",
        non_habitable_path="data/Exo-planets(Non-habitable).csv",
        output_path="data/merged/merged_exoplanet_dataset.csv"
    )
