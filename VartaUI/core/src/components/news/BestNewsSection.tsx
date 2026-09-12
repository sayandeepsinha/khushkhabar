import { Award, Flame, Sparkles } from 'lucide-react';
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
    <section id="best-news" className="mb-16 scroll-mt-24">
      {/* Header with Gold Accents */}
      <div className="relative mb-8 pb-4 border-b border-amber-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Curated Excellence</span>
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Best News of the Week</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400 hidden sm:inline" />
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            The highest-rated breakthroughs and most impactful human triumphs rated by our global community.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs text-amber-900 font-semibold self-start sm:self-auto">
          <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>Average Positivity: 98%</span>
        </div>
      </div>

      {/* Grid of Best Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onToggleBookmark={onToggleBookmark}
            variant="highlight"
          />
        ))}
      </div>
    </section>
  );
};
