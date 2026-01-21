"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"

interface PredictionResult {
  habitabilityScore: number
  classification: string
  confidence: number
  earthSimilarity: number
  status: "habitable" | "marginal" | "non-habitable"
}

export default function DemoPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [formData, setFormData] = useState({
    planetName: "",
    radius: "1.0",
    mass: "1.0",
    temperature: "288",
    orbitalPeriod: "365",
    starTemp: "5778",
    starMass: "1.0",
    distance: "4.37",
  })

  const examplePlanets = [
    {
      name: "TRAPPIST-1e",
      radius: 0.92,
      mass: 0.62,
      temperature: 246,
      orbitalPeriod: 6.1,
      starTemp: 2566,
      starMass: 0.089,
      distance: 12.1,
    },
    {
      name: "Proxima Centauri b",
      radius: 1.27,
      mass: 1.27,
      temperature: 234,
      orbitalPeriod: 11.186,
      starTemp: 3042,
      starMass: 0.12,
      distance: 1.3,
    },
    {
      name: "Kepler-452b",
      radius: 1.6,
      mass: 5.0,
      temperature: 265,
      orbitalPeriod: 384.8,
      starTemp: 5757,
      starMass: 1.04,
      distance: 430,
    },
    {
      name: "Earth",
      radius: 1.0,
      mass: 1.0,
      temperature: 288,
      orbitalPeriod: 365,
      starTemp: 5778,
      starMass: 1.0,
      distance: 0.000004848,
    },
  ]

  const simulatePrediction = (data: typeof formData): PredictionResult => {
    const radius = Number.parseFloat(data.radius)
    const mass = Number.parseFloat(data.mass)
    const temp = Number.parseFloat(data.temperature)
    const starTemp = Number.parseFloat(data.starTemp)
    const starMass = Number.parseFloat(data.starMass)

    // Simulate ML model scoring
    let score = 50

    // Temperature score (250-300K is ideal)
    const tempDiff = Math.abs(temp - 275)
    const tempScore = Math.max(0, 40 - tempDiff * 0.2)
    score += tempScore

    // Size score (0.8-1.5 Earth radii is ideal)
    if (radius >= 0.8 && radius <= 1.5) {
      score += 30
    } else {
      score += Math.max(0, 30 - Math.abs(radius - 1.0) * 15)
    }

    // Star similarity (similar to Sun is better)
    const starTempDiff = Math.abs(starTemp - 5778)
    const starScore = Math.max(0, 15 - starTempDiff * 0.005)
    score += starScore

    score = Math.min(100, Math.max(0, score))

    let classification: string
    let status: "habitable" | "marginal" | "non-habitable"

    if (score >= 70) {
      classification = "Highly Habitable"
      status = "habitable"
    } else if (score >= 50) {
      classification = "Potentially Habitable"
      status = "marginal"
    } else {
      classification = "Non-Habitable"
      status = "non-habitable"
    }

    const earthSimilarity = 100 - Math.abs(score - 100) * 0.5

    return {
      habitabilityScore: Math.round(score),
      classification,
      confidence: 85 + Math.random() * 10,
      earthSimilarity: Math.max(0, Math.round(earthSimilarity)),
      status,
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePredict = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const prediction = simulatePrediction(formData)
    setResult(prediction)
    setLoading(false)
  }

  const loadExample = (planet: (typeof examplePlanets)[0]) => {
    setFormData({
      planetName: planet.name,
      radius: planet.radius.toString(),
      mass: planet.mass.toString(),
      temperature: planet.temperature.toString(),
      orbitalPeriod: planet.orbitalPeriod.toString(),
      starTemp: planet.starTemp.toString(),
      starMass: planet.starMass.toString(),
      distance: planet.distance.toString(),
    })
    setResult(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card/30 to-background pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Interactive Demo</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Enter exoplanet characteristics to see how our ML model predicts habitability. Try example planets or use
            your own data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border border-primary/20 p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">Planet Parameters</h2>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Planet Name</label>
                  <Input
                    type="text"
                    name="planetName"
                    value={formData.planetName}
                    onChange={handleInputChange}
                    placeholder="e.g., TRAPPIST-1e"
                    className="bg-secondary border border-primary/20 text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Radius (Earth radii)</label>
                    <Input
                      type="number"
                      name="radius"
                      value={formData.radius}
                      onChange={handleInputChange}
                      step="0.1"
                      className="bg-secondary border border-primary/20 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Mass (Earth masses)</label>
                    <Input
                      type="number"
                      name="mass"
                      value={formData.mass}
                      onChange={handleInputChange}
                      step="0.1"
                      className="bg-secondary border border-primary/20 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Equilibrium Temp (K)</label>
                    <Input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      step="5"
                      className="bg-secondary border border-primary/20 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Orbital Period (days)</label>
                    <Input
                      type="number"
                      name="orbitalPeriod"
                      value={formData.orbitalPeriod}
                      onChange={handleInputChange}
                      step="1"
                      className="bg-secondary border border-primary/20 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Star Temp (K)</label>
                    <Input
                      type="number"
                      name="starTemp"
                      value={formData.starTemp}
                      onChange={handleInputChange}
                      step="100"
                      className="bg-secondary border border-primary/20 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Star Mass (Solar)</label>
                    <Input
                      type="number"
                      name="starMass"
                      value={formData.starMass}
                      onChange={handleInputChange}
                      step="0.1"
                      className="bg-secondary border border-primary/20 text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Distance (parsecs)</label>
                  <Input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    step="0.1"
                    className="bg-secondary border border-primary/20 text-foreground"
                  />
                </div>
              </div>

              <Button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50"
              >
                {loading ? "Predicting..." : "Predict Habitability"}
                {!loading && <Sparkles className="inline-block ml-2 w-4 h-4" />}
              </Button>
            </Card>

            {/* Example Planets */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Try Example Planets</h3>
              <div className="grid grid-cols-2 gap-4">
                {examplePlanets.map((planet) => (
                  <button
                    key={planet.name}
                    onClick={() => loadExample(planet)}
                    className="p-4 bg-card border border-primary/20 rounded-lg hover:border-accent/50 hover:bg-secondary/30 transition-all text-left"
                  >
                    <p className="font-semibold text-foreground">{planet.name}</p>
                    <p className="text-foreground/60 text-sm">Load example data</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            {result ? (
              <Card
                className={`bg-card border p-8 sticky top-32 ${
                  result.status === "habitable"
                    ? "border-green-500/50"
                    : result.status === "marginal"
                      ? "border-yellow-500/50"
                      : "border-red-500/50"
                }`}
              >
                <h3 className="text-xl font-bold text-foreground mb-6">Prediction Results</h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-foreground/70 text-sm mb-2">Habitability Score</p>
                    <div className="flex items-end gap-4">
                      <div className="text-4xl font-bold text-accent">{result.habitabilityScore}</div>
                      <span className="text-foreground/60 mb-1">/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mt-3">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          result.status === "habitable"
                            ? "bg-green-500"
                            : result.status === "marginal"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${result.habitabilityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border-t border-primary/20 pt-6">
                    <p className="text-foreground/70 text-sm mb-2">Classification</p>
                    <p
                      className={`text-lg font-bold ${
                        result.status === "habitable"
                          ? "text-green-400"
                          : result.status === "marginal"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {result.classification}
                    </p>
                  </div>

                  <div className="border-t border-primary/20 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-foreground/70 text-sm">Model Confidence</span>
                      <span className="text-accent font-semibold">{Math.round(result.confidence)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border-t border-primary/20 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70 text-sm">Earth Similarity</span>
                      <span className="text-accent font-semibold">{result.earthSimilarity}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-secondary/50 border border-primary/10 rounded-lg text-sm text-foreground/70">
                  <p>
                    This is a simulated demonstration. For production predictions, integrate the trained ML model with
                    your data pipeline.
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="bg-card border border-primary/20 p-8 sticky top-32">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-accent" />
                  </div>
                  <p className="text-foreground/70">Enter planet parameters and click predict to see results</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
