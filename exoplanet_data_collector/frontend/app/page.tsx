import { ArrowRight, Brain, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Discover Habitable <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Exoplanets</span>
              </h1>
              <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                Advanced machine learning model predicting exoplanet habitability based on physical, orbital, and stellar characteristics. Explore the universe one planet at a time.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/demo">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-6 px-8 text-lg">
                    Try Predictor <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button className="bg-blue-900/50 hover:bg-blue-800/50 text-blue-200 border border-blue-700 font-semibold py-6 px-8 text-lg">
                    View API Docs
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-8 border border-blue-500/30 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Planets', value: '5,000+' },
                    { label: 'Accuracy', value: '89%' },
                    { label: 'Features', value: '10' },
                    { label: 'Model', value: 'RF' }
                  ].map((stat) => (
                    <div key={stat.label} className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
                      <p className="text-blue-300 text-sm font-semibold">{stat.label}</p>
                      <p className="text-white text-2xl font-bold mt-2">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-blue-950/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Advanced ML Model',
                description: 'Random Forest Classifier trained on thousands of exoplanet datasets for accurate predictions'
              },
              {
                icon: Zap,
                title: 'Real-time Predictions',
                description: 'Get instant habitability scores based on planetary and stellar parameters'
              },
              {
                icon: Globe,
                title: 'Comprehensive Database',
                description: 'Browse, rank, and analyze exoplanets with detailed habitability metrics'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="bg-blue-900/20 border border-blue-700 rounded-lg p-8 hover:bg-blue-900/30 transition-colors">
                  <Icon className="text-cyan-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-200">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">How It Works</h2>
          
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Enter Parameters',
                description: 'Input exoplanet and stellar characteristics including radius, mass, temperature, and orbital data'
              },
              {
                step: '2',
                title: 'ML Processing',
                description: 'Our trained Random Forest model analyzes the parameters against known habitable zone criteria'
              },
              {
                step: '3',
                title: 'Get Results',
                description: 'Receive habitability score, classification, and probability metrics in seconds'
              },
              {
                step: '4',
                title: 'Save & Compare',
                description: 'Store planets in database and rank them by habitability for discovery and analysis'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-blue-200">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ML Pipeline Section */}
      <section className="py-20 bg-blue-950/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">ML Pipeline</h2>
          <p className="text-center text-blue-200 mb-12 max-w-2xl mx-auto">
            Our comprehensive 4-module pipeline processes exoplanet data from collection through model deployment
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Data Collection', desc: 'Gather from NASA Exoplanet Archive' },
              { title: 'Data Cleaning', desc: 'Remove outliers & standardize features' },
              { title: 'Feature Engineering', desc: 'Create habitability score & features' },
              { title: 'Model Training', desc: 'Train & evaluate classifiers' }
            ].map((module, idx) => (
              <div key={idx} className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
                <div className="text-cyan-400 font-bold text-lg mb-2">Module {idx + 1}</div>
                <h4 className="text-white font-semibold mb-2">{module.title}</h4>
                <p className="text-blue-300 text-sm">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Explore?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Start predicting exoplanet habitability today with our advanced machine learning model
          </p>
          <Link href="/demo">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-6 px-12 text-lg">
              Launch Predictor <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
