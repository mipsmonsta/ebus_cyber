import { useState, useEffect, useMemo } from 'react';
import { DataUploader } from './components/DataUploader';
import { OverallChart } from './components/OverallChart';
import { ModelBreakdownChart } from './components/ModelBreakdownChart';
import { BusSchematic } from './components/BusSchematic';
import type { BusMileage } from './types';
import { RotateCw, Pause, Play, BarChart3 } from 'lucide-react';

function App() {
  const [rawData, setRawData] = useState<BusMileage[]>([]);
  const [activeView, setActiveView] = useState<'overall' | 'breakdown'>('overall');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Rotation logic
  useEffect(() => {
    if (!isAutoRotating || rawData.length === 0) return;

    const interval = setInterval(() => {
      setActiveView((prev) => (prev === 'overall' ? 'breakdown' : 'overall'));
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating, rawData]);

  // Data processing: Filter only the last 5 months across all data
  const processedData = useMemo(() => {
    if (rawData.length === 0) return [];
    console.log("Raw Data count:", rawData.length);

    // 1. Get unique months and sort them
    const uniqueMonths = [...new Set(rawData.map(d => d.Month))].sort();
    console.log("Unique Months found:", uniqueMonths);
    
    // 2. Take only the last 5 months
    const lastFiveMonths = uniqueMonths.slice(-5);
    console.log("Displaying months:", lastFiveMonths);
    
    // 3. Filter raw data to keep only those months
    const filtered = rawData.filter(item => lastFiveMonths.includes(item.Month));
    console.log("Filtered data count:", filtered.length);
    return filtered;
  }, [rawData]);

  // Data processing: Aggregate monthly totals for the past 5 months
  const monthlyTotals = useMemo(() => {
    const totalsMap: Record<string, number> = {};
    
    processedData.forEach(item => {
      totalsMap[item.Month] = (totalsMap[item.Month] || 0) + item.Mileage;
    });

    const result = Object.entries(totalsMap)
      .map(([Month, TotalMileage]) => ({ Month, TotalMileage }))
      .sort((a, b) => a.Month.localeCompare(b.Month));
    
    console.log("Monthly Totals for chart:", result);
    return result;
  }, [processedData]);

  // Data processing: Breakdown for the last month
  const lastMonthBreakdown = useMemo(() => {
    if (processedData.length === 0) return { data: [], month: '' };

    const uniqueMonths = [...new Set(processedData.map(d => d.Month))].sort();
    const lastMonth = uniqueMonths[uniqueMonths.length - 1];
    
    const breakdown = processedData
      .filter(item => item.Month === lastMonth)
      .map(item => ({ BusModel: item.BusModel, Mileage: item.Mileage }));

    console.log(`Breakdown for ${lastMonth}:`, breakdown);
    return { data: breakdown, month: lastMonth };
  }, [processedData]);

  return (
    <div className="min-h-screen text-slate-200 p-8 flex flex-col font-sans">
      {/* Header Banner */}
      <div className="flex justify-center mb-12">
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
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative ${rawData.length === 0 ? 'items-center justify-center' : 'items-stretch'}`}>
        <BusSchematic activeView={activeView} />
        {rawData.length === 0 ? (
          <div className="w-full max-w-xl">
             <div className="panel-sci-fi p-8">
                <div className="corner-bl"></div><div className="corner-br"></div>
                <DataUploader onDataLoaded={setRawData} />
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
