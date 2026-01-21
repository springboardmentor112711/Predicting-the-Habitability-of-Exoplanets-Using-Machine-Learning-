import { FileDown, FileSpreadsheet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRankedPlanets, type RankedPlanet } from '../services/api';

interface Planet {
  rank: number;
  name: string;
  score: number;
  confidence: number;
}

interface RankingSectionProps {
  refreshTrigger?: number;
}

export function RankingSection({ refreshTrigger }: RankingSectionProps) {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch ranked planets from backend API
  useEffect(() => {
    const fetchRankings = async () => {
      setIsLoading(true);
      try {
        // Call GET /rank API
        const response = await getRankedPlanets();
        
        if (response.status === 'success' && response.data) {
          // Transform API response to component format
          const transformedData: Planet[] = response.data.data.map((planet: RankedPlanet) => ({
            rank: planet.rank,
            name: planet.planet_name,
            score: planet.habitability_score,
            confidence: planet.confidence
          }));
          
          setPlanets(transformedData);
        } else {
          console.error('Failed to fetch rankings');
          setPlanets([]);
        }
      } catch (error) {
        console.error('Error fetching rankings:', error);
        setPlanets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      // TODO: API INTEGRATION REQUIRED
      // Replace mock PDF export with actual API call
      // Example:
      // const response = await fetch('/api/export/pdf', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ planets })
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'exoplanet-rankings.pdf';
      // a.click();
      
      // Mock PDF export (REMOVE THIS IN PRODUCTION)
      console.log('Exporting to PDF...', planets);
      alert('PDF export initiated. In production, this would generate a PDF file.');
    } else {
      // TODO: API INTEGRATION REQUIRED (OPTIONAL)
      // Current CSV export works client-side
      // Optionally replace with server-side Excel generation:
      // const response = await fetch('/api/export/excel', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ planets })
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'exoplanet-rankings.xlsx';
      // a.click();
      
      // Mock Excel export (CSV format - works without backend)
      console.log('Exporting to Excel...', planets);
      const csvContent = [
        ['Rank', 'Planet Name', 'Habitability Score', 'Confidence'],
        ...planets.map(p => [p.rank, p.name, p.score, p.confidence])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exoplanet-rankings.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="border border-orange-600/30 p-8 backdrop-blur-md bg-black/40 shadow-lg"
      style={{
        boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.15), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-['Pixelify_Sans'] text-2xl text-white mb-1">
            Top Habitable Planets
          </h2>
          <p className="font-['Space_Mono'] text-sm text-neutral-400">
            Ranked by habitability score
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-['Space_Mono'] text-sm hover:bg-orange-700 transition-colors"
            disabled={isLoading}
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-orange-600 text-orange-500 font-['Space_Mono'] text-sm hover:bg-neutral-700 transition-colors"
            disabled={isLoading}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse font-['Space_Mono'] text-orange-500">
            Loading rankings...
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-orange-600">
                <th className="text-left py-4 px-4 font-['Space_Mono'] text-xs text-neutral-400 tracking-wider">
                  RANK
                </th>
                <th className="text-left py-4 px-4 font-['Space_Mono'] text-xs text-neutral-400 tracking-wider">
                  PLANET NAME
                </th>
                <th className="text-left py-4 px-4 font-['Space_Mono'] text-xs text-neutral-400 tracking-wider">
                  HABITABILITY SCORE
                </th>
                <th className="text-left py-4 px-4 font-['Space_Mono'] text-xs text-neutral-400 tracking-wider">
                  CONFIDENCE
                </th>
              </tr>
            </thead>
            <tbody>
              {planets.map((planet) => (
                <tr
                  key={planet.rank}
                  className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-['Space_Mono'] text-sm text-orange-500 font-bold">
                      #{planet.rank}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Space_Mono'] text-sm text-white">
                      {planet.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden max-w-[200px]">
                        <div
                          className="h-full bg-orange-600 rounded-full transition-all"
                          style={{ width: `${planet.score * 100}%` }}
                        />
                      </div>
                      <span className="font-['Space_Mono'] text-sm text-white min-w-[60px]">
                        {(planet.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-['Space_Mono'] text-sm text-neutral-400">
                      {(planet.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}