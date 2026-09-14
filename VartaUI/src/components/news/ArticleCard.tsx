import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Clock, 
  Volume2, 
  VolumeX, 
  Share2, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import type { Article } from '../../api/types';
import { ReaderReactions } from './ReaderReactions';

interface ArticleCardProps {
  article: Article;
  onToggleBookmark: (id: string) => void;
  variant?: 'standard' | 'highlight';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onToggleBookmark,
  variant = 'standard',
}) => {
  const navigate = useNavigate();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Fallback and authentic image sanitizer
  const displayImage = (() => {
    const t = article.title.toLowerCase();
    if (t.includes('berlin heart') || t.includes('little macs')) {
      return 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80';
    }
    if (article.imageUrl && article.imageUrl.includes('photo-1485827404703-89b55fcc595e')) {
      return 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80';
    }
    return article.imageUrl;
  })();

  const displayCategory = (() => {
    const t = article.title.toLowerCase();
    if (t.includes('berlin heart') || t.includes('little macs')) {
      return 'health';
    }
    return (article.categorySlug || article.category || 'community').toLowerCase();
  })();

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.summary}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const articleUrl = `${window.location.origin}/article/${article.id}`;
    const shareData = {
      title: article.title,
      text: article.summary,
      url: articleUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title} — ${articleUrl}`);
      alert('Story link copied to clipboard!');
    }
  };

  const goToArticle = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <article
      onClick={goToArticle}
      className={`group flex flex-col justify-between rounded-2xl overflow-hidden bg-white dark:bg-[#16202B] border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
        variant === 'highlight'
          ? 'border-amber-400 dark:border-amber-500/40 shadow-xs'
          : 'border-[#EAE5DC] dark:border-[#2A3848] shadow-2xs'
      }`}
    >
      <div>
        {/* Card Thumbnail Media */}
        <div className="w-full aspect-16/10 relative overflow-hidden bg-stone-100 dark:bg-slate-800">
          {displayImage ? (
            <img
              src={displayImage}
              alt={article.title}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-slate-800" />
          )}

          {/* Top-Left: Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 dark:bg-[#16202B]/95 text-slate-800 dark:text-slate-200 shadow-xs border border-stone-200 dark:border-[#2A3848]">
              {displayCategory}
            </span>
          </div>

          {/* Top-Right: Positivity Score */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-xs">
              <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{article.positivityScore || 96}%</span>
            </span>
          </div>

          {/* Audio preview button on thumbnail */}
          <button
            onClick={toggleSpeech}
            className={`absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-600 text-white'
                : 'bg-white/95 dark:bg-[#16202B]/95 text-slate-700 dark:text-slate-200 hover:text-amber-800 dark:hover:text-amber-400 border border-stone-200 dark:border-[#2A3848]'
            }`}
            title={isPlayingAudio ? 'Stop reading' : 'Listen to story'}
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
            <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-400 mb-2 font-sans">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
            <span className="font-medium text-slate-600 dark:text-slate-300">{article.readingTimeMinutes || 3} min read</span>
            <span>•</span>
            <span className="text-slate-400 dark:text-slate-400">{article.publishedAt || 'Today'}</span>
          </div>

          <h3 className="font-serif-editorial text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors mb-2.5">
            {article.title}
          </h3>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-sans-body line-clamp-3 mb-3">
            {article.summary}
          </p>

          {/* Reader Appreciation Reactions (Visible by default) */}
          <ReaderReactions articleId={article.id} compact={true} />
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 pb-4 pt-2.5 border-t border-stone-100 dark:border-[#2A3848] flex items-center justify-between mt-auto bg-[#FAF8F5]/50 dark:bg-[#111A24]/60">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToArticle();
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 transition-colors cursor-pointer"
        >
          <span>Read full story</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleShare}
            className="p-1.5 rounded-md text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Share story"
            aria-label="Share story"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              article.bookmarked
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60'
                : 'text-slate-400 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-slate-800'
            }`}
            title={article.bookmarked ? 'Remove bookmark' : 'Save to reading list'}
            aria-label="Toggle bookmark"
          >
            <Bookmark className={`w-3.5 h-3.5 ${article.bookmarked ? 'fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
};
