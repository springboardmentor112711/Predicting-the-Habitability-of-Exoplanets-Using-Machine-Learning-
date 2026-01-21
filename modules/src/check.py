import pandas as pd
import matplotlib.pyplot as plt


df = pd.read_csv("data/Exoplanet_dataset.csv")
null_counts = df.isna().sum()
plt.figure()
null_counts.plot(kind='bar')
plt.title("Null Values in Raw Exoplanet Dataset")
plt.xlabel("Features")
plt.ylabel("Number of Null Values")
plt.xticks(rotation=90)
plt.tight_layout()
plt.show()
