import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlyTotal } from '../types';

interface Props {
  data: MonthlyTotal[];
}

export const OverallChart: React.FC<Props> = ({ data }) => {
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
  <div className="w-full h-full flex flex-col animate-digital-load">
    <h2 className="text-xl font-bold text-cyber-accent mb-6 flex items-center gap-3 tracking-[0.2em] uppercase">
      <span className="w-1 h-6 bg-cyber-highlight inline-block"></span>
      Total Cumulative Operated Mileage
    </h2>
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
          />          <Area 
            type="monotone" 
            dataKey="TotalMileage" 
            stroke="#00E5FF" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMileage)" 
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
};
