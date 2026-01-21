import Link from 'next/link'
import { Github, Sparkles } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-blue-950/30 border-t border-blue-700 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-white mb-4">
              <Sparkles size={20} className="text-cyan-400" />
              <span>ExoHabitAI</span>
            </div>
            <p className="text-blue-300 text-sm">ML-powered exoplanet habitability prediction</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              <li><Link href="/" className="hover:text-cyan-400">Home</Link></li>
              <li><Link href="/demo" className="hover:text-cyan-400">Predictor</Link></li>
              <li><Link href="/model" className="hover:text-cyan-400">Model</Link></li>
              <li><Link href="/usage" className="hover:text-cyan-400">Pipeline</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              <li><Link href="/docs" className="hover:text-cyan-400">API Docs</Link></li>
              <li><a href="http://localhost:5000" className="hover:text-cyan-400">Backend API</a></li>
              <li><a href="https://exoplanetarchive.ipac.caltech.edu/" className="hover:text-cyan-400">NASA Archive</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Tech Stack</h3>
            <ul className="space-y-1 text-sm text-blue-300">
              <li>Next.js 16</li>
              <li>Flask</li>
              <li>Random Forest</li>
              <li>PostgreSQL</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 pt-8 flex justify-between items-center text-sm text-blue-300">
          <p>&copy; {currentYear} ExoHabitAI. All rights reserved.</p>
          <a href="https://github.com" className="hover:text-cyan-400 flex items-center gap-2">
            <Github size={18} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
