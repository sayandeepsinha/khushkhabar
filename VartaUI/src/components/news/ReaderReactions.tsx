import React, { useState } from 'react';
import { ThumbsUp, Sparkles, Heart } from 'lucide-react';

interface ReaderReactionsProps {
  articleId: string;
  compact?: boolean;
}

export const ReaderReactions: React.FC<ReaderReactionsProps> = ({
  articleId,
  compact = false,
}) => {
  const [reactions, setReactions] = useState(() => {
    const seed = (articleId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 30) + 10;
    const saved = localStorage.getItem(`varta_reacts_${articleId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      uplifted: seed + 15,
      inspiring: seed + 8,
      heartwarming: seed + 5,
    };
  });

  const [userReacted, setUserReacted] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`varta_user_reacts_${articleId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  const handleReaction = (e: React.MouseEvent, type: 'uplifted' | 'inspiring' | 'heartwarming') => {
    e.stopPropagation();
    const isCurrentlyActive = !!userReacted[type];
    const newCount = reactions[type] + (isCurrentlyActive ? -1 : 1);

    const nextReactions = {
      ...reactions,
      [type]: Math.max(0, newCount),
    };
    const nextUserReacted = {
      ...userReacted,
      [type]: !isCurrentlyActive,
    };

    setReactions(nextReactions);
    setUserReacted(nextUserReacted);

    localStorage.setItem(`varta_reacts_${articleId}`, JSON.stringify(nextReactions));
    localStorage.setItem(`varta_user_reacts_${articleId}`, JSON.stringify(nextUserReacted));
  };

  if (compact) {
    return (
      <div className="pt-2" onClick={(e) => e.stopPropagation()}>
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
          Reader appreciation:
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={(e) => handleReaction(e, 'uplifted')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              userReacted.uplifted
                ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                : 'bg-stone-100 dark:bg-[#1B2634] text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-[#253446]'
            }`}
            title="Mark as Uplifting"
          >
            <ThumbsUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Uplifting</span>
            <span className="opacity-70 font-mono text-[10px]">({reactions.uplifted})</span>
          </button>

          <button
            onClick={(e) => handleReaction(e, 'inspiring')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              userReacted.inspiring
                ? 'bg-blue-500 text-white font-bold shadow-2xs'
                : 'bg-stone-100 dark:bg-[#1B2634] text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-[#253446]'
            }`}
            title="Mark as Inspiring"
          >
            <Sparkles className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            <span>Inspiring</span>
            <span className="opacity-70 font-mono text-[10px]">({reactions.inspiring})</span>
          </button>

          <button
            onClick={(e) => handleReaction(e, 'heartwarming')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              userReacted.heartwarming
                ? 'bg-rose-500 text-white font-bold shadow-2xs'
                : 'bg-stone-100 dark:bg-[#1B2634] text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-[#253446]'
            }`}
            title="Mark as Heartwarming"
          >
            <Heart className="w-3 h-3 text-rose-500 dark:text-rose-400" />
            <span>Heartwarming</span>
            <span className="opacity-70 font-mono text-[10px]">({reactions.heartwarming})</span>
          </button>
        </div>
      </div>
    );
  }

  // Full detailed display for Article Detail Page
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#141E2B] border border-stone-200/80 dark:border-[#26374A] shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white font-serif-editorial">
            Community Appreciation
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            Signal how this constructive dispatch impacted your outlook
          </p>
        </div>
        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
          Verified Positive
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={(e) => handleReaction(e, 'uplifted')}
          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
            userReacted.uplifted
              ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
              : 'bg-stone-50 dark:bg-[#192535] border-stone-200 dark:border-[#283B50] hover:border-amber-400 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ThumbsUp className={`w-4 h-4 ${userReacted.uplifted ? 'text-amber-600 dark:text-amber-400' : 'text-amber-500'}`} />
            <span className="text-xs font-bold">Uplifting</span>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-black/5 dark:bg-black/20">
            {reactions.uplifted}
          </span>
        </button>

        <button
          onClick={(e) => handleReaction(e, 'inspiring')}
          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
            userReacted.inspiring
              ? 'bg-blue-500/15 border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
              : 'bg-stone-50 dark:bg-[#192535] border-stone-200 dark:border-[#283B50] hover:border-blue-400 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Sparkles className={`w-4 h-4 ${userReacted.inspiring ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500'}`} />
            <span className="text-xs font-bold">Inspiring</span>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-black/5 dark:bg-black/20">
            {reactions.inspiring}
          </span>
        </button>

        <button
          onClick={(e) => handleReaction(e, 'heartwarming')}
          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
            userReacted.heartwarming
              ? 'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200 shadow-xs'
              : 'bg-stone-50 dark:bg-[#192535] border-stone-200 dark:border-[#283B50] hover:border-rose-400 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Heart className={`w-4 h-4 ${userReacted.heartwarming ? 'text-rose-600 dark:text-rose-400' : 'text-rose-500'}`} />
            <span className="text-xs font-bold">Heartwarming</span>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-black/5 dark:bg-black/20">
            {reactions.heartwarming}
          </span>
        </button>
      </div>
    </div>
  );
};

