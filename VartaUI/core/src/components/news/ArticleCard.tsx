import { Bookmark, Clock, Sparkles } from 'lucide-react';
import type { Article } from '../../api/types';

interface ArticleCardProps {
  article: Article;
  onToggleBookmark: (id: string) => void;
  variant?: 'standard' | 'highlight';
}

export const ArticleCard = ({
  article,
  onToggleBookmark,
  variant = 'standard',
}: ArticleCardProps) => {
  return (
    <article
      className={`group flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-300 border ${
        variant === 'highlight'
          ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-200/80 shadow-md hover:shadow-xl hover:border-amber-300'
          : 'bg-white border-[#EAE4D9] shadow-xs hover:shadow-md hover:border-[#D8CFBF]'
      }`}
    >
      <div>
        {/* Card Thumbnail */}
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
              {article.category}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>{article.positivityScore}%</span>
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readingTimeMinutes} min read</span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>

          <h3 className="font-serif-editorial text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors mb-2.5 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 font-sans">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs font-medium text-slate-500 truncate max-w-[170px]">
          By {article.author}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          className={`p-2 rounded-full transition-colors ${
            article.bookmarked
              ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
              : 'text-slate-400 hover:text-amber-600 hover:bg-slate-50'
          }`}
          title={article.bookmarked ? 'Remove bookmark' : 'Bookmark this story'}
          aria-label="Toggle bookmark"
        >
          <Bookmark className={`w-4 h-4 ${article.bookmarked ? 'fill-amber-600' : ''}`} />
        </button>
      </div>
    </article>
  );
};
