import { useEffect, useState } from 'react';
import { getRankedPlanets, computeDashboardStats } from '../services/api';

export function StatsOverview() {
  const [stats, setStats] = useState([
    { label: 'Planets Analyzed', value: '0' },
    { label: 'Habitable Candidates', value: '0' },
    { label: 'Average Confidence', value: '0.00' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rankings and compute stats from the data
  useEffect(() => {
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await getRankedPlanets();

      if (response.status === 'success' && response.data) {
        const apiData = response.data;

        setStats([
          {
            label: 'Planets Analyzed',
            value: apiData.total_count.toLocaleString()
          },
          {
            label: 'Habitable Candidates',
            value: apiData.habitable_count.toLocaleString()
          },
          {
            label: 'Average Habitability',
            value: (apiData.average_score * 100).toFixed(1) + '%'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchStats();
}, []);


  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="border border-orange-600/30 p-6 backdrop-blur-md bg-black/40 shadow-lg shadow-orange-900/20"
          style={{
            boxShadow: '0 8px 32px 0 rgba(234, 88, 12, 0.1), inset 0 1px 0 0 rgba(234, 88, 12, 0.2)'
          }}
        >
          <p className="font-['Space_Mono'] text-sm text-neutral-400 mb-2">
            {stat.label}
          </p>
          <p className="font-['Pixelify_Sans'] text-4xl text-orange-500">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              stat.value
            )}
          </p>
        </div>
      ))}
    </div>
  );
}