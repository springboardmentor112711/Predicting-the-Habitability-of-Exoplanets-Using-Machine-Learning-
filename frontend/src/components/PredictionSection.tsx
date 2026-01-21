import { useState } from 'react';
import { Activity } from 'lucide-react';
import { PredictionVisualizations } from './PredictionVisualizations';
import { PlanetDisplay } from './PlanetDisplay';
import { predictHabitability, addPlanet, type PlanetInput } from '../services/api';

interface PredictionResult {
  habitable: boolean;
  score: number;
  confidence: number;
  planetName: string;
  factors: {
    temperature: number;
    atmosphere: number;
    gravity: number;
    radiation: number;
    water: number;
  };
}

interface PredictionSectionProps {
  showInDashboard?: boolean;
  onPredictionComplete?: () => void;
}

export function PredictionSection({ showInDashboard = false, onPredictionComplete }: PredictionSectionProps) {
  const [formData, setFormData] = useState({
    planetName: '',
    stellarTemperature: '',  // st_teff
    stellarRadius: '',       // st_rad
    stellarMass: '',         // st_mass
    stellarMetallicity: '',  // st_met
    stellarLuminosity: '',   // st_luminosity
    orbitalPeriod: '',       // pl_orbper
    orbitalEccentricity: '', // pl_orbeccen
    insolation: ''           // pl_insol
  });
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      const requiredFields = [
        'stellarTemperature', 'stellarRadius', 'stellarMass', 
        'stellarMetallicity', 'stellarLuminosity', 'orbitalPeriod', 
        'orbitalEccentricity', 'insolation'
      ];

      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Prepare API request data
      const planetInput: PlanetInput = {
        st_teff: parseFloat(formData.stellarTemperature),
        st_rad: parseFloat(formData.stellarRadius),
        st_mass: parseFloat(formData.stellarMass),
        st_met: parseFloat(formData.stellarMetallicity),
        st_luminosity: parseFloat(formData.stellarLuminosity),
        pl_orbper: parseFloat(formData.orbitalPeriod),
        pl_orbeccen: parseFloat(formData.orbitalEccentricity),
        pl_insol: parseFloat(formData.insolation)
      };

      // Call POST /predict API (will use mock data if backend unavailable)
      const predictionResponse = await predictHabitability(planetInput);

      if (predictionResponse.status === 'success') {
        // Generate mock factors (these would come from backend in production)
        const mockFactors = {
          temperature: Math.random() * 0.4 + 0.6,
          atmosphere: Math.random() * 0.4 + 0.5,
          gravity: Math.random() * 0.5 + 0.4,
          radiation: Math.random() * 0.3 + 0.6,
          water: Math.random() * 0.5 + 0.4
        };

        setResult({
          habitable: predictionResponse.data.habitability === 1,
          score: predictionResponse.data.habitability_score,
          confidence: predictionResponse.data.confidence,
          planetName: formData.planetName || 'Unknown Planet',
          factors: mockFactors
        });

        // If planet has a name, save it to database
        if (formData.planetName.trim()) {
          const addPlanetResponse = await addPlanet({
            planet_name: formData.planetName.trim(),
            ...planetInput
          });

          if (addPlanetResponse.status === 'success') {
            // Trigger rankings refresh
            onPredictionComplete?.();
          }
        }
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Prediction failed. Using demo mode with mock data.');
      
      // Fallback to local prediction even if API fails
      const score = Math.random() * 0.6 + 0.3;
      const confidence = Math.random() * 0.3 + 0.7;
      
      setResult({
        habitable: score > 0.5,
        score: parseFloat(score.toFixed(3)),
      
        confidence: parseFloat(confidence.toFixed(3)),
        planetName: formData.planetName || 'Unknown Planet',
        factors: {
          temperature: Math.random() * 0.4 + 0.6,
          atmosphere: Math.random() * 0.4 + 0.5,
          gravity: Math.random() * 0.5 + 0.4,
          radiation: Math.random() * 0.3 + 0.6,
          water: Math.random() * 0.5 + 0.4
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Column 1 (Left): Prediction Form + Planetary Comparison */}
      <div className="space-y-8">
        {/* Prediction Form */}
        <div className="border border-orange-600/30 p-8 backdrop-blur-md bg-black/40 shadow-lg"
          style={{
            boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
          }}
        >
          <h2 className="font-['Pixelify_Sans'] text-2xl text-white mb-6">
            Enter Planet Parameters
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  PLANET NAME
                </label>
                <input
                  type="text"
                  name="planetName"
                  value={formData.planetName}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="e.g., Kepler-442b"
                />
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  STELLAR TEMP (K)
                </label>
                <input
                  type="number"
                  name="stellarTemperature"
                  value={formData.stellarTemperature}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="5778"
                  step="100"
                />
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  STELLAR RADIUS (Solar radii)
                </label>
                <input
                  type="number"
                  name="stellarRadius"
                  value={formData.stellarRadius}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="1.0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  STELLAR MASS (Solar masses)
                </label>
                <input
                  type="number"
                  name="stellarMass"
                  value={formData.stellarMass}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="1.0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  STELLAR METALLICITY (Fe/H)
                </label>
                <input
                  type="number"
                  name="stellarMetallicity"
                  value={formData.stellarMetallicity}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="0.0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  STELLAR LUMINOSITY (Solar luminosities)
                </label>
                <input
                  type="number"
                  name="stellarLuminosity"
                  value={formData.stellarLuminosity}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="1.0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  ORBITAL PERIOD (days)
                </label>
                <input
                  type="number"
                  name="orbitalPeriod"
                  value={formData.orbitalPeriod}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="365"
                  step="1"
                />
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  ORBITAL ECCENTRICITY (0-1)
                </label>
                <input
                  type="number"
                  name="orbitalEccentricity"
                  value={formData.orbitalEccentricity}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="0.0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block font-['Space_Mono'] text-xs text-neutral-400 mb-2 tracking-wide">
                  INSOLATION (Earth insolation units)
                </label>
                <input
                  type="number"
                  name="insolation"
                  value={formData.insolation}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-neutral-700 px-4 py-3 text-white font-['Space_Mono'] text-sm focus:outline-none focus:border-orange-500"
                  placeholder="1.0"
                  step="0.1"
                />
              </div>
            </div>

            <button
              onClick={handlePredict}
              className="w-full bg-orange-600 text-white py-4 font-['Space_Mono'] text-sm tracking-widest hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'PREDICTING...' : 'PREDICT HABITABILITY'}
            </button>

            {error && (
              <div className="p-4 border border-orange-600/50 bg-orange-950/20">
                <p className="font-['Space_Mono'] text-xs text-orange-400">
                  {error}
                </p>
              </div>
            )}

            {result && (
              <div className="mt-8 pt-8 border-t border-orange-600">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-['Space_Mono'] text-xs text-neutral-400 tracking-wide">
                      HABITABILITY
                    </span>
                    <span className={`font-['Pixelify_Sans'] text-2xl ${
                      result.habitable ? 'text-orange-500' : 'text-neutral-500'
                    }`}>
                      {result.habitable ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-['Space_Mono'] text-xs text-neutral-400 tracking-wide">
                      SCORE
                    </span>
                    <span className="font-['Space_Mono'] text-xl text-white">
                      {result.score.toFixed(3)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-['Space_Mono'] text-xs text-neutral-400 tracking-wide">
                      CONFIDENCE
                    </span>
                    <span className="font-['Space_Mono'] text-xl text-white">
                      {result.confidence.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Planetary Comparison - Below Form in Column 1 */}
        {result && <PredictionVisualizations result={result} formData={formData} showComparisonOnly={true} />}

        {/* Habitability Factors (left column placement) */}
        {result && <PredictionVisualizations result={result} formData={formData} showFactorsOnly={true} />}

        {/* Feature vs Habitability Heatmap (moved to left column) */}
        {result && <PredictionVisualizations result={result} formData={formData} showHeatmapOnly={true} />}
      </div>

      {/* Column 2 (Right): Planet Display and Charts */}
      {!showInDashboard && (
        <div className="space-y-8">
          {result ? (
            <>
              <PlanetDisplay result={result} formData={formData} />
              <PredictionVisualizations result={result} formData={formData} showChartsOnly={true} />
            </>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 p-8 flex items-center justify-center min-h-[400px]">
              <p className="font-['Space Mono'] text-sm text-neutral-500  leading-relaxed">
                ⭐ <b>st_teff</b> — Stellar Effective Temperature (K)<br />
                Ideal: 4800 – 6200 K | Stable, Sun-like radiation<br />
                Risk: Low → frozen | High → radiation instability<br /><br />

                ⭐ <b>st_rad</b> — Stellar Radius (R☉)<br />
                Ideal: 0.8 – 1.2 R☉ | Stable star size<br />
                Risk: Large → giant | Small → red dwarf<br /><br />

                ⭐ <b>st_mass</b> — Stellar Mass (M☉)<br />
                Ideal: 0.8 – 1.2 M☉ | Long stellar life<br />
                Risk: High → short-lived | Low → low energy<br /><br />

                ⭐ <b>st_met</b> — Metallicity ([Fe/H])<br />
                Ideal: −0.1 – +0.3 | Rocky planet support<br />
                Risk: Low → poor formation | High → instability<br /><br />

                ⭐ <b>st_luminosity</b> — Luminosity (L☉)<br />
                Ideal: 0.7 – 1.5 L☉ | Habitable zone balance<br />
                Risk: High → overheating | Low → frozen<br /><br />

                🪐 <b>pl_orbper</b> — Orbital Period (days)<br />
                Ideal: 250 – 450 | Earth-like orbit<br />
                Risk: Short → hot | Long → cold<br /><br />

                🪐 <b>pl_orbeccen</b> — Orbital Eccentricity<br />
                Ideal: 0.0 – 0.1 | Stable climate<br />
                Risk: High → extreme seasons<br /><br />

                🌞 <b>pl_insol</b> — Insolation Flux (S⊕)<br />
                Ideal: 0.8 – 1.2 | Balanced energy<br />
                Risk: High → greenhouse | Low → ice-covered
              </p>
            </div>

          )}
        </div>
      )}

      {/* Planet Display in Dashboard (shows below form) */}
      {showInDashboard && result && (
        <div className="xl:col-span-1">
          <PlanetDisplay result={result} formData={formData} />
        </div>
      )}
    </div>
  );
}