'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="bg-blue-950/50 border-b border-blue-700 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-white hover:text-cyan-400 transition-colors">
          <Sparkles size={24} className="text-cyan-400" />
          <span>ExoHabitAI</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/" className="text-blue-200 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/demo" className="text-blue-200 hover:text-white transition-colors">
            Predictor
          </Link>
          <Link href="/model" className="text-blue-200 hover:text-white transition-colors">
            Model
          </Link>
          <Link href="/usage" className="text-blue-200 hover:text-white transition-colors">
            Pipeline
          </Link>
          <Link href="/docs" className="text-blue-200 hover:text-white transition-colors">
            API Docs
          </Link>
        </div>
      </div>
    </nav>
  )
}
