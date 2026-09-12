import { Bookmark, Clock, Sparkles, Share2 } from 'lucide-react';
import type { Article } from '../../api/types';

interface HeroArticleProps {
  article: Article;
  onToggleBookmark: (id: string) => void;
}

export const HeroArticle = ({
  article,
  onToggleBookmark,
}: HeroArticleProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <section className="mb-14">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#EAE4D9] shadow-sm group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Hero Image Section */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />
            
            {/* Joy Index Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-amber-900 border border-amber-300 shadow-md backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{article.upliftBadge || '99% Joy Index'}</span>
              </span>
            </div>
          </div>

          {/* Hero Content Section */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-white to-amber-50/30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                  {article.category}
                </span>
                <div className="flex items-center space-x-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span className="text-xs font-medium">{article.readingTimeMinutes} min read</span>
                </div>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-4 group-hover:text-amber-800 transition-colors">
                {article.title}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                {article.summary}
              </p>
            </div>

            <div className="pt-6 border-t border-[#EFE9DF] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center font-serif font-bold text-amber-900 text-sm">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{article.author}</p>
                  <p className="text-[11px] text-slate-500">{article.publishedAt} • {article.sourceName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Share story"
                  aria-label="Share story"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onToggleBookmark(article.id)}
                  className={`p-2.5 rounded-full transition-colors ${
                    article.bookmarked
                      ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                      : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                  }`}
                  title={article.bookmarked ? 'Saved to bookmarks' : 'Bookmark story'}
                  aria-label="Bookmark story"
                >
                  <Bookmark className={`w-4 h-4 ${article.bookmarked ? 'fill-amber-600' : ''}`} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
