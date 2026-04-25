import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ModelTotal } from '../types';

interface Props {
  data: ModelTotal[];
  monthName: string;
}

const COLORS = ['#00E5FF', '#26F0FF', '#4DFAFF', '#73FFFF', '#99FFFF'];

export const ModelBreakdownChart: React.FC<Props> = ({ data, monthName }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-cyber-accent/20 bg-cyber-bg/40">
        <p className="text-cyber-highlight animate-pulse font-mono uppercase tracking-widest text-sm">
          No Model Data Available for {monthName}
        </p>
      </div>
    );
  }
return (
  <div className="w-full h-full flex flex-col animate-digital-load">
    <h2 className="text-xl font-bold text-cyber-accent mb-6 flex items-center gap-3 tracking-[0.2em] uppercase">
      <span className="w-1 h-6 bg-cyber-highlight inline-block"></span>
      CUMULATIVE FLEET MILEAGE BY BUS MODELS
    </h2>
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="99%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#223355" horizontal={false} />
          <XAxis 
            type="number" 
            stroke="#00E5FF" 
            fontSize={10} 
            tickLine={false} 
            axisLine={{ stroke: '#00E5FF', strokeWidth: 1, opacity: 0.4 }}
            tick={{ fill: '#00E5FF', opacity: 0.9 }}
            tickFormatter={(value) => `${value.toLocaleString()} KM`}
          />
          <YAxis 
            dataKey="BusModel" 
            type="category" 
            stroke="#e2e8f0" 
            fontSize={12} 
            tickLine={false} 
            axisLine={{ stroke: '#00E5FF', strokeWidth: 1, opacity: 0.4 }}
            tick={{ fill: '#e2e8f0' }}
            width={120}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 229, 255, 0.05)' }}
            contentStyle={{ backgroundColor: 'rgba(2, 10, 24, 0.9)', border: '1px solid #00E5FF', borderRadius: '0px' }}
            itemStyle={{ color: '#00E5FF', fontSize: '12px', fontWeight: 'bold' }}
            labelStyle={{ color: '#FF5500', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
            formatter={(value: any) => [`${Number(value).toLocaleString()} KM`, 'Mileage']}
          />          <Bar 
            dataKey="Mileage" 
            radius={[0, 2, 2, 0]} 
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
};
