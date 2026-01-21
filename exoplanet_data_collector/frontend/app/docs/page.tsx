'use client'

import { Card } from '@/components/ui/card'
import { Code2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const endpoints = [
  {
    method: 'GET',
    path: '/api/health',
    title: 'Health Check',
    description: 'Verify backend server is running',
    response: `{"status": "healthy", "model_loaded": true}`
  },
  {
    method: 'POST',
    path: '/api/predict',
    title: 'Make Prediction',
    description: 'Predict habitability for planetary parameters',
    request: `{
  "pl_rade": 1.0,
  "pl_bmasse": 1.0,
  "pl_orbper": 365,
  "pl_orbsmax": 1.0,
  "pl_eqt": 288,
  "st_teff": 5778,
  "st_rad": 1.0,
  "st_mass": 1.0,
  "sy_dist": 10.0,
  "pl_dens": 1.0
}`,
    response: `{
  "success": true,
  "habitability_score": 75,
  "classification": "Highly Habitable",
  "color": "green",
  "probabilities": {
    "habitable": 0.75
  }
}`
  },
  {
    method: 'POST',
    path: '/api/add_planet',
    title: 'Add New Planet',
    description: 'Add exoplanet to database',
    request: `{
  "name": "Kepler-452b",
  "pl_rade": 1.6,
  "pl_bmasse": 5.0,
  "pl_orbper": 384.8,
  "pl_orbsmax": 1.046,
  "pl_eqt": 265,
  "st_teff": 5757,
  "st_rad": 1.11,
  "st_mass": 1.04,
  "sy_dist": 141.0,
  "pl_dens": 1.19,
  "discovery_year": 2015
}`,
    response: `{
  "success": true,
  "planet": {...},
  "prediction": {...}
}`
  },
  {
    method: 'GET',
    path: '/api/exoplanets',
    title: 'Get Exoplanets',
    description: 'Retrieve all exoplanets from database',
    response: `{
  "success": true,
  "exoplanets": [...]
}`
  },
  {
    method: 'GET',
    path: '/api/rank',
    title: 'Rank Planets',
    description: 'Get planets ranked by habitability score',
    response: `{
  "success": true,
  "total": 3,
  "planets": [...]
}`
  },
  {
    method: 'GET',
    path: '/api/planet/:id',
    title: 'Get Planet',
    description: 'Retrieve specific planet details',
    response: `{
  "success": true,
  "planet": {...},
  "prediction": {...}
}`
  },
  {
    method: 'PUT',
    path: '/api/planet/:id',
    title: 'Update Planet',
    description: 'Modify planet data',
    request: `{
  "pl_rade": 1.2,
  "pl_eqt": 300
}`,
    response: `{
  "success": true,
  "planet": {...}
}`
  },
  {
    method: 'DELETE',
    path: '/api/planet/:id',
    title: 'Delete Planet',
    description: 'Remove planet from database',
    response: `{
  "success": true,
  "message": "Planet deleted"
}`
  },
  {
    method: 'GET',
    path: '/api/statistics',
    title: 'Get Statistics',
    description: 'Retrieve habitability statistics',
    response: `{
  "success": true,
  "total_planets": 3,
  "average_habitability": 76.4,
  "habitability_distribution": {...}
}`
  },
  {
    method: 'GET',
    path: '/api/search?q=kepler',
    title: 'Search Planets',
    description: 'Search planets by name',
    response: `{
  "success": true,
  "query": "kepler",
  "results": [...],
  "count": 1
}`
  },
  {
    method: 'GET',
    path: '/api/filter?classification=Highly%20Habitable',
    title: 'Filter Planets',
    description: 'Filter by classification and score',
    response: `{
  "success": true,
  "results": [...],
  "count": 2
}`
  },
  {
    method: 'GET',
    path: '/api/model-info',
    title: 'Model Info',
    description: 'Get ML model details',
    response: `{
  "success": true,
  "model_type": "Random Forest",
  "features": [...],
  "version": "1.0"
}`
  }
]

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-blue-500/20 text-blue-300 border-blue-500',
      POST: 'bg-green-500/20 text-green-300 border-green-500',
      PUT: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
      DELETE: 'bg-red-500/20 text-red-300 border-red-500'
    }
    return colors[method] || 'bg-gray-500/20'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">API Reference</h1>
          <p className="text-xl text-blue-200">Complete REST API documentation</p>
        </div>

        <Card className="bg-blue-900/20 border-blue-700 p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Base URL</h2>
          <div className="bg-blue-950/50 rounded p-4 border border-blue-700 flex justify-between items-center">
            <code className="text-cyan-400">http://localhost:5000</code>
            <button
              onClick={() => copyToClipboard('http://localhost:5000', 'baseurl')}
              className="p-2 hover:bg-blue-900 rounded"
            >
              {copied === 'baseurl' ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-blue-300" />}
            </button>
          </div>
        </Card>

        <div className="space-y-6">
          {endpoints.map((endpoint, idx) => (
            <Card key={idx} className="bg-blue-900/20 border-blue-700 p-8">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded font-bold text-sm border ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-cyan-400 font-mono">{endpoint.path}</code>
                </div>
                <h2 className="text-xl font-bold text-white">{endpoint.title}</h2>
                <p className="text-blue-200 text-sm mt-1">{endpoint.description}</p>
              </div>

              <div className={`grid ${endpoint.request ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
                {endpoint.request && (
                  <div>
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Code2 size={18} className="text-cyan-400" />
                      Request
                    </h3>
                    <div className="relative">
                      <pre className="bg-blue-950/50 rounded p-4 text-xs text-blue-100 overflow-x-auto border border-blue-700">
                        <code>{endpoint.request}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(endpoint.request || '', `req-${idx}`)}
                        className="absolute top-2 right-2 p-2 hover:bg-blue-900 rounded"
                      >
                        {copied === `req-${idx}` ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-blue-300" />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Code2 size={18} className="text-cyan-400" />
                    Response
                  </h3>
                  <div className="relative">
                    <pre className="bg-blue-950/50 rounded p-4 text-xs text-blue-100 overflow-x-auto border border-blue-700">
                      <code>{endpoint.response}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(endpoint.response, `res-${idx}`)}
                      className="absolute top-2 right-2 p-2 hover:bg-blue-900 rounded"
                    >
                      {copied === `res-${idx}` ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-blue-300" />}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-900/20 border-blue-700 p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Error Handling</h2>
          <div className="space-y-3">
            {[
              { code: 400, message: 'Bad Request', desc: 'Missing or invalid parameters' },
              { code: 404, message: 'Not Found', desc: 'Resource does not exist' },
              { code: 500, message: 'Server Error', desc: 'Internal server error' }
            ].map((error) => (
              <div key={error.code} className="bg-blue-950/30 rounded p-4 border border-blue-700">
                <p className="font-semibold text-white">{error.code} {error.message}</p>
                <p className="text-blue-200 text-sm">{error.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
