import { Card } from "@/components/ui/card"
import { BookOpen, FileText, Zap, Database } from "lucide-react"

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card/30 to-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Documentation</h1>
          <p className="text-lg text-foreground/70">
            Complete API reference, architecture details, and advanced usage documentation.
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="bg-card border border-primary/20 p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: BookOpen, title: "Getting Started", anchor: "#getting-started" },
              { icon: Database, title: "Data Format", anchor: "#data-format" },
              { icon: Zap, title: "API Reference", anchor: "#api-reference" },
              { icon: FileText, title: "Examples", anchor: "#examples" },
            ].map((item) => (
              <a
                key={item.anchor}
                href={item.anchor}
                className="p-4 bg-secondary/30 border border-primary/10 rounded-lg hover:border-accent/50 hover:bg-secondary/50 transition-all flex items-center gap-3"
              >
                <item.icon className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item.title}</span>
              </a>
            ))}
          </div>
        </Card>

        {/* Getting Started */}
        <section id="getting-started" className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Getting Started</h2>

          <Card className="bg-card border border-primary/20 p-8 mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Installation</h3>
            <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm mb-4">
              <pre className="text-foreground/80">
                <code>
                  {`pip install exohabitat-ai
# or
pip install pandas numpy scikit-learn xgboost joblib matplotlib seaborn`}
                </code>
              </pre>
            </div>
            <p className="text-foreground/70">
              ExoHabitAI requires Python 3.8+ and the listed dependencies. For development, also install pytest and
              sphinx.
            </p>
          </Card>

          <Card className="bg-card border border-primary/20 p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Basic Usage</h3>
            <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
              <pre className="text-foreground/80">
                <code>
                  {`from exohabitat import ExoplanetPredictor

# Initialize the predictor
predictor = ExoplanetPredictor()
predictor.load_model('best_model.pkl')

# Make a prediction
result = predictor.predict(
    radius=1.2,      # Earth radii
    mass=1.5,        # Earth masses
    temperature=280, # Kelvin
    orbital_period=365,
    star_temp=5778,
    star_mass=1.0,
    distance=10
)

print(f"Habitability Score: {result['score']}")
print(f"Classification: {result['classification']}")`}
                </code>
              </pre>
            </div>
          </Card>
        </section>

        {/* Data Format */}
        <section id="data-format" className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Data Format</h2>

          <Card className="bg-card border border-primary/20 p-8 mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Input Parameters</h3>

            <div className="space-y-4">
              {[
                { name: "pl_name", type: "string", desc: "Planet name/identifier" },
                { name: "pl_rade", type: "float", desc: "Planetary radius (Earth radii)" },
                { name: "pl_bmasse", type: "float", desc: "Planetary mass (Earth masses)" },
                { name: "pl_eqt", type: "float", desc: "Equilibrium temperature (Kelvin)" },
                { name: "pl_orbper", type: "float", desc: "Orbital period (days)" },
                { name: "pl_orbsmax", type: "float", desc: "Orbital semi-major axis (AU)" },
                { name: "st_teff", type: "float", desc: "Star effective temperature (K)" },
                { name: "st_rad", type: "float", desc: "Star radius (Solar radii)" },
                { name: "st_mass", type: "float", desc: "Star mass (Solar masses)" },
                { name: "sy_dist", type: "float", desc: "Distance to system (parsecs)" },
              ].map((param) => (
                <div key={param.name} className="p-4 bg-secondary/30 border border-primary/10 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-mono text-sm text-accent font-semibold">{param.name}</p>
                      <p className="text-foreground/70 text-sm">{param.desc}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary/20 border border-primary/40 rounded text-xs font-semibold text-primary">
                      {param.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-card border border-primary/20 p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Output Format</h3>

            <div className="space-y-4">
              {[
                {
                  name: "habitability_score",
                  type: "float (0-100)",
                  desc: "Overall habitability score",
                },
                {
                  name: "classification",
                  type: "string",
                  desc: 'One of: "Highly Habitable", "Potentially Habitable", "Non-Habitable"',
                },
                { name: "confidence", type: "float (0-100)", desc: "Model confidence in prediction" },
                {
                  name: "earth_similarity",
                  type: "float (0-100)",
                  desc: "How similar to Earth",
                },
                { name: "factors", type: "dict", desc: "Contributing factors to score" },
              ].map((param) => (
                <div key={param.name} className="p-4 bg-secondary/30 border border-primary/10 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-mono text-sm text-accent font-semibold">{param.name}</p>
                      <p className="text-foreground/70 text-sm">{param.desc}</p>
                    </div>
                    <span className="px-3 py-1 bg-accent/20 border border-accent/40 rounded text-xs font-semibold text-accent">
                      {param.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* API Reference */}
        <section id="api-reference" className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">API Reference</h2>

          <Card className="bg-card border border-primary/20 p-8 mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 font-mono">ExoplanetPredictor</h3>

            <div className="space-y-6">
              <div>
                <p className="font-mono text-sm text-accent mb-3">load_model(path: str)</p>
                <p className="text-foreground/70 mb-3">Load a trained model from disk.</p>
                <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-foreground/80">
                    <code>{`predictor.load_model('best_model.pkl')
# Returns: None`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <p className="font-mono text-sm text-accent mb-3">predict(radius, mass, temperature, ...)</p>
                <p className="text-foreground/70 mb-3">Make a habitability prediction for a single planet.</p>
                <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-foreground/80">
                    <code>{`result = predictor.predict(
    radius=1.2,
    mass=1.5,
    temperature=280,
    orbital_period=365,
    star_temp=5778,
    star_mass=1.0,
    distance=10
)
# Returns: dict with 'score', 'classification', 'confidence'`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <p className="font-mono text-sm text-accent mb-3">predict_batch(dataframe)</p>
                <p className="text-foreground/70 mb-3">Make predictions for multiple planets at once.</p>
                <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-foreground/80">
                    <code>{`import pandas as pd

df = pd.read_csv('exoplanets.csv')
results = predictor.predict_batch(df)
# Returns: DataFrame with predictions for all rows`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <p className="font-mono text-sm text-accent mb-3">get_feature_importance()</p>
                <p className="text-foreground/70 mb-3">Get feature importance scores from the model.</p>
                <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-foreground/80">
                    <code>{`importance = predictor.get_feature_importance()
# Returns: dict mapping feature names to importance scores`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Examples */}
        <section id="examples" className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Examples</h2>

          <Card className="bg-card border border-primary/20 p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Batch Processing</h3>

            <div className="bg-secondary/50 border border-primary/10 rounded-lg p-4 font-mono text-sm">
              <pre className="text-foreground/80">
                <code>
                  {`import pandas as pd
from exohabitat import ExoplanetPredictor

# Load model
predictor = ExoplanetPredictor()
predictor.load_model('best_model.pkl')

# Load data
data = pd.read_csv('exoplanets.csv')

# Get predictions
predictions = predictor.predict_batch(data)

# Filter for habitable planets
habitable = predictions[predictions['habitability_score'] >= 70]

# Save results
habitable.to_csv('habitable_candidates.csv', index=False)
print(f"Found {len(habitable)} potentially habitable planets")`}
                </code>
              </pre>
            </div>
          </Card>
        </section>

        {/* Advanced Topics */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Architecture Overview</h2>

          <Card className="bg-card border border-primary/20 p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">4-Module Pipeline</h3>
                <p className="text-foreground/70 mb-4">
                  ExoHabitAI follows a modular architecture for maximum flexibility and maintainability:
                </p>
                <div className="space-y-3">
                  {[
                    "Module 1: Data Collection - Load and validate exoplanet datasets",
                    "Module 2: Feature Engineering - Create domain-specific features",
                    "Module 3: Dataset Prep - Prepare ML-ready train/test splits",
                    "Module 4: Model Training - Train and evaluate multiple models",
                  ].map((module, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-sm font-semibold">{i + 1}</span>
                      </div>
                      <p className="text-foreground/80">{module}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-primary/20 pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Model Ensemble</h3>
                <p className="text-foreground/70">
                  The best predictions come from combining multiple models. XGBoost typically achieves 94% accuracy,
                  while the ensemble approach reduces overfitting and improves generalization.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  )
}
