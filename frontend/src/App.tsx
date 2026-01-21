import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { PredictionSection } from './components/PredictionSection';
import { RankingSection } from './components/RankingSection';
import { BackgroundGrid } from './components/BackgroundGrid';
import { HomePage } from './components/HomePage';
import { useState, useEffect } from 'react';
import { healthCheck } from './services/api';

export default function App() {
  // State for active tab navigation
  const [activeTab, setActiveTab] = useState('home');
  
  // State to trigger rankings refresh when a new prediction is made
  const [rankingsRefreshTrigger, setRankingsRefreshTrigger] = useState(0);

  // Health check on app load
  useEffect(() => {
    const checkBackend = async () => {
      const isHealthy = await healthCheck();
      
      if (!isHealthy) {
        console.log('📊 Running in DEMO MODE - Backend not connected');
        console.log('💡 To connect backend: Start Flask server at http://127.0.0.1:5000');
        console.log('✨ App will work with mock data for demonstration purposes');
      } else {
        console.log('✅ Backend connection established');
      }
    };
    
    checkBackend();
  }, []);

  // Callback function to refresh rankings after prediction
  const handlePredictionComplete = () => {
    // Increment trigger to force rankings re-fetch
    setRankingsRefreshTrigger(prev => prev + 1);
    
    // Optionally switch to rankings tab after prediction
    // setActiveTab('rank');
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Animated background grid with mouse tracking */}
      <BackgroundGrid />
      
      {/* Content layer */}
      <div className="relative z-10">
        {/* Show header only when not on home page */}
        {activeTab !== 'home' && (
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
        )}
        
        {/* Home Page */}
        {activeTab === 'home' && (
          <HomePage onNavigate={setActiveTab} />
        )}

        {/* Main content for other tabs */}
        {activeTab !== 'home' && (
          <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
            {/* Dashboard Tab - Shows stats and both sections */}
            {activeTab === 'dashboard' && (
              <>
                <StatsOverview />
                <PredictionSection onPredictionComplete={handlePredictionComplete} />
                <RankingSection refreshTrigger={rankingsRefreshTrigger} />
              </>
            )}

            {/* Predict Tab - Shows only prediction section */}
            {activeTab === 'predict' && (
              <>
                <div className="mb-6">
                  <h2 className="font-['Pixelify_Sans'] text-3xl text-white mb-2">
                    Habitability Prediction
                  </h2>
                  <p className="font-['Space_Mono'] text-sm text-neutral-400">
                    Enter exoplanet parameters to predict habitability score
                  </p>
                </div>
                <PredictionSection onPredictionComplete={handlePredictionComplete} />
              </>
            )}

            {/* Rank Tab - Shows only rankings table */}
            {activeTab === 'rank' && (
              <>
                <div className="mb-6">
                  <h2 className="font-['Pixelify_Sans'] text-3xl text-white mb-2">
                    Planet Rankings
                  </h2>
                  <p className="font-['Space_Mono'] text-sm text-neutral-400">
                    Top habitable exoplanets ranked by prediction score
                  </p>
                </div>
                <RankingSection refreshTrigger={rankingsRefreshTrigger} />
              </>
            )}
          </main>
        )}
      </div>
    </div>
  );
}