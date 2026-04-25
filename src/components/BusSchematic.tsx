import React from 'react';

interface Props {
  activeView: 'overall' | 'breakdown';
}

export const BusSchematic: React.FC<Props> = ({ activeView }) => {
  return (
    <div 
      className="fixed bottom-6 left-0 w-[400px] h-[160px] opacity-[0.4] pointer-events-none overflow-hidden select-none z-[100] transition-transform duration-[2000ms] ease-in-out"
      style={{
        transform: activeView === 'overall' 
          ? 'translateX(2rem)' 
          : 'translateX(calc(100vw - 400px - 2rem))'
      }}
    >
      <svg
        viewBox="0 0 1000 400"
        className="w-full h-full filter drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Tech Grid (Simpler for smaller view) */}
        <path d="M0 200 H1000 M500 0 V400" stroke="#00E5FF" strokeWidth="0.5" strokeDasharray="10 10" opacity="0.3" />
        
        {/* Telemetry Labels */}
        <text x="20" y="30" fill="#00E5FF" fontSize="24" fontFamily="monospace" fontWeight="bold" opacity="0.8">
          {activeView === 'overall' ? 'STRAT: L-01' : 'STRAT: R-02'}
        </text>
        <rect x="15" y="10" width="160" height="30" stroke="#00E5FF" strokeWidth="1" opacity="0.4" />

        {/* --- Bus Outline --- */}
        <g stroke="#00E5FF" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" className="animate-[pulse-glow_4s_infinite]">
          
          {/* Main Body Outline */}
          <path d="
            M 150,280 
            L 150,120 
            C 150,110 160,105 180,105
            L 800,105
            C 860,105 880,130 890,170
            L 900,240
            C 902,260 890,270 870,275
            L 850,280
            Z" 
          />

          {/* Roof Battery Pod */}
          <path d="M 220,105 L 240,85 L 750,85 L 770,105" strokeWidth="2" />

          {/* Front Windshield */}
          <path d="M 800,110 C 850,110 860,130 870,170 L 880,220 L 760,220 L 750,120 Z" strokeWidth="2" fill="rgba(0, 229, 255, 0.1)" />
          
          {/* Side Windows */}
          <path d="M 160,120 L 730,120 L 740,210 L 160,210 Z" strokeWidth="2" fill="rgba(0, 229, 255, 0.05)" />

          {/* Wheels */}
          <circle cx="300" cy="280" r="35" strokeWidth="3" fill="#020A18" />
          <circle cx="300" cy="280" r="8" strokeWidth="2" />
          <circle cx="750" cy="280" r="35" strokeWidth="3" fill="#020A18" />
          <circle cx="750" cy="280" r="8" strokeWidth="2" />

          {/* Technical Marker */}
          <circle cx="890" cy="170" r="5" fill="#FF5500" className="animate-pulse" />
          <line x1="890" y1="170" x2="950" y2="100" stroke="#FF5500" strokeWidth="1" />
          <text x="960" y="95" fill="#FF5500" fontSize="18" fontFamily="monospace">MAN_EV_SYS_01</text>
        </g>
      </svg>
    </div>
  );
};
