import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-4">ExoHabitAI</h3>
            <p className="text-foreground/70 text-sm">
              Machine learning for discovering habitable exoplanets using advanced prediction models.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/model" className="text-foreground/70 hover:text-accent">
                  Model Overview
                </Link>
              </li>
              <li>
                <Link href="/usage" className="text-foreground/70 hover:text-accent">
                  Usage Guide
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-foreground/70 hover:text-accent">
                  Interactive Demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-foreground/70 hover:text-accent">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-accent">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <p className="text-foreground/50 text-sm text-center">Copyright 2026 ExoHabitAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
