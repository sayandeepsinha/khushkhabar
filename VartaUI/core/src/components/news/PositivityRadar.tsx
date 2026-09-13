import React, { useMemo } from 'react';
import { Sun, HeartHandshake, TreePine, Lightbulb, Smile, Quote, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_DAILY_QUOTE } from '../../api/mockData';

interface PositivityRadarProps {
  onSelectMoodFilter: (keyword: string) => void;
  activeFilter?: string;
  totalArticlesCount?: number;
}

export const PositivityRadar: React.FC<PositivityRadarProps> = ({
  onSelectMoodFilter,
  activeFilter,
  totalArticlesCount = 97,
}) => {
  const { currentUser, positivityStreak } = useAuth();

  // Dynamic greeting based on current local time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const nameStr = currentUser ? `, ${currentUser.name.split(' ')[0]}` : '';
    if (hour >= 5 && hour < 12) {
      return {
        salutation: `Good morning${nameStr}`,
        tagline: "Here is your morning briefing on constructive global progress.",
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        salutation: `Good afternoon${nameStr}`,
        tagline: "Midday perspectives on human ingenuity, resilience, and discovery.",
      };
    } else {
      return {
        salutation: `Good evening${nameStr}`,
        tagline: "Unwind with verified stories of compassion, health, and earth recovery.",
      };
    }
  }, [currentUser]);

  const moodFilters = [
    { label: 'Earth & Climate', icon: TreePine, query: 'climate environment green clean solar' },
    { label: 'Medicine & Science', icon: Lightbulb, query: 'medical science health discovery hospital' },
    { label: 'Human Kindness', icon: HeartHandshake, query: 'community kindness volunteer rescue' },
    { label: 'Joy & Hope', icon: Smile, query: 'uplifting animal joy heartwarming' },
  ];

  return (
    <section className="mb-10 p-6 sm:p-8 rounded-2xl bg-white border border-[#EAE5DC] shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Refined Masthead & Greeting */}
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-amber-50 text-amber-900 border border-amber-300/80">
              <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Varta Daily Briefing</span>
            </span>

            {/* Verified Positivity Metric in Forest Emerald */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300/80">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>98% Constructive Index</span>
            </span>

            {/* Active streak if user is logged in */}
            {currentUser && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-stone-100 text-slate-800 border border-stone-200">
                <span>🔥</span>
                <span>{positivityStreak} Day Reading Habit</span>
              </span>
            )}
          </div>

          <h1 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {greeting.salutation}.{' '}
            <span className="font-normal text-slate-600">
              {greeting.tagline}
            </span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-sans-body">
            Curating <strong className="text-slate-800 font-semibold">{totalArticlesCount}+ verified positive stories</strong> from global research institutions and independent correspondents.
          </p>
        </div>

        {/* Right: Quote Box & Refined Topic Filters */}
        <div className="flex flex-col gap-3.5 lg:w-96 shrink-0">
          
          {/* Daily Thought in Champagne Gold */}
          <div className="p-4 rounded-xl bg-[#FCFBF8] border border-amber-200/80">
            <div className="flex items-start gap-2.5">
              <Quote className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-serif-editorial text-xs sm:text-sm italic text-slate-800 leading-snug">
                  "{MOCK_DAILY_QUOTE.quote}"
                </p>
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mt-1.5">
                  — {MOCK_DAILY_QUOTE.author}
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Quick Filters */}
          <div className="flex flex-wrap gap-1.5">
            {moodFilters.map((m) => {
              const Icon = m.icon;
              const isSelected = activeFilter === m.query;
              return (
                <button
                  key={m.label}
                  onClick={() => onSelectMoodFilter(isSelected ? '' : m.query)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-xs font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
