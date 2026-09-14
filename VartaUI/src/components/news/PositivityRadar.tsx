import React from 'react';

interface PositivityRadarProps {
  score?: number;
}

export const PositivityRadar: React.FC<PositivityRadarProps> = ({
  score = 78,
}) => {
  return (
    <section className="w-full bg-[#FFFDF9] dark:bg-[#16202B] border border-[#EAE5DC] dark:border-[#2A3848] rounded-2xl px-6 sm:px-8 py-4 mb-8 shadow-2xs transition-colors duration-200">
      <div className="flex items-center space-x-5">
        
        {/* Speedometer Arc Gauge (SVG) */}
        <div className="w-14 h-9 relative shrink-0 flex items-end justify-center overflow-hidden">
          <svg viewBox="0 0 100 55" className="w-full h-full">
            {/* Background Arch Track */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="currentColor"
              className="text-[#EFEBE4] dark:text-[#253648]"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Active Amber Gauge Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 65 14"
              fill="none"
              stroke="#DF8235"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text Details */}
        <div>
          <div className="text-xs font-bold text-[#1E3A5F] dark:text-amber-400 tracking-tight">
            positivity radar · {score}
          </div>
          <p className="text-sm font-serif-editorial text-slate-900 dark:text-[#FDF9F2] mt-0.5 font-medium">
            World news is running warmer than usual this week
          </p>
        </div>

      </div>
    </section>
  );
};
