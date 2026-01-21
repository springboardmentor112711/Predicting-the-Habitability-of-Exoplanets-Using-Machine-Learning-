import { motion } from 'motion/react';
import { Telescope, TrendingUp, Sparkles, ArrowRight, SpaceIcon, Satellite } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Black Hole Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1670884307315-eb843e5c3829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvbGUlMjBzcGFjZXxlbnwxfHx8fDE3NjgzODc3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Black hole in space"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Orange overlay for theme consistency */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/30 to-black" />
        
        {/* Radial gradient from center */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-orange-600/20 via-transparent to-black"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Animated Orbiting Planets */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Orbit rings */}
        <motion.div
          className="absolute w-[600px] h-[600px] border border-orange-600/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] border border-orange-600/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Small orbiting planets */}
        <motion.div
          className="absolute w-[600px] h-[600px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-orange-600 rounded-full shadow-lg shadow-orange-600/50" 
            style={{ marginLeft: '-8px' }} 
          />
        </motion.div>
        
        <motion.div
          className="absolute w-[800px] h-[800px]"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" 
            style={{ marginLeft: '-6px' }} 
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Logo/Badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-orange-600/40 bg-black/60 backdrop-blur-md">
           
            <Satellite className="w-6 h-6 text-orange-600" />
            <span className="font-['Space_Mono'] text-s text-orange-600 tracking-wider">
              Exo-Habitz.AI
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="font-['Pixelify_Sans'] text-7xl md:text-8xl text-white mb-4 leading-tight">
            Discover
            <br />
            <span className="text-orange-600 relative inline-block">
              Habitable Worlds
              <motion.div
                className="absolute -inset-4 bg-orange-600/20 blur-2xl -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-['Space_Mono'] text-lg text-neutral-400 max-w-2xl mb-12 leading-relaxed"
        >
          Advanced machine learning algorithms analyze exoplanet characteristics to predict 
          habitability potential across the cosmos. Explore distant worlds and their capacity 
          to support life.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 mb-16"
        >
          {/* Predict Button */}
          <motion.button
            onClick={() => onNavigate('predict')}
            className="group relative px-10 py-5 bg-orange-600 text-white font-['Space_Mono'] text-sm tracking-wider overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <div className="relative flex items-center gap-3">
              <Telescope className="w-5 h-5" />
              PREDICT HABITABILITY
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 border border-orange-400/50 group-hover:border-orange-300 transition-colors" />
          </motion.button>

          {/* Rank Button */}
          <motion.button
            onClick={() => onNavigate('rank')}
            className="group relative px-10 py-5 bg-black border border-orange-600/50 text-orange-600 font-['Space_Mono'] text-sm tracking-wider backdrop-blur-md overflow-hidden"
            whileHover={{ scale: 1.05, borderColor: 'rgba(234, 88, 12, 0.8)' }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-orange-600/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
            <div className="relative flex items-center gap-3">
              <TrendingUp className="w-5 h-5" />
              VIEW RANKINGS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        >
          {/* Feature 1 */}
          <motion.div
            className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40"
            style={{
              boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
            }}
            whileHover={{ 
              y: -5,
              boxShadow: '0 12px 40px 0 rgba(234, 88, 12, 0.25), inset 0 1px 0 0 rgba(234, 88, 12, 0.3)'
            }}
          >
            <div className="w-12 h-12 bg-orange-600/20 flex items-center justify-center mb-4">
              <Telescope className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-2">
              AI Predictions
            </h3>
            <p className="font-['Space_Mono'] text-xs text-neutral-400 leading-relaxed">
              Advanced neural networks analyze planetary parameters to determine habitability scores with high accuracy
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40"
            style={{
              boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
            }}
            whileHover={{ 
              y: -5,
              boxShadow: '0 12px 40px 0 rgba(234, 88, 12, 0.25), inset 0 1px 0 0 rgba(234, 88, 12, 0.3)'
            }}
          >
            <div className="w-12 h-12 bg-orange-600/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-2">
              Comprehensive Rankings
            </h3>
            <p className="font-['Space_Mono'] text-xs text-neutral-400 leading-relaxed">
              Compare exoplanets side-by-side with detailed metrics, environmental factors, and export capabilities
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40"
            style={{
              boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
            }}
            whileHover={{ 
              y: -5,
              boxShadow: '0 12px 40px 0 rgba(234, 88, 12, 0.25), inset 0 1px 0 0 rgba(234, 88, 12, 0.3)'
            }}
          >
            <div className="w-12 h-12 bg-orange-600/20 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-2">
              Real-Time Analysis
            </h3>
            <p className="font-['Space_Mono'] text-xs text-neutral-400 leading-relaxed">
              Instant habitability assessments with detailed factor breakdowns and confidence metrics
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex flex-wrap justify-center gap-12 font-['Space_Mono'] text-xs text-neutral-500"
        >
          <div className="text-center">
            <div className="text-2xl text-orange-600 font-['Pixelify_Sans'] mb-1">5,000+</div>
            <div>Exoplanets Catalogued</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-orange-600 font-['Pixelify_Sans'] mb-1">85.7%</div>
            <div>Model Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-orange-600 font-['Pixelify_Sans'] mb-1">12</div>
            <div>Environmental Factors</div>
          </div>

          <div className="text-2xl text-orange-600 font-['Pixelify_Sans'] mb-1"></div>
        </motion.div>

        {/* Copyright Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-3 pt-6 "
        >
          <p className="font-['Space_Mono'] text-s text-neutral-500">
            © {new Date().getFullYear()} Exo-Habitz.AI. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* Scanning Line Effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-30"
        animate={{
          y: ['0vh', '100vh'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}