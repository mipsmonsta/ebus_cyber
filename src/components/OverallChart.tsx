import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlyTotal } from '../types';

interface Props {
  data: MonthlyTotal[];
}

export const OverallChart: React.FC<Props> = ({ data }) => {
  const [count, setCount] = useState(0);

  const totalCumulative = useMemo(() => {
    if (!data || data.length === 0) return 0;
    // The last entry in our sorted data is the cumulative total
    return data[data.length - 1].TotalMileage;
  }, [data]);

  // Counting Animation Logic
  useEffect(() => {
    const end = totalCumulative;
    if (end === 0) return;

    const duration = 1500; // Match chart animation duration
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for a smoother finish (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentValue = Math.floor(easeProgress * end);
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    return () => setCount(0); // Reset on unmount
  }, [totalCumulative]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-cyber-accent/20 bg-cyber-bg/40">
        <p className="text-cyber-highlight animate-pulse font-mono uppercase tracking-widest text-sm">
          No Historical Data Available for this Selection
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col animate-digital-load relative">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-cyber-accent flex items-center gap-3 tracking-[0.2em] uppercase">
          <span className="w-1 h-6 bg-cyber-highlight inline-block"></span>
          Total Cumulative Operated Mileage
        </h2>

        {/* Animated Cumulative HUD Counter */}
        <div className="panel-sci-fi px-4 py-2 border-cyber-highlight/50 bg-cyber-highlight/5 min-w-[200px] text-right">
          <div className="text-[10px] font-mono text-cyber-highlight tracking-widest uppercase mb-1 flex items-center justify-end gap-2">
            <span className="w-1.5 h-1.5 bg-cyber-highlight animate-pulse"></span>
            Total Fleet Distance
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tighter">
            {count.toLocaleString()} <span className="text-xs text-cyber-accent">KM</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMileage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#223355" vertical={false} />
            <XAxis 
              dataKey="Month" 
              stroke="#00E5FF" 
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#00E5FF', strokeWidth: 1, opacity: 0.4 }}
              tick={{ fill: '#00E5FF', opacity: 0.9 }}
            />
            <YAxis 
              stroke="#00E5FF" 
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#00E5FF', strokeWidth: 1, opacity: 0.4 }}
              tick={{ fill: '#00E5FF', opacity: 0.9 }}
              tickFormatter={(value) => `${value.toLocaleString()} KM`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(2, 10, 24, 0.9)', border: '1px solid #00E5FF', borderRadius: '0px' }}
              itemStyle={{ color: '#00E5FF', fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: '#FF5500', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
              formatter={(value: any) => [`${Number(value).toLocaleString()} KM`, 'Total Mileage']}
            />
            <Area 
              type="monotone" 
              dataKey="TotalMileage" 
              stroke="#00E5FF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMileage)" 
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
