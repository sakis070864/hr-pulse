
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[11px] font-black text-white uppercase tracking-[0.8em]">
            INITIALIZING_MARKET_LOGIC
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-600 tracking-widest">
          SEARCHING_DATA_CORES: {Math.round(progress)}%
        </span>
      </div>
      
      <div className="relative w-full h-px bg-white/5 overflow-hidden">
        {/* Main thin tracer */}
        <div 
          className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]"
          style={{ width: `${progress}%` }}
        />
        
        {/* Neural velocity streak */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-velocity" />
        </div>
      </div>
      
      <div className="flex justify-between items-center px-2">
        <div className="flex gap-6">
           {['REDDIT', 'WSO', 'LI', 'GD'].map((site, i) => (
             <div key={site} className={`text-[8px] font-black tracking-[0.4em] transition-colors duration-700 ${progress > (25 * (i)) ? 'text-indigo-500/80' : 'text-gray-800'}`}>
               {site}
             </div>
           ))}
        </div>
        <div className="text-[8px] text-gray-800 font-black tracking-widest">
          GROUNDING_ACTIVE
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
