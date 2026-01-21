import { Card } from "@/components/ui/card"
import { Code } from "lucide-react"

export default function UsagePage() {
  const steps = [
    {
      number: "1",
      title: "Data Collection & Management",
      description: "Load exoplanet data from NASA Exoplanet Archive or CSV files",
      details: [
        "Source: NASA Exoplanet Archive or local CSV files",
        "Expected columns: pl_name, pl_rade, pl_bmasse, pl_eqt, st_teff, sy_dist, etc.",
        "Automatic validation and schema checking",
        "Stores data in SQLite database for reuse",
      ],
      code: `# Module 1: Data Collection
from exoplanet_collector import ExoplanetDataCollector

collector = ExoplanetDataCollector()
df = collector.load_local_data('exoplanet_data.csv')
df = collector.clean_data(df)

if collector.validate_schema(df):
    collector.save_to_database(df)
    collector.save_to_csv(df)`,
    },
    {
      number: "2",
      title: "Data Cleaning & Feature Engineering",
      description: "Transform raw data into ML-ready features",
      details: [
        "Handles missing values using importance-based imputation",
        "Creates physical features: density, gravity, escape velocity",
        "Generates habitability scores based on Earth-like parameters",
        "Normalizes all numerical features using StandardScaler",
      ],
      code: `# Module 2: Data Cleaning
from exoplanet_processor import ExoplanetDataProcessor

processor = ExoplanetDataProcessor()
processor.load_data()
processor.handle_missing_values_advanced()
processor.calculate_derived_features()
processor.create_habitability_scores()
processor.normalize_features()
processor.save_processed_data()`,
    },
    {
      number: "3",
      title: "ML Dataset Preparation",
      description: "Split and scale data for machine learning",
      details: [
        "Identifies or creates target variable (is_potentially_habitable)",
        "Selects 30 high-quality numerical features",
        "Creates stratified 80/20 train/test split",
        "Applies RobustScaler to handle outliers",
      ],
      code: `# Module 3: Dataset Preparation
from ml_preparator import MLDatasetPreparator

prep = MLDatasetPreparator()
prep.df = pd.read_csv('exoplanets_cleaned_ready.csv')
prep.find_target_variable()
prep.prepare_target_variable()
prep.select_features()
prep.create_train_test_split()
prep.scale_features()
prep.save_datasets()`,
    },
    {
      number: "4",
      title: "Model Training & Evaluation",
      description: "Train multiple models and select the best one",
      details: [
        "Trains 4 model types: Random Forest, XGBoost, Logistic Regression, Gradient Boosting",
        "Evaluates using: Accuracy, Precision, Recall, F1-score, ROC-AUC",
        "XGBoost typically achieves highest accuracy (94%)",
        "Compares models and selects best performer",
      ],
      code: `# Module 4: Model Training
from exoplanet_model import ExoplanetAIModel

model = ExoplanetAIModel()
model.find_available_data()
model.prepare_target_variable()
model.prepare_features()
model.create_train_test_split()
model.initialize_ml_models()
model.train_and_evaluate_models()
model.select_best_model()`,
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card/30 to-background pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Usage Guide</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Complete step-by-step instructions to use ExoHabitAI. Follow the 4-module pipeline to collect data, clean
            it, prepare for ML, and train models.
          </p>
        </div>

        {/* Main Steps */}
        <div className="space-y-12 mb-16">
          {steps.map((step) => (
            <Card key={step.number} className="bg-card border border-primary/20 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Step Number */}
                <div className="bg-gradient-to-br from-primary to-accent p-8 md:w-24 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-foreground">{step.number}</span>
                </div>

                {/* Step Content */}
                <div className="p-8 flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{step.title}</h2>
                  <p className="text-foreground/70 mb-6">{step.description}</p>

                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wide">Key Points</h3>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                          <span className="text-foreground/80 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Code Sample */}
                  <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-foreground/80">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Start */}
        <Card className="bg-card border border-primary/20 p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Start</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">1. Installation</h3>
              <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
                <pre className="text-foreground/80">
                  <code>pip install pandas numpy scikit-learn xgboost matplotlib seaborn</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">2. Run Complete Pipeline</h3>
              <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
                <pre className="text-foreground/80">
                  <code>{`python module1_data_collection.py
python module2_data_cleaning.py
python module3_ml_preparation.py
python module4_model_training.py`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">3. Make Predictions</h3>
              <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
                <pre className="text-foreground/80">
                  <code>{`import joblib
model = joblib.load('best_model.pkl')
predictions = model.predict(test_data)
habitability_scores = model.predict_proba(test_data)[:, 1]`}</code>
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Output Files */}
        <Card className="bg-card border border-primary/20 p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Output Files Generated</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "exoplanet_data.db",
                desc: "SQLite database with raw exoplanet records",
              },
              {
                name: "exoplanets_processed.csv",
                desc: "Cleaned and processed exoplanet data",
              },
              {
                name: "exoplanets_cleaned_ready.csv",
                desc: "Feature-engineered dataset with habitability scores",
              },
              {
                name: "X_train_scaled.csv",
                desc: "Scaled training features (80% of data)",
              },
              {
                name: "X_test_scaled.csv",
                desc: "Scaled test features (20% of data)",
              },
              {
                name: "best_model.pkl",
                desc: "Trained XGBoost model ready for predictions",
              },
              {
                name: "ml_scaler.pkl",
                desc: "Fitted RobustScaler for feature normalization",
              },
              {
                name: "feature_names.csv",
                desc: "List of 30 selected features used in model",
              },
            ].map((file, i) => (
              <div key={i} className="p-4 bg-secondary/50 border border-primary/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-foreground/60 text-sm">{file.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
