import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel') => void;
}

export function ExportButton({ onExport }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportClick = (format: 'pdf' | 'excel') => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-['Space_Mono'] text-xs tracking-wide hover:bg-orange-700 transition-colors"
      >
        <Download className="w-4 h-4" strokeWidth={1.5} />
        EXPORT
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-orange-600 z-10">
          <button
            onClick={() => handleExportClick('pdf')}
            className="w-full flex items-center gap-3 px-4 py-3 text-white font-['Space_Mono'] text-xs hover:bg-neutral-800 transition-colors"
          >
            <FileText className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
            Export as PDF
          </button>
          <div className="border-t border-neutral-800" />
          <button
            onClick={() => handleExportClick('excel')}
            className="w-full flex items-center gap-3 px-4 py-3 text-white font-['Space_Mono'] text-xs hover:bg-neutral-800 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
            Export as Excel
          </button>
        </div>
      )}
    </div>
  );
}
