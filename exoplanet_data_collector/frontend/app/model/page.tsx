import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function ModelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">ML Model Architecture</h1>
          <p className="text-xl text-blue-200">Random Forest Classifier for Exoplanet Habitability Prediction</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-blue-900/20 border-blue-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Model Details</h2>
            <div className="space-y-4 text-blue-200">
              <div className="border-b border-blue-700 pb-3">
                <p className="font-semibold text-white">Algorithm</p>
                <p>Random Forest Classifier</p>
              </div>
              <div className="border-b border-blue-700 pb-3">
                <p className="font-semibold text-white">Estimators</p>
                <p>100 decision trees</p>
              </div>
              <div className="border-b border-blue-700 pb-3">
                <p className="font-semibold text-white">Max Depth</p>
                <p>10 levels per tree</p>
              </div>
              <div>
                <p className="font-semibold text-white">Input Features</p>
                <p>10 planetary and stellar parameters</p>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-900/20 border-blue-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              {[
                { metric: 'Overall Accuracy', value: '89%' },
                { metric: 'Precision (Habitable)', value: '0.87' },
                { metric: 'Recall (Habitable)', value: '0.91' },
                { metric: 'F1-Score', value: '0.89' }
              ].map((item) => (
                <div key={item.metric} className="flex justify-between items-center pb-3 border-b border-blue-700 last:border-0">
                  <span className="text-blue-200">{item.metric}</span>
                  <span className="font-bold text-cyan-400">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="bg-blue-900/20 border-blue-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Input Features (10 Parameters)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: 'Planet Radius', unit: 'Earth radii (R⊕)', range: '0.1 - 10' },
              { label: 'Planet Mass', unit: 'Earth masses (M⊕)', range: '0.1 - 100' },
              { label: 'Orbital Period', unit: 'days', range: '1 - 10,000' },
              { label: 'Semi-major Axis', unit: 'Astronomical Units (AU)', range: '0.01 - 100' },
              { label: 'Equilibrium Temperature', unit: 'Kelvin (K)', range: '100 - 3,000' },
              { label: 'Planet Density', unit: 'g/cm³', range: '0.1 - 100' },
              { label: 'Stellar Temperature', unit: 'Kelvin (K)', range: '2,000 - 10,000' },
              { label: 'Stellar Radius', unit: 'Solar radii (R☉)', range: '0.1 - 10' },
              { label: 'Stellar Mass', unit: 'Solar masses (M☉)', range: '0.1 - 10' },
              { label: 'System Distance', unit: 'parsecs (pc)', range: '0.1 - 1,000' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-blue-950/30 rounded-lg p-4 border border-blue-700">
                <p className="font-semibold text-white">{feature.label}</p>
                <p className="text-sm text-blue-300 mt-1">{feature.unit}</p>
                <p className="text-sm text-cyan-400 mt-2">Range: {feature.range}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-blue-900/20 border-blue-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Habitability Classification</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Highly Habitable',
                score: '70-100%',
                color: 'bg-green-500/20 border-green-500',
                desc: 'Strong life conditions. Favorable zone & properties.'
              },
              {
                name: 'Moderately Habitable',
                score: '50-69%',
                color: 'bg-yellow-500/20 border-yellow-500',
                desc: 'Marginal conditions. Some challenges present.'
              },
              {
                name: 'Low Habitability',
                score: '0-49%',
                color: 'bg-red-500/20 border-red-500',
                desc: 'Poor conditions. Extreme or unfavorable characteristics.'
              }
            ].map((c) => (
              <div key={c.name} className={`${c.color} border-2 rounded-lg p-6`}>
                <p className="font-bold text-lg mb-1 text-white">{c.name}</p>
                <p className="text-sm text-blue-200 mb-3">{c.score}</p>
                <p className="text-sm text-blue-200">{c.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-blue-900/20 border-blue-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Training Pipeline</h2>
          <div className="space-y-4">
            {[
              { step: 'Data Preprocessing', desc: 'Standardization using StandardScaler' },
              { step: 'Train-Test Split', desc: '80% training, 20% testing with stratification' },
              { step: 'Hyperparameter Tuning', desc: '100 estimators, max depth 10' },
              { step: 'Model Validation', desc: 'Cross-validation on unseen test data' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b border-blue-700 last:border-0">
                <Check className="text-cyan-400 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-white">{item.step}</p>
                  <p className="text-blue-200 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
