"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

const modelComparison = [
  { model: "Random Forest", accuracy: 92, precision: 90, recall: 88, f1: 89 },
  { model: "XGBoost", accuracy: 94, precision: 93, recall: 91, f1: 92 },
  { model: "Gradient Boost", accuracy: 91, precision: 89, recall: 87, f1: 88 },
  { model: "Logistic Reg.", accuracy: 85, precision: 83, recall: 81, f1: 82 },
]

const habitabilityDistribution = [
  { score: "0-20", count: 245, label: "Not Habitable" },
  { score: "20-40", count: 189, label: "Low" },
  { score: "40-60", count: 156, label: "Medium" },
  { score: "60-80", count: 98, label: "High" },
  { score: "80-100", count: 42, label: "Very High" },
]

export default function ModelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card/30 to-background pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">ML Model Architecture</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            ExoHabitAI uses ensemble machine learning models trained on NASA exoplanet data to predict habitability with
            high accuracy.
          </p>
        </div>

        {/* Model Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card border border-primary/20 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Model Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-foreground">Best Model: XGBoost</span>
                  <span className="text-accent font-semibold">94% Accuracy</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-foreground">Precision Score</span>
                  <span className="text-accent font-semibold">93%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    style={{ width: "93%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-foreground">Recall Score</span>
                  <span className="text-accent font-semibold">91%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    style={{ width: "91%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-foreground">F1-Score</span>
                  <span className="text-accent font-semibold">92%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-card border border-primary/20 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Training Data</h2>
            <div className="space-y-6">
              <div>
                <p className="text-foreground/70 text-sm mb-2">Total Exoplanets Analyzed</p>
                <p className="text-3xl font-bold text-accent">5,000+</p>
              </div>
              <div>
                <p className="text-foreground/70 text-sm mb-2">Features Engineered</p>
                <p className="text-3xl font-bold text-accent">30</p>
              </div>
              <div>
                <p className="text-foreground/70 text-sm mb-2">Training/Test Split</p>
                <p className="text-3xl font-bold text-accent">80/20</p>
              </div>
              <div>
                <p className="text-foreground/70 text-sm mb-2">Habitable Candidates</p>
                <p className="text-3xl font-bold text-accent">730</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Model Comparison Chart */}
        <Card className="bg-card border border-primary/20 p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Model Comparison</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={modelComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="model" stroke="var(--foreground)" />
              <YAxis stroke="var(--foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Legend />
              <Bar dataKey="accuracy" fill="var(--chart-1)" />
              <Bar dataKey="precision" fill="var(--chart-2)" />
              <Bar dataKey="recall" fill="var(--chart-3)" />
              <Bar dataKey="f1" fill="var(--chart-4)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Habitability Distribution */}
        <Card className="bg-card border border-primary/20 p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Habitability Score Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={habitabilityDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--foreground)" />
              <YAxis dataKey="score" type="category" stroke="var(--foreground)" width={60} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar dataKey="count" fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card border border-primary/20 p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Key Input Features</h3>
            <ul className="space-y-3">
              {[
                "Planetary Radius (Earth radii)",
                "Planetary Mass (Earth masses)",
                "Orbital Period (days)",
                "Orbital Semi-major Axis (AU)",
                "Equilibrium Temperature (K)",
                "Host Star Effective Temperature (K)",
                "Host Star Radius (Solar radii)",
                "Host Star Mass (Solar masses)",
                "System Distance (parsecs)",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-card border border-primary/20 p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Output Metrics</h3>
            <ul className="space-y-3">
              {[
                "Habitability Score (0-100)",
                "Binary Classification (Habitable/Not Habitable)",
                "Confidence Level",
                "Ranking Position",
                "Key Contributing Factors",
                "Similarity to Earth",
                "Habitable Zone Status",
                "Comparative Analysis",
              ].map((metric, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <span className="text-foreground/80">{metric}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </main>
  )
}
