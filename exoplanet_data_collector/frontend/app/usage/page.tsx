import { Card } from '@/components/ui/card'
import { Code2, BookOpen } from 'lucide-react'

export default function UsagePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">ML Pipeline Guide</h1>
          <p className="text-xl text-blue-200">Complete 4-module process for exoplanet habitability prediction</p>
        </div>

        {[
          {
            module: 1,
            title: 'Data Collection & Standardization',
            description: 'Gather exoplanet data from NASA Exoplanet Archive and standardize features',
            outputs: ['Raw exoplanet dataset', 'Feature standardization', 'Missing value handling'],
            code: `import pandas as pd
from sklearn.preprocessing import StandardScaler

exoplanets = pd.read_csv('exoplanets.csv')

features = ['pl_rade', 'pl_bmasse', 'pl_orbper', 
            'pl_orbsmax', 'pl_eqt', 'st_teff', 
            'st_rad', 'st_mass', 'sy_dist', 'pl_dens']

data = exoplanets[features].dropna()

scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)`
          },
          {
            module: 2,
            title: 'Data Cleaning & Feature Engineering',
            description: 'Remove outliers, handle missing values, and engineer habitability score',
            outputs: ['Cleaned dataset', 'Habitability score', 'Feature-engineered data'],
            code: `from scipy import stats

data_clean = data[(np.abs(stats.zscore(data)) < 3).all(axis=1)]

def calculate_habitability(row):
    score = 0
    if 273 <= row['pl_eqt'] <= 373:
        score += 30
    if 0.5 <= row['pl_rade'] <= 2.5:
        score += 25
    if 0.5 <= row['pl_bmasse'] <= 10:
        score += 25
    if 200 <= row['pl_orbper'] <= 500:
        score += 20
    return score

data['habitability'] = data.apply(calculate_habitability, axis=1)
data['habitable'] = (data['habitability'] >= 50).astype(int)`
          },
          {
            module: 3,
            title: 'ML Dataset Preparation',
            description: 'Feature selection, scaling, and train-test split for model training',
            outputs: ['Training dataset', 'Testing dataset', 'Scaled features'],
            code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X = data[features]
y = data['habitable']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, 
    stratify=y, random_state=42
)

print(f'Training: {len(X_train)}')
print(f'Testing: {len(X_test)}')`
          },
          {
            module: 4,
            title: 'Model Training & Evaluation',
            description: 'Train Random Forest classifier and evaluate performance on test data',
            outputs: ['Trained model', 'Performance metrics', 'Feature importance'],
            code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print(f'Accuracy: {accuracy_score(y_test, y_pred):.4f}')
print(f'Precision: {precision_score(y_test, y_pred):.4f}')

import joblib
joblib.dump(model, 'model.pkl')`
          }
        ].map((module) => (
          <Card key={module.module} className="bg-blue-900/20 border-blue-700 p-8 mb-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{module.module}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{module.title}</h2>
              </div>
              <p className="text-blue-200">{module.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen size={18} className="text-cyan-400" />
                  Outputs
                </h3>
                <ul className="space-y-2">
                  {module.outputs.map((output, idx) => (
                    <li key={idx} className="text-blue-200 flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>{output}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Code2 size={18} className="text-cyan-400" />
                  Python Code
                </h3>
                <pre className="bg-blue-950/50 rounded p-3 text-xs text-blue-100 overflow-x-auto border border-blue-700">
                  <code>{module.code}</code>
                </pre>
              </div>
            </div>
          </Card>
        ))}

        <Card className="bg-blue-900/20 border-blue-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Implementation Notes</h2>
          <div className="space-y-3 text-blue-200 text-sm">
            <p><span className="font-semibold text-white">Data Source:</span> NASA Exoplanet Archive</p>
            <p><span className="font-semibold text-white">Libraries:</span> scikit-learn, pandas, numpy, joblib</p>
            <p><span className="font-semibold text-white">Training Time:</span> ~5-10 minutes</p>
            <p><span className="font-semibold text-white">Model Size:</span> ~2-3 MB</p>
            <p><span className="font-semibold text-white">Inference Time:</span> &lt;100ms per prediction</p>
          </div>
        </Card>
      </div>
    </main>
  )
}
