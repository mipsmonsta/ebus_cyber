import { useState, useEffect, useMemo, useCallback } from 'react';
import { DataUploader } from './components/DataUploader';
import { OverallChart } from './components/OverallChart';
import { ModelBreakdownChart } from './components/ModelBreakdownChart';
import { BusSchematic } from './components/BusSchematic';
import type { BusMileage } from './types';
import { RotateCw, Pause, Play, BarChart3, Settings, X } from 'lucide-react';
import Papa from 'papaparse';
import { EMBEDDED_DATA } from './data/defaultData';

function App() {
  const [rawData, setRawData] = useState<BusMileage[]>([]);
  const [activeView, setActiveView] = useState<'overall' | 'breakdown'>('overall');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotationInterval, setRotationInterval] = useState(() => {
    const saved = localStorage.getItem('ebus_rotation_interval');
    return saved ? parseInt(saved, 10) : 10;
  });

  // Save interval to localStorage
  useEffect(() => {
    localStorage.setItem('ebus_rotation_interval', rotationInterval.toString());
  }, [rotationInterval]);

  // Load factory default data (embedded in the bundle)
  useEffect(() => {
    const loadDefaultData = () => {
      setIsLoading(true);
      const allData: BusMileage[] = [];
      
      EMBEDDED_DATA.forEach(({ fileName, content }) => {
        const modelName = fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        
        Papa.parse(content, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().replace(/^\ufeff/, ""),
          complete: (results) => {
            const mappedData = results.data
              .map((row: any) => {
                const monthKey = Object.keys(row).find(k => k.toLowerCase() === 'month' || k.toLowerCase().includes('month'));
                const mileageKey = Object.keys(row).find(k => k.toLowerCase() === 'mileage' || k.toLowerCase().includes('mileage'));
                
                if (monthKey && mileageKey && row[monthKey] !== undefined) {
                  const mil = parseFloat(String(row[mileageKey]));
                  if (!isNaN(mil)) {
                    return {
                      Month: String(row[monthKey]).trim(),
                      Mileage: mil,
                      BusModel: modelName,
                    };
                  }
                }
                return null;
              })
              .filter((item): item is BusMileage => item !== null);
            allData.push(...mappedData);
          }
        });
      });

      if (allData.length > 0) {
        setRawData(allData);
      }
      setIsLoading(false);
    };

    // Small delay to show the "booting" sequence
    const timer = setTimeout(loadDefaultData, 800);
    return () => clearTimeout(timer);
  }, []);

  // Rotation logic
  useEffect(() => {
    if (!isAutoRotating || rawData.length === 0 || showSettings) return;

    const interval = setInterval(() => {
      setActiveView((prev) => (prev === 'overall' ? 'breakdown' : 'overall'));
    }, rotationInterval * 1000);

    return () => clearInterval(interval);
  }, [isAutoRotating, rawData, showSettings, rotationInterval]);

  // Data processing: Filter only the last 5 months across all data
  const processedData = useMemo(() => {
    if (rawData.length === 0) return [];
    const uniqueMonths = [...new Set(rawData.map(d => d.Month))].sort();
    const lastFiveMonths = uniqueMonths.slice(-5);
    return rawData.filter(item => lastFiveMonths.includes(item.Month));
  }, [rawData]);

  // Data processing: Aggregate monthly totals for the past 5 months
  const monthlyTotals = useMemo(() => {
    const totalsMap: Record<string, number> = {};
    processedData.forEach(item => {
      totalsMap[item.Month] = (totalsMap[item.Month] || 0) + item.Mileage;
    });
    return Object.entries(totalsMap)
      .map(([Month, TotalMileage]) => ({ Month, TotalMileage }))
      .sort((a, b) => a.Month.localeCompare(b.Month));
  }, [processedData]);

  // Data processing: Breakdown for the last month
  const lastMonthBreakdown = useMemo(() => {
    if (processedData.length === 0) return { data: [], month: '' };
    const uniqueMonths = [...new Set(processedData.map(d => d.Month))].sort();
    const lastMonth = uniqueMonths[uniqueMonths.length - 1];
    const breakdown = processedData
      .filter(item => item.Month === lastMonth)
      .map(item => ({ BusModel: item.BusModel, Mileage: item.Mileage }));
    return { data: breakdown, month: lastMonth };
  }, [processedData]);

  const handleManualDataLoad = useCallback((data: BusMileage[]) => {
    setRawData(data);
    setShowSettings(false);
  }, []);

  return (
    <div className="min-h-screen text-slate-200 p-8 flex flex-col font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-accent/5 blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyber-highlight/5 blur-[100px] -z-10"></div>

      {/* Header Banner */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-10"></div> {/* Spacer for symmetry */}
        <header className="header-banner flex flex-col items-center">
          <div className="accent-bar mb-2"></div>
          <h1 className="text-4xl font-black tracking-[0.2em] text-white uppercase">
            EBUS OPERATION MILEAGE
          </h1>
          <div className="flex gap-4 mt-2">
            <span className="text-[10px] text-cyber-accent font-mono tracking-widest uppercase">Operations Control Center</span>
            <span className="text-[10px] text-cyber-highlight font-mono tracking-widest uppercase animate-pulse-glow">// ACTIVE HUD</span>
          </div>
        </header>
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 border transition-all ${showSettings ? 'bg-cyber-highlight border-cyber-highlight text-cyber-bg' : 'border-cyber-accent/30 text-cyber-accent hover:border-cyber-accent hover:shadow-accent-glow'}`}
        >
          {showSettings ? <X size={20} /> : <Settings size={20} />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative ${rawData.length === 0 && !isLoading ? 'items-center justify-center' : 'items-stretch'}`}>
        <BusSchematic activeView={activeView} />
        
        {showSettings ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyber-bg/80 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="w-full max-w-xl panel-sci-fi p-8 relative">
                <div className="corner-bl"></div><div className="corner-br"></div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-cyber-accent tracking-widest uppercase">System Configuration</h2>
                  <span className="text-[10px] font-mono text-slate-500">SET_PATH: EXTERNAL_VOL</span>
                </div>

                <div className="mb-8 p-4 border border-cyber-accent/20 bg-cyber-accent/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <RotateCw size={16} className="text-cyber-accent" />
                      <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">Auto-Cycle Interval (Sec)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="1"
                        max="60"
                        value={rotationInterval}
                        onChange={(e) => setRotationInterval(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 bg-cyber-bg border border-cyber-accent/50 text-cyber-accent font-mono text-center p-1 focus:outline-none focus:border-cyber-accent focus:shadow-accent-glow"
                      />
                      <span className="text-[10px] font-mono text-cyber-accent uppercase">s</span>
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-cyber-accent/10 mb-4"></div>
                  <p className="text-[9px] font-mono text-slate-500 uppercase leading-relaxed">
                    Adjust the duration for each technical module visualization before automatic system transition.
                  </p>
                </div>

                <DataUploader onDataLoaded={handleManualDataLoad} />
                
                <button 
                  onClick={() => setShowSettings(false)}
                  className="mt-6 w-full py-2 border border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 transition-colors uppercase text-[10px] font-mono tracking-widest"
                >
                  Close Settings
                </button>
             </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-cyber-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-cyber-accent font-mono text-[10px] tracking-widest animate-pulse">BOOTING_SYSTEM_DATA...</span>
          </div>
        ) : rawData.length === 0 ? (
          <div className="w-full max-w-xl">
             <div className="panel-sci-fi p-8">
                <div className="corner-bl"></div><div className="corner-br"></div>
                <DataUploader onDataLoaded={handleManualDataLoad} />
             </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-6">
            {/* View Controls Panel */}
            <div className="flex justify-between items-center px-4">
               <div className="panel-sci-fi px-6 py-2 flex items-center gap-6">
                  <div className="corner-bl"></div><div className="corner-br"></div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-mono text-cyber-accent uppercase">Fleet Stream: Active</span>
                  </div>
                  <div className="h-4 w-[1px] bg-cyber-accent/30"></div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Models: {[...new Set(rawData.map(d => d.BusModel))].length}</div>
               </div>

               <div className="panel-sci-fi p-2 flex items-center gap-4">
                  <div className="corner-bl"></div><div className="corner-br"></div>
                  <button 
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`flex items-center gap-2 px-4 py-1 rounded-sm transition-all border ${isAutoRotating ? 'bg-cyber-accent/10 border-cyber-accent text-cyber-accent shadow-accent-glow' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}
                  >
                    {isAutoRotating ? <Pause size={14} /> : <Play size={14} />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{isAutoRotating ? 'Auto' : 'Manual'}</span>
                  </button>
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setActiveView('overall')}
                      className={`p-1 rounded-sm transition-all border ${activeView === 'overall' ? 'bg-cyber-accent text-cyber-bg border-cyber-accent' : 'border-slate-700 text-slate-500 hover:text-cyber-accent'}`}
                    >
                      <BarChart3 size={18} />
                    </button>
                    <button 
                      onClick={() => setActiveView('breakdown')}
                      className={`p-1 rounded-sm transition-all border ${activeView === 'breakdown' ? 'bg-cyber-accent text-cyber-bg border-cyber-accent' : 'border-slate-700 text-slate-500 hover:text-cyber-accent'}`}
                    >
                      <RotateCw size={18} />
                    </button>
                  </div>
               </div>
            </div>

            {/* Chart Panel */}
            <div className="flex-1 min-h-[500px] panel-sci-fi p-8 flex flex-col overflow-hidden">
              <div className="corner-bl"></div><div className="corner-br"></div>
              {activeView === 'overall' ? (
                <div className="flex-1 flex flex-col min-h-0">
                  <OverallChart data={monthlyTotals} />
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  <ModelBreakdownChart data={lastMonthBreakdown.data} monthName={lastMonthBreakdown.month} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Info Bars */}
      <footer className="mt-8 flex justify-between text-[10px] font-mono tracking-widest text-cyber-accent/50 uppercase">
        <div className="flex gap-8">
           <div className="flex items-center gap-2">
              <div className="w-20 h-1 bg-cyber-accent/20 overflow-hidden relative">
                 <div className="absolute inset-0 bg-cyber-accent w-1/2 animate-[pulse-glow_2s_infinite]"></div>
              </div>
              <span>System Integrity: Nominal</span>
           </div>
        </div>
        <div>
           Terminal: EB-OCC-42526 // Lat: 1.3521 N // Long: 103.8198 E
        </div>
      </footer>
    </div>
  );
}

export default App;
