'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2, Trash2, RefreshCw, Download, Plus } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

interface ExoplanetData {
  id?: number
  name: string
  pl_rade: number
  pl_bmasse: number
  pl_orbper: number
  pl_orbsmax: number
  pl_eqt: number
  st_teff: number
  st_rad: number
  st_mass: number
  sy_dist: number
  pl_dens: number
  discovery_year?: number
}

interface PredictionResult {
  success: boolean
  prediction: number
  habitability_score: number
  classification: string
  color: string
  probabilities: {
    not_habitable: number
    habitable: number
  }
}

interface RankedPlanet {
  planet: ExoplanetData
  prediction: {
    habitability_score: number
    classification: string
    color: string
  }
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'predictor' | 'ranking' | 'statistics'>('predictor')
  const [formData, setFormData] = useState<ExoplanetData>({
    name: '',
    pl_rade: 1.0,
    pl_bmasse: 1.0,
    pl_orbper: 365,
    pl_orbsmax: 1.0,
    pl_eqt: 288,
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    sy_dist: 10.0,
    pl_dens: 1.0,
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [rankedPlanets, setRankedPlanets] = useState<RankedPlanet[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [samplePlanets, setSamplePlanets] = useState<ExoplanetData[]>([])

  // Load sample planets on mount
  useEffect(() => {
    fetchSamplePlanets()
  }, [])

  const fetchSamplePlanets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/exoplanets`)
      const data = await res.json()
      if (data.success && data.exoplanets) {
        setSamplePlanets(data.exoplanets)
      }
    } catch (err) {
      console.error('Error fetching planets:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value)
    }))
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        setPrediction(data)
      } else {
        setError(data.error || 'Prediction failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error making prediction')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlanet = async () => {
    if (!formData.name.trim()) {
      setError('Planet name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/add_planet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        setPrediction(data.prediction)
        setFormData(prev => ({ ...prev, name: '' }))
        setError(null)
        fetchRankedPlanets()
        alert(`Planet "${formData.name}" added successfully!`)
      } else {
        setError(data.error || 'Failed to add planet')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding planet')
    } finally {
      setLoading(false)
    }
  }

  const fetchRankedPlanets = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/rank`)
      const data = await res.json()
      if (data.success) {
        setRankedPlanets(data.planets)
      } else {
        setError(data.error || 'Failed to fetch rankings')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching rankings')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/statistics`)
      const data = await res.json()
      if (data.success) {
        setStatistics(data)
      } else {
        setError(data.error || 'Failed to fetch statistics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching statistics')
    } finally {
      setLoading(false)
    }
  }

  const loadSamplePlanet = (planet: ExoplanetData) => {
    setFormData(planet)
    setPrediction(null)
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500/20 border-green-500 text-green-300'
      case 'yellow':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
      case 'red':
        return 'bg-red-500/20 border-red-500 text-red-300'
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-300'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Habitability Predictor</h1>
          <p className="text-blue-200">Predict exoplanet habitability using machine learning</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['predictor', 'ranking', 'statistics'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any)
                if (tab === 'ranking') fetchRankedPlanets()
                if (tab === 'statistics') fetchStatistics()
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-900/30 text-blue-200 hover:bg-blue-900/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="mb-6 border-red-500 bg-red-500/10 p-4 flex gap-3 items-start">
            <AlertCircle className="text-red-400 mt-1" />
            <div>
              <p className="text-red-300 font-semibold">Error</p>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* Predictor Tab */}
        {activeTab === 'predictor' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form */}
            <Card className="bg-blue-900/20 border-blue-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Planet Parameters</h2>

              <div className="space-y-3">
                {/* Planet Name */}
                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-1">
                    Planet Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Kepler-452b"
                    className="bg-blue-950 border-blue-700 text-white placeholder:text-blue-400"
                  />
                </div>

                {/* Planetary Parameters */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'pl_rade', label: 'Radius (R⊕)', min: 0.1, max: 10 },
                    { key: 'pl_bmasse', label: 'Mass (M⊕)', min: 0.1, max: 100 },
                    { key: 'pl_orbper', label: 'Orbit Period (days)', min: 1, max: 10000 },
                    { key: 'pl_orbsmax', label: 'Semi-major Axis (AU)', min: 0.01, max: 100 },
                    { key: 'pl_eqt', label: 'Equilibrium Temp (K)', min: 100, max: 3000 },
                    { key: 'pl_dens', label: 'Density (g/cm³)', min: 0.1, max: 100 }
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-blue-200 mb-1">
                        {field.label}
                      </label>
                      <Input
                        type="number"
                        name={field.key}
                        value={formData[field.key as keyof ExoplanetData]}
                        onChange={handleInputChange}
                        min={field.min}
                        max={field.max}
                        step={0.01}
                        className="bg-blue-950 border-blue-700 text-white text-sm"
                      />
                    </div>
                  ))}
                </div>

                {/* Stellar Parameters */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'st_teff', label: 'Stellar Temp (K)', min: 2000, max: 10000 },
                    { key: 'st_rad', label: 'Stellar Radius (R☉)', min: 0.1, max: 10 },
                    { key: 'st_mass', label: 'Stellar Mass (M☉)', min: 0.1, max: 10 },
                    { key: 'sy_dist', label: 'Distance (parsecs)', min: 0.1, max: 1000 }
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-blue-200 mb-1">
                        {field.label}
                      </label>
                      <Input
                        type="number"
                        name={field.key}
                        value={formData[field.key as keyof ExoplanetData]}
                        onChange={handleInputChange}
                        min={field.min}
                        max={field.max}
                        step={0.01}
                        className="bg-blue-950 border-blue-700 text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Planets */}
              <div className="mt-4 pt-4 border-t border-blue-700">
                <p className="text-sm font-semibold text-blue-200 mb-2">Load Sample Planet</p>
                <div className="space-y-2">
                  {samplePlanets.map(planet => (
                    <button
                      key={planet.name}
                      onClick={() => loadSamplePlanet(planet)}
                      className="w-full text-left px-3 py-2 rounded bg-blue-950/50 hover:bg-blue-800/50 text-blue-200 text-sm transition-colors"
                    >
                      {planet.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <Button
                  onClick={handlePredict}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2"
                >
                  {loading && <Loader2 className="inline mr-2 animate-spin" />}
                  Predict Habitability
                </Button>
                <Button
                  onClick={handleAddPlanet}
                  disabled={loading || !formData.name}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
                >
                  <Plus className="inline mr-2" size={18} />
                  Add & Save Planet
                </Button>
              </div>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              {prediction && (
                <>
                  <Card className={`border-2 p-6 ${getColorClass(prediction.color)}`}>
                    <h3 className="text-lg font-bold mb-2">Prediction Result</h3>
                    <p className="text-2xl font-bold mb-4">{prediction.habitability_score}%</p>
                    <p className="text-lg font-semibold mb-4">{prediction.classification}</p>
                    <div className="space-y-2">
                      <p className="text-sm">Habitable Probability: {(prediction.probabilities.habitable * 100).toFixed(1)}%</p>
                      <p className="text-sm">Not Habitable Probability: {(prediction.probabilities.not_habitable * 100).toFixed(1)}%</p>
                    </div>
                  </Card>

                  {/* Result Summary */}
                  <Card className="bg-blue-900/20 border-blue-700 p-4">
                    <h4 className="font-semibold text-blue-200 mb-3">Parameters Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-blue-200">
                      <p>Radius: {formData.pl_rade} R⊕</p>
                      <p>Mass: {formData.pl_bmasse} M⊕</p>
                      <p>Temp: {formData.pl_eqt} K</p>
                      <p>Orbital Period: {formData.pl_orbper} days</p>
                      <p>Stellar Type: {formData.st_teff}K</p>
                      <p>Distance: {formData.sy_dist} pc</p>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}

        {/* Ranking Tab */}
        {activeTab === 'ranking' && (
          <Card className="bg-blue-900/20 border-blue-700 overflow-hidden">
            <div className="p-6 border-b border-blue-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Ranked Exoplanets</h2>
              <Button
                onClick={fetchRankedPlanets}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </Button>
            </div>

            {rankedPlanets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-950/50 border-b border-blue-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-blue-200">#</th>
                      <th className="px-4 py-3 text-left text-blue-200">Planet</th>
                      <th className="px-4 py-3 text-left text-blue-200">Score</th>
                      <th className="px-4 py-3 text-left text-blue-200">Classification</th>
                      <th className="px-4 py-3 text-left text-blue-200">Radius (R⊕)</th>
                      <th className="px-4 py-3 text-left text-blue-200">Temp (K)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedPlanets.map((item, idx) => (
                      <tr key={item.planet.id} className="border-b border-blue-700/50 hover:bg-blue-950/30">
                        <td className="px-4 py-3 text-blue-200 font-semibold">{idx + 1}</td>
                        <td className="px-4 py-3 text-white font-medium">{item.planet.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded font-semibold text-sm ${getColorClass(item.prediction.color)}`}>
                            {item.prediction.habitability_score}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-blue-200">{item.prediction.classification}</td>
                        <td className="px-4 py-3 text-blue-200">{item.planet.pl_rade}</td>
                        <td className="px-4 py-3 text-blue-200">{item.planet.pl_eqt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-blue-300">
                {loading ? 'Loading rankings...' : 'No planets ranked yet'}
              </div>
            )}
          </Card>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="grid md:grid-cols-2 gap-6">
            {statistics && (
              <>
                <Card className="bg-blue-900/20 border-blue-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Overall Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-blue-700">
                      <span className="text-blue-200">Total Planets</span>
                      <span className="text-2xl font-bold text-white">{statistics.total_planets}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-blue-700">
                      <span className="text-blue-200">Total Predictions</span>
                      <span className="text-2xl font-bold text-white">{statistics.total_predictions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Average Habitability</span>
                      <span className="text-2xl font-bold text-cyan-400">{statistics.average_habitability}%</span>
                    </div>
                  </div>
                </Card>

                <Card className="bg-blue-900/20 border-blue-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Distribution</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-green-400 font-semibold mb-1">Highly Habitable</p>
                      <div className="w-full bg-blue-950 rounded h-2">
                        <div
                          className="bg-green-500 h-2 rounded"
                          style={{ width: `${Math.min((statistics.habitability_distribution.highly_habitable / statistics.total_predictions) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-blue-300 text-sm mt-1">{statistics.habitability_distribution.highly_habitable} planets</p>
                    </div>
                    <div>
                      <p className="text-yellow-400 font-semibold mb-1">Moderately Habitable</p>
                      <div className="w-full bg-blue-950 rounded h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded"
                          style={{ width: `${Math.min((statistics.habitability_distribution.moderately_habitable / statistics.total_predictions) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-blue-300 text-sm mt-1">{statistics.habitability_distribution.moderately_habitable} planets</p>
                    </div>
                    <div>
                      <p className="text-red-400 font-semibold mb-1">Low Habitability</p>
                      <div className="w-full bg-blue-950 rounded h-2">
                        <div
                          className="bg-red-500 h-2 rounded"
                          style={{ width: `${Math.min((statistics.habitability_distribution.low_habitability / statistics.total_predictions) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-blue-300 text-sm mt-1">{statistics.habitability_distribution.low_habitability} planets</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
