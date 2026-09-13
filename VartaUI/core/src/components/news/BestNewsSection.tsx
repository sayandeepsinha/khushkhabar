import { Flame, Sparkles, Trophy } from 'lucide-react';
import type { Article } from '../../api/types';
import { ArticleCard } from './ArticleCard';

interface BestNewsSectionProps {
  articles: Article[];
  onToggleBookmark: (id: string) => void;
}

export const BestNewsSection = ({
  articles,
  onToggleBookmark,
}: BestNewsSectionProps) => {
  if (articles.length === 0) return null;

  return (
    <section id="best-news" className="mb-14 scroll-mt-24">
      {/* Editorial Header with Gold & Deep Slate */}
      <div className="relative mb-6 p-5 sm:p-6 rounded-2xl bg-[#FCFBF9] border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Excellence</span>
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Highest Impact Stories of the Week</span>
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 hidden sm:inline" />
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Verified breakthroughs and inspirational human milestones evaluated by our editorial panel.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white border border-amber-200 px-3.5 py-1.5 rounded-lg text-xs text-amber-900 font-bold self-start sm:self-auto shrink-0 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>Average Positivity: 98%</span>
        </div>
      </div>

      {/* Grid of Best Articles with Gold Accents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            onToggleBookmark={onToggleBookmark}
            variant="highlight"
            rankIndex={index}
          />
        ))}
      </div>
    </section>
  );
};
