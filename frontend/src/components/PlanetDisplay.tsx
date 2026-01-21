import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface PlanetDisplayProps {
  result: PredictionResult;
  formData: {
    mass: string;
    radius: string;
    orbitalPeriod: string;
    stellarTemperature: string;
    distance: string;
  };
}

export function PlanetDisplay({ result, formData }: PlanetDisplayProps) {
  // Generate planet characteristics based on prediction
  const planetType = result.score > 0.7 ? 'Terrestrial' : result.score > 0.4 ? 'Super-Earth' : 'Gas Giant';
  const surfaceTemp = formData.stellarTemperature 
    ? `${Math.round(parseFloat(formData.stellarTemperature) * 0.3)} K` 
    : 'Unknown';
  
  const features = [
    { label: 'Type', value: planetType },
    { label: 'Mass', value: formData.mass ? `${formData.mass} M⊕` : 'Unknown' },
    { label: 'Radius', value: formData.radius ? `${formData.radius} R⊕` : 'Unknown' },
    { label: 'Orbital Period', value: formData.orbitalPeriod ? `${formData.orbitalPeriod} days` : 'Unknown' },
    { label: 'Est. Surface Temp', value: surfaceTemp },
    { label: 'Distance', value: formData.distance ? `${formData.distance} pc` : 'Unknown' }
  ];

  // Calculate planet size based on radius for visualization
  const planetSize = formData.radius ? parseFloat(formData.radius) : 1;
  const scaledSize = Math.min(Math.max(planetSize * 100, 80), 200);

  // Earth parameters for comparison
  const earthData = {
    mass: 1.0,
    radius: 1.0,
    orbitalPeriod: 365,
    surfaceTemp: 288,
    type: 'Terrestrial'
  };

  // Calculate comparison percentages
  const massComparison = formData.mass ? ((parseFloat(formData.mass) / earthData.mass) * 100).toFixed(0) : '100';
  const radiusComparison = formData.radius ? ((parseFloat(formData.radius) / earthData.radius) * 100).toFixed(0) : '100';

  return (
    <div className="border border-orange-600/30 p-8 backdrop-blur-md bg-black/40 shadow-lg"
      style={{
        boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
      }}
    >
      <div className="mb-6">
        <h3 className="font-['Pixelify_Sans'] text-xl text-white mb-1">
          Comparative Analysis
        </h3>
        <p className="font-['Space_Mono'] text-xs text-neutral-400">
          {result.planetName} vs Earth Reference
        </p>
      </div>

      {/* Dual Planet Blueprint Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Earth Blueprint */}
        <div className="relative aspect-square bg-black border border-orange-600 flex items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid-earth" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ea580c" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-earth)" />
          </svg>

          {/* Crosshair */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ea580c" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ea580c" strokeWidth="1" opacity="0.3" />
          </svg>

          {/* Orbital Rings */}
          <svg className="absolute inset-0 w-full h-full">
            <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.3" strokeDasharray="6 6" />
          </svg>

          {/* Earth Planet */}
          <div className="relative z-10 flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#ea580c" strokeWidth="2" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#ea580c" strokeWidth="1" opacity="0.6" />
              <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.5" />
              <ellipse cx="100" cy="100" rx="90" ry="60" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.5" />
              <ellipse cx="100" cy="100" rx="30" ry="90" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.5" />
              <ellipse cx="100" cy="100" rx="60" ry="90" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.5" />
              <circle cx="100" cy="100" r="3" fill="#ea580c" />
            </svg>
          </div>

          {/* Corner Markers */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-orange-600"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-orange-600"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-orange-600"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-orange-600"></div>

          {/* Label */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-orange-600">
            <span className="font-['Space_Mono'] text-[10px] text-white tracking-widest">
              EARTH
            </span>
          </div>
        </div>

        {/* Predicted Planet Blueprint */}
        <div className="relative aspect-square bg-black border border-orange-600 flex items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid-planet" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ea580c" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-planet)" />
          </svg>

          {/* Crosshair */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ea580c" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ea580c" strokeWidth="1" opacity="0.3" />
          </svg>

          {/* Orbital Rings */}
          <svg className="absolute inset-0 w-full h-full">
            <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.3" strokeDasharray="6 6" />
          </svg>

          {/* Predicted Planet (size scaled based on radius) */}
          <div className="relative z-10 flex items-center justify-center">
            <svg width={scaledSize * 0.5} height={scaledSize * 0.5} viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#ea580c" strokeWidth="2" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#ea580c" strokeWidth="1" opacity="0.6" />
              <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.5" />
              <ellipse cx="100" cy="100" rx="90" ry="60" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.5" />
              <ellipse cx="100" cy="100" rx="30" ry="90" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.5" />
              <ellipse cx="100" cy="100" rx="60" ry="90" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.5" />
              <circle cx="100" cy="100" r="3" fill="#ea580c" />
            </svg>
          </div>

          {/* Corner Markers */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-orange-600"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-orange-600"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-orange-600"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-orange-600"></div>

          {/* Label */}
          <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 ${
            result.habitable ? 'bg-orange-600' : 'bg-neutral-700'
          }`}>
            <span className="font-['Space_Mono'] text-[10px] text-white tracking-widest">
              {result.planetName.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-black border border-neutral-800 p-3 text-center">
          <p className="font-['Space_Mono'] text-[10px] text-neutral-400 mb-1">MASS RATIO</p>
          <p className="font-['Space_Mono'] text-lg text-orange-500">{massComparison}%</p>
        </div>
        <div className="bg-black border border-neutral-800 p-3 text-center">
          <p className="font-['Space_Mono'] text-[10px] text-neutral-400 mb-1">RADIUS RATIO</p>
          <p className="font-['Space_Mono'] text-lg text-orange-500">{radiusComparison}%</p>
        </div>
        <div className="bg-black border border-neutral-800 p-3 text-center">
          <p className="font-['Space_Mono'] text-[10px] text-neutral-400 mb-1">HABITABILITY</p>
          <p className="font-['Space_Mono'] text-lg text-orange-500">{(result.score * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Planet Features */}
      <div className="space-y-3">
        <h4 className="font-['Space_Mono'] text-xs text-neutral-400 tracking-wide mb-4">
          COMPARATIVE PARAMETERS
        </h4>
        <div className="grid grid-cols-3 gap-4 pb-3 border-b border-neutral-800 font-['Space_Mono'] text-[10px] text-neutral-500">
          <div>PARAMETER</div>
          <div className="text-center">EARTH</div>
          <div className="text-center">{result.planetName.toUpperCase()}</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 py-2 border-b border-neutral-800">
          <span className="font-['Space_Mono'] text-xs text-neutral-400">Type</span>
          <span className="font-['Space_Mono'] text-xs text-white text-center">Terrestrial</span>
          <span className="font-['Space_Mono'] text-xs text-orange-500 text-center">{planetType}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2 border-b border-neutral-800">
          <span className="font-['Space_Mono'] text-xs text-neutral-400">Mass</span>
          <span className="font-['Space_Mono'] text-xs text-white text-center">1.0 M⊕</span>
          <span className="font-['Space_Mono'] text-xs text-orange-500 text-center">{formData.mass || '1.0'} M⊕</span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2 border-b border-neutral-800">
          <span className="font-['Space_Mono'] text-xs text-neutral-400">Radius</span>
          <span className="font-['Space_Mono'] text-xs text-white text-center">1.0 R⊕</span>
          <span className="font-['Space_Mono'] text-xs text-orange-500 text-center">{formData.radius || '1.0'} R⊕</span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2 border-b border-neutral-800">
          <span className="font-['Space_Mono'] text-xs text-neutral-400">Orbital Period</span>
          <span className="font-['Space_Mono'] text-xs text-white text-center">365 days</span>
          <span className="font-['Space_Mono'] text-xs text-orange-500 text-center">{formData.orbitalPeriod || '365'} days</span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2 border-b border-neutral-800">
          <span className="font-['Space_Mono'] text-xs text-neutral-400">Surface Temp</span>
          <span className="font-['Space_Mono'] text-xs text-white text-center">288 K</span>
          <span className="font-['Space_Mono'] text-xs text-orange-500 text-center">{surfaceTemp}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2">
          <span className="font-['Space_Mono'] text-xs text-neutral-400">Distance</span>
          <span className="font-['Space_Mono'] text-xs text-white text-center">0 pc</span>
          <span className="font-['Space_Mono'] text-xs text-orange-500 text-center">{formData.distance || '0'} pc</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-orange-600">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-['Space_Mono'] text-xs text-neutral-400">
              Habitability Index
            </span>
            <span className="font-['Space_Mono'] text-sm text-orange-500">
              {(result.score * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-['Space_Mono'] text-xs text-neutral-400">
              Confidence Level
            </span>
            <span className="font-['Space_Mono'] text-sm text-white">
              {(result.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}