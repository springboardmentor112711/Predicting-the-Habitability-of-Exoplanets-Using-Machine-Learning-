import Link from "next/link"
import { ArrowRight, Zap, BarChart3, Telescope } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card/30 to-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl opacity-30 rounded-full"></div>
              <div className="relative bg-card border border-primary/20 rounded-full px-4 py-2">
                <span className="text-accent text-sm font-semibold">Discover Habitable Worlds</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-foreground mb-6 leading-tight">
            Predict Exoplanet
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              {" "}
              Habitability
            </span>
          </h1>

          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            Advanced machine learning models to identify potentially habitable exoplanets based on physical, orbital,
            and stellar characteristics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Try the Demo
              <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/usage"
              className="px-8 py-3 bg-secondary/50 border border-primary/30 text-foreground rounded-lg font-semibold hover:bg-secondary transition-all"
            >
              Learn How to Use
            </Link>
          </div>
        </div>

        {/* Feature Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            {
              icon: Telescope,
              title: "Analyze Exoplanets",
              description: "Process data from NASA archives with 5000+ exoplanet records",
            },
            {
              icon: Zap,
              title: "ML-Powered",
              description: "Random Forest, XGBoost, and advanced ensemble models",
            },
            {
              icon: BarChart3,
              title: "Habitability Scores",
              description: "Get actionable predictions and habitability rankings",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card border border-primary/20 rounded-lg p-6 hover:border-accent/50 transition-all"
            >
              <feature.icon className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20 border-y border-primary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Data Collection", desc: "Load exoplanet datasets" },
              { step: 2, title: "Feature Engineering", desc: "Extract key characteristics" },
              { step: 3, title: "Model Training", desc: "Train on historical data" },
              { step: 4, title: "Prediction", desc: "Get habitability scores" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
                  <span className="text-primary-foreground font-bold">{item.step}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-16">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Comprehensive Data Processing",
              items: [
                "Handles 5000+ exoplanet records",
                "Automatic missing value imputation",
                "Outlier detection and removal",
              ],
            },
            {
              title: "Advanced Feature Engineering",
              items: ["Planetary density calculations", "Habitable zone detection", "Stellar compatibility scoring"],
            },
            {
              title: "Multiple ML Models",
              items: ["Random Forest Classifier", "XGBoost Classifier", "Logistic Regression"],
            },
            {
              title: "Actionable Insights",
              items: ["Habitability score 0-100", "Binary classification", "Exoplanet ranking system"],
            },
          ].map((feature, i) => (
            <div key={i} className="bg-card border border-primary/20 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">{feature.title}</h3>
              <ul className="space-y-4">
                {feature.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/20 to-accent/20 border-y border-primary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Explore?</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Start predicting exoplanet habitability with our interactive demo or dive into the documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/50 transition-all"
            >
              Launch Demo
            </Link>
            <Link
              href="/docs"
              className="px-8 py-3 bg-secondary border border-primary/30 text-foreground rounded-lg font-semibold hover:border-accent/50 transition-all"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
