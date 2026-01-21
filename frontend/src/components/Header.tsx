import { Globe, Home, Satellite } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'predict', label: 'Predict' },
    { id: 'rank', label: 'Rank' }
  ];

  return (
    <header className="border-b border-orange-600 bg-black">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => onTabChange('home')}
          >
            <Satellite className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" strokeWidth={1.5} />
            <h1 className="font-['Pixelify_Sans'] text-2xl tracking-wide group-hover:text-orange-400 transition-colors">
              Exo-Habitz.AI
            </h1>
          </div>
          
          <nav className="flex gap-1">
            <button
              onClick={() => onTabChange('home')}
              className={`px-4 py-2 font-['Space_Mono'] text-sm tracking-wide transition-colors flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-orange-600 text-white'
                  : 'text-neutral-400 hover:text-orange-500'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-2 font-['Space_Mono'] text-sm tracking-wide transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-600 text-white'
                    : 'text-neutral-400 hover:text-orange-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}