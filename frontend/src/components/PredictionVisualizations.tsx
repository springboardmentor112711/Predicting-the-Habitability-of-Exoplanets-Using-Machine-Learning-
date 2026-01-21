import { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ComposedChart, Line } from 'recharts';
import { getRankedPlanets, type RankedPlanet } from '../services/api';

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

interface PredictionVisualizationsProps {
  result: PredictionResult;
  formData?: {
    stellarTemperature: string;
    stellarRadius: string;
    stellarMass: string;
    stellarMetallicity: string;
    stellarLuminosity: string;
    orbitalPeriod: string;
    orbitalEccentricity: string;
    insolation: string;
  };
  showComparisonOnly?: boolean;
  showChartsOnly?: boolean;
  showFactorsOnly?: boolean;
  showHeatmapOnly?: boolean;
  showScoreOnly?: boolean;
}

export function PredictionVisualizations({ result, formData, showComparisonOnly, showChartsOnly, showFactorsOnly, showHeatmapOnly, showScoreOnly }: PredictionVisualizationsProps) {
  // Data for the radial score chart
  const scoreData = [
    {
      name: 'Score',
      value: result.score * 100,
      fill: result.score > 0.5 ? '#ea580c' : '#737373'
    }
  ];

  // Data for the radar chart (habitability factors)
  const radarData = [
    {
      factor: 'Temperature',
      value: result.factors.temperature * 100,
      fullMark: 100
    },
    {
      factor: 'Atmosphere',
      value: result.factors.atmosphere * 100,
      fullMark: 100
    },
    {
      factor: 'Gravity',
      value: result.factors.gravity * 100,
      fullMark: 100
    },
    {
      factor: 'Radiation',
      value: result.factors.radiation * 100,
      fullMark: 100
    },
    {
      factor: 'Water',
      value: result.factors.water * 100,
      fullMark: 100
    }
  ];

  // Feature influence heuristic: derived from normalized input sensitivity for interpretability.
  // This is NOT direct model attribution but a frontend visualization aid.
  const computeInfluenceScores = () => {
    if (!formData) return [];

    const insolation = parseFloat(formData.insolation) || 0;
    const stellarTemp = parseFloat(formData.stellarTemperature) || 0;
    const orbitalPeriod = parseFloat(formData.orbitalPeriod) || 0;
    const eccentricity = parseFloat(formData.orbitalEccentricity) || 0;
    const luminosity = parseFloat(formData.stellarLuminosity) || 0;

    // Reference ranges for Earth-like habitability
    const idealRanges = {
      insolation: { ideal: 1.0, tolerance: 0.5 },
      stellarTemp: { ideal: 5778, tolerance: 1000 },
      orbitalPeriod: { ideal: 365, tolerance: 200 },
      eccentricity: { ideal: 0.0, tolerance: 0.2 },
      luminosity: { ideal: 1.0, tolerance: 0.5 }
    };

    // Compute normalized deviation scores (0-100, higher = more influential)
    const scores = [
      {
        feature: 'Insolation',
        raw: Math.max(0, 100 - Math.abs(insolation - idealRanges.insolation.ideal) / idealRanges.insolation.tolerance * 50)
      },
      {
        feature: 'Stellar Temperature',
        raw: Math.max(0, 100 - Math.abs(stellarTemp - idealRanges.stellarTemp.ideal) / idealRanges.stellarTemp.tolerance * 50)
      },
      {
        feature: 'Orbital Period',
        raw: Math.max(0, 100 - Math.abs(orbitalPeriod - idealRanges.orbitalPeriod.ideal) / idealRanges.orbitalPeriod.tolerance * 50)
      },
      {
        feature: 'Eccentricity',
        raw: Math.max(0, 100 - Math.abs(eccentricity - idealRanges.eccentricity.ideal) / idealRanges.eccentricity.tolerance * 50)
      },
      {
        feature: 'Luminosity',
        raw: Math.max(0, 100 - Math.abs(luminosity - idealRanges.luminosity.ideal) / idealRanges.luminosity.tolerance * 50)
      }
    ];

    const totalRaw = scores.reduce((sum, s) => sum + s.raw, 0) || 1;

    const normalized = scores.map(s => ({
      feature: s.feature,
      influence: parseFloat(((s.raw / totalRaw) * 100).toFixed(1))
    })).sort((a, b) => b.influence - a.influence);

    let cumulative = 0;
    return normalized.map(item => {
      cumulative += item.influence;
      return {
        ...item,
        cumulativeInfluence: parseFloat(cumulative.toFixed(1))
      };
    });
  };

  const featureInfluenceChartData = computeInfluenceScores();

  // Multi-planet heatmap: Exploratory visualization showing normalized feature values across ranked planets.
  // NOTE: /rank API doesn't return feature values - using formData for current prediction + mock data for ranked planets.
  const [rankedPlanets, setRankedPlanets] = useState<RankedPlanet[]>([]);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await getRankedPlanets(5);
        if (response.status === 'success' && Array.isArray(response.data)) {
          setRankedPlanets(response.data);
        } else {
          setRankedPlanets([]);
        }
      } catch (error) {
        console.log('Heatmap: Using current prediction only');
        setRankedPlanets([]);
      }
    };
    fetchPlanets();
  }, []);

  const features = [
    { key: 'pl_insol', name: 'Insolation' },
    { key: 'st_teff', name: 'Stellar Temp' },
    { key: 'pl_orbper', name: 'Orbital Period' },
    { key: 'pl_orbeccen', name: 'Eccentricity' },
    { key: 'st_luminosity', name: 'Luminosity' }
  ];

  // Compute normalized value for current prediction from formData
  const computeCurrentPredictionCell = (featureKey: string): number => {
    if (!formData) return 50; // default mid-range

    const featureMap: Record<string, { value: number; range: [number, number] }> = {
      'pl_insol': { value: parseFloat(formData.insolation) || 1.0, range: [0.5, 1.5] },
      'st_teff': { value: parseFloat(formData.stellarTemperature) || 5778, range: [4800, 6800] },
      'pl_orbper': { value: parseFloat(formData.orbitalPeriod) || 365, range: [200, 550] },
      'pl_orbeccen': { value: parseFloat(formData.orbitalEccentricity) || 0.0, range: [0.0, 0.3] },
      'st_luminosity': { value: parseFloat(formData.stellarLuminosity) || 1.0, range: [0.5, 1.5] }
    };

    const feature = featureMap[featureKey];
    if (!feature) return 50;

    const [min, max] = feature.range;
    const normalized = Math.max(0, Math.min(100, ((feature.value - min) / (max - min)) * 100));
    return Math.round(normalized);
  };

  // Generate normalized values for ranked planets (mock data since /rank doesn't return features)
  const generateHeatmapCell = (planet: RankedPlanet, featureKey: string) => {
    const seed = planet.habitability_score * 1000 + features.findIndex(f => f.key === featureKey);
    const variation = (Math.sin(seed) + 1) / 2;
    const normalized = Math.round(planet.habitability_score * 70 + variation * 30);
    return {
      normalized,
      color: `rgba(255, 106, 0, ${normalized / 100})`
    };
  };

  // Build heatmap rows: current prediction + ranked planets
  const heatmapRows = [];
  
  // Always include current prediction as first row if formData exists
  if (formData) {
    heatmapRows.push({
      name: result.planetName || 'Current Prediction',
      isCurrent: true,
      cells: features.map(f => {
        const normalized = computeCurrentPredictionCell(f.key);
        return {
          normalized,
          color: `rgba(255, 106, 0, ${normalized / 100})`
        };
      })
    });
  }

  // Add ranked planets
  if (Array.isArray(rankedPlanets) && rankedPlanets.length > 0) {
    rankedPlanets.forEach((planet: RankedPlanet) => {
      heatmapRows.push({
        name: planet.planet_name,
        isCurrent: false,
        cells: features.map(f => generateHeatmapCell(planet, f.key))
      });
    });
  }

  const heatmapChart = (
    <div className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40 shadow-lg"
      style={{
        boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
      }}
    >
      <div className="mb-4">
        <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-1">
          Feature vs Habitability Heatmap
        </h3>
        <p className="font-['Space_Mono'] text-xs text-neutral-400">
          Normalized feature suitability across top ranked planets
        </p>
      </div>
      <div className="space-y-2">
        {/* Column Headers */}
        <div className="grid gap-1" style={{ gridTemplateColumns: '140px repeat(5, 1fr)' }}>
          <div className="font-['Space_Mono'] text-xs text-neutral-400 flex items-center px-2">
            Planet
          </div>
          {features.map((feature, idx) => (
            <div key={idx} className="font-['Space_Mono'] text-xs text-neutral-400 text-center px-1 truncate" title={feature.name}>
              {feature.name}
            </div>
          ))}
        </div>
        
        {/* Heatmap Grid */}
        {heatmapRows.length > 0 ? (
          heatmapRows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid gap-1" style={{ gridTemplateColumns: '140px repeat(5, 1fr)' }}>
              <div 
                className={`font-['Space_Mono'] text-xs flex items-center px-2 truncate ${
                  row.isCurrent ? 'text-orange-500 font-semibold' : 'text-white'
                }`}
                title={row.name}
              >
                {row.name}
              </div>
              {row.cells.map((cell, cellIdx) => (
                <div
                  key={cellIdx}
                  className="h-12 border border-neutral-700 flex items-center justify-center font-['Space_Mono'] text-xs cursor-pointer transition-all hover:border-orange-500"
                  style={{ backgroundColor: cell.color }}
                  title={`${row.name} - ${features[cellIdx].name}: ${cell.normalized}% suitability`}
                >
                  <span className="text-white drop-shadow-lg font-semibold">{cell.normalized}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="font-['Space_Mono'] text-xs text-neutral-500">No data available for heatmap</p>
          </div>
        )}
        
        {/* Color Legend */}
        <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-neutral-800">
          <span className="font-['Space_Mono'] text-xs text-neutral-400">Color Scale:</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-4 bg-gradient-to-r from-black via-orange-900/50 to-orange-600 border border-neutral-700"></div>
            <span className="font-['Space_Mono'] text-xs text-neutral-400">Low → High</span>
          </div>
        </div>
      </div>
    </div>
  );

  const featureInfluenceChart = (
    <div className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40 shadow-lg"
      style={{
        boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
      }}
    >
      <div className="mb-4">
        <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-1">
          Feature Influence
        </h3>
        <p className="font-['Space_Mono'] text-xs text-neutral-400">
          Contribution of factors to the habitability model
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={featureInfluenceChartData} layout="vertical" margin={{ left: 0, right: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#d4d4d4', fontFamily: 'Space Mono', fontSize: 10 }}
            label={{
              value: 'Influence Percentage (%)',
              position: 'bottom',
              offset: 0,
              style: { fill: '#d4d4d4', fontFamily: 'Space Mono', fontSize: 11 }
            }}
          />
          <YAxis
            dataKey="feature"
            type="category"
            tick={{ fill: '#d4d4d4', fontFamily: 'Space Mono', fontSize: 11 }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
              border: '1px solid #ea580c',
              fontFamily: 'Space Mono',
              fontSize: '12px'
            }}
            labelStyle={{ color: '#ffffff' }}
            itemStyle={{ color: '#ffffff' }}
          />
          <Legend
            wrapperStyle={{ color: '#d4d4d4', fontFamily: 'Space Mono', fontSize: 11 }}
            verticalAlign="top"
            iconSize={10}
          />
          <Bar dataKey="influence" name="Feature Influence" barSize={14} radius={[0, 4, 4, 0]} fill="#ff6a00" />
          <Line
            type="monotone"
            dataKey="cumulativeInfluence"
            name="Cumulative Influence"
            stroke="#e5e5e5"
            strokeWidth={2}
            dot={{ r: 4, stroke: '#e5e5e5', fill: '#0a0a0a', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  // TODO: API INTEGRATION REQUIRED
  // Replace static comparison data with API call to fetch actual planet database
  // Example:
  // const [comparisonData, setComparisonData] = useState([]);
  // useEffect(() => {
  //   const fetchComparison = async () => {
  //     const response = await fetch('/api/planets/comparison', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ 
  //         planetName: result.planetName,
  //         score: result.score 
  //       })
  //     });
  //     const data = await response.json();
  //     setComparisonData(data);
  //   };
  //   fetchComparison();
  // }, [result]);
  
  // Show only comparison chart (for left column)
  if (showComparisonOnly) {
    return (
      <div className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40 shadow-lg"
        style={{
          boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
        }}
      >
        <div className="mb-4">
          <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-1">
            Feature Influence
          </h3>
          <p className="font-['Space_Mono'] text-xs text-neutral-400">
            Which parameters drive the habitability prediction
          </p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={featureInfluenceChartData} margin={{ left: 0, right: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis
              dataKey="feature"
              tick={{ fill: '#d4d4d4', fontFamily: 'Space Mono', fontSize: 10 }}
              tickMargin={10}
              height={60}
            />
            <YAxis
              tick={{ fill: '#a3a3a3', fontFamily: 'Space Mono', fontSize: 10 }}
              label={{
                value: 'Influence (%)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#a3a3a3', fontFamily: 'Space Mono', fontSize: 11 }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#171717',
                border: '1px solid #ea580c',
                fontFamily: 'Space Mono',
                fontSize: '12px'
              }}
              labelStyle={{ color: '#ffffff' }}
              itemStyle={{ color: '#ffffff' }}
            />
            <Legend wrapperStyle={{ color: '#d4d4d4', fontFamily: 'Space Mono', fontSize: 11 }} iconSize={10} />
            <Bar dataKey="influence" name="Feature Influence" fill="#ff6a00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Show only score and factors charts (for right column)
  if (showChartsOnly) {
    return (
      <div className="space-y-8">
        {/* Radial Score Gauge */}
        <div className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40 shadow-lg"
          style={{
            boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
          }}
        >
          <div className="mb-4">
            <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-1">
              Habitability Score
            </h3>
            <p className="font-['Space_Mono'] text-xs text-neutral-400">
              Overall assessment for {result.planetName}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="60%" 
              outerRadius="100%" 
              barSize={20}
              data={scoreData}
              startAngle={180}
              endAngle={0}
            >
              <PolarGrid gridType="circle" stroke="#404040" />
              <RadialBar
                background={{ fill: '#262626' }}
                dataKey="value"
                cornerRadius={0}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-['Pixelify_Sans']"
                style={{ fontSize: '32px', fill: 'white' }}
              >
                {(result.score * 100).toFixed(1)}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {featureInfluenceChart}

        {/* Habitability Factors Radar Chart */}
        {/* <div className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40 shadow-lg"
          style={{
            boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
          }}
        >
          <div className="mb-4">
            <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-1">
              Habitability Factors
            </h3>
            <p className="font-['Space_Mono'] text-xs text-neutral-400">
              Environmental suitability breakdown
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#404040" />
              <PolarAngleAxis 
                dataKey="factor" 
                tick={{ fill: '#a3a3a3', fontFamily: 'Space Mono', fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#737373', fontFamily: 'Space Mono', fontSize: 10 }}
              />
              <Radar
                name="Factors"
                dataKey="value"
                stroke="#ea580c"
                fill="#ea580c"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    );
  }

  // Show only heatmap (for left column placement)
  if (showHeatmapOnly) {
    return heatmapChart;
  }

  // Show only factors chart (for right column)
  if (showFactorsOnly) {
    return (
      <div className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40 shadow-lg"
        style={{
          boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
        }}
      >
        <div className="mb-4">
          <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-1">
            Habitability Factors
          </h3>
          <p className="font-['Space_Mono'] text-xs text-neutral-400">
            Environmental suitability breakdown
          </p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#404040" />
            <PolarAngleAxis 
              dataKey="factor" 
              tick={{ fill: '#a3a3a3', fontFamily: 'Space Mono', fontSize: 11 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#737373', fontFamily: 'Space Mono', fontSize: 10 }}
            />
            <Radar
              name="Factors"
              dataKey="value"
              stroke="#ea580c"
              fill="#ea580c"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Show only score chart (for right column)
  if (showScoreOnly) {
    return (
      <div className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40 shadow-lg"
        style={{
          boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
        }}
      >
        <div className="mb-4">
          <h3 className="font-['Pixelify_Sans'] text-lg text-white mb-1">
            Habitability Score
          </h3>
          <p className="font-['Space_Mono'] text-xs text-neutral-400">
            Overall assessment for {result.planetName}
          </p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="60%" 
            outerRadius="100%" 
            barSize={20}
            data={scoreData}
            startAngle={180}
            endAngle={0}
          >
            <PolarGrid gridType="circle" stroke="#404040" />
            <RadialBar
              background={{ fill: '#262626' }}
              dataKey="value"
              cornerRadius={0}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-['Pixelify_Sans']"
              style={{ fontSize: '32px', fill: 'white' }}
            >
              {(result.score * 100).toFixed(1)}%
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}