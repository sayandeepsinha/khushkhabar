import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Share2, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { Article } from '../../api/types';
import { ReaderReactions } from './ReaderReactions';

interface BestNewsSectionProps {
  articles: Article[];
  onToggleBookmark: (id: string) => void;
  onSelectArticle?: (article: Article) => void;
}

export const BestNewsSection: React.FC<BestNewsSectionProps> = ({
  articles,
  onToggleBookmark,
  onSelectArticle,
}) => {
  const navigate = useNavigate();
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Take top 3 articles for the 3-column layout
  const topThree = articles.slice(0, 3);

  // Cleanup any ongoing speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (articles.length === 0) return null;

  // Gradient fallbacks matching editorial aesthetics if image fails
  const cardGradients = [
    'linear-gradient(135deg, #1E3A5F 0%, #2A527A 100%)',
    'linear-gradient(135deg, #1B4D3E 0%, #2E7D5E 100%)',
    'linear-gradient(135deg, #614022 0%, #8C5C32 100%)',
  ];

  // Authentic and resilient image resolver
  const getArticleImage = (article: Article) => {
    const t = article.title.toLowerCase();
    if (t.includes('berlin heart') || t.includes('little macs')) {
      return 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80';
    }
    if (t.includes('military standoff') || t.includes('ballots') || t.includes('libyan')) {
      return article.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80';
    }
    if (t.includes('hurricane') || t.includes('el niño') || t.includes('atlantic')) {
      return article.imageUrl || 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1000&q=80';
    }
    if (article.imageUrl && !article.imageUrl.includes('photo-1485827404703-89b55fcc595e')) {
      return article.imageUrl;
    }
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80';
  };

  const toggleSpeech = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (playingAudioId === article.id) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.summary}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
      setPlayingAudioId(article.id);
    }
  };

  const handleShare = (e: React.MouseEvent, article: Article) => {
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

  const goToArticle = (article: Article) => {
    if (onSelectArticle) {
      onSelectArticle(article);
    }
    navigate(`/article/${article.id}`);
  };

  return (
    <section 
      id="best-of-week" 
      className="w-full bg-[#FFFDF9] dark:bg-[#16202B] border border-[#EAE5DC] dark:border-[#2A3848] rounded-2xl p-6 sm:p-8 mb-10 shadow-xs transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100 dark:border-[#223244]">
        <div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Curated Editorial Selection
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Best of the week
          </h2>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-400 font-sans hidden sm:inline-block">
          Highest constructive impact score
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topThree.map((article, index) => {
          const imageUrl = getArticleImage(article);
          const isPlaying = playingAudioId === article.id;
          const categorySlug = (article.categorySlug || article.category || 'humanity').toLowerCase();

          return (
            <div 
              key={article.id} 
              onClick={() => goToArticle(article)}
              className="flex flex-col justify-between bg-white dark:bg-[#111A24] border border-[#EAE5DC]/80 dark:border-[#263546] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div>
                {/* Card Media Header */}
                <div 
                  className="w-full aspect-16/10 relative overflow-hidden bg-slate-800"
                  style={{ background: cardGradients[index % cardGradients.length] }}
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={article.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-103"
                    />
                  )}

                  {/* Top-Left: Category Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/10 uppercase tracking-wide">
                      {categorySlug}
                    </span>
                  </div>

                  {/* Top-Right: Positivity Score */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>{article.positivityScore || 94}%</span>
                    </span>
                  </div>

                  {/* Floating Glassmorphism Action Cluster */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1.5 bg-black/45 backdrop-blur-md rounded-full px-2 py-1 border border-white/15 text-white">
                    {/* Listen Pill */}
                    <button
                      onClick={(e) => toggleSpeech(e, article)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        isPlaying 
                          ? 'bg-rose-600 text-white' 
                          : 'hover:bg-white/20 text-white'
                      }`}
                      title={isPlaying ? 'Stop listening' : 'Listen to story'}
                    >
                      {isPlaying ? <VolumeX className="w-3 h-3 text-amber-300" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isPlaying ? 'Stop' : 'Listen'}</span>
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(article.id);
                      }}
                      className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title={article.bookmarked ? 'Saved in reading list' : 'Save to reading list'}
                      aria-label="Save story"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${article.bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={(e) => handleShare(e, article)}
                      className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="Share dispatch"
                      aria-label="Share story"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Source Link */}
                    {article.sourceUrl && (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                        title="Open verified source dispatch"
                        aria-label="Open original source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-400 mb-2 font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readingTimeMinutes || 4} min read</span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{article.sourceName || 'Constructive Wire'}</span>
                  </div>

                  <h3 className="font-serif-editorial text-base sm:text-lg font-bold text-slate-900 dark:text-[#FDF9F2] leading-snug hover:text-amber-800 dark:hover:text-amber-400 transition-colors mb-2.5">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans-body line-clamp-2 leading-relaxed mb-3">
                    {article.summary}
                  </p>

                  {/* Reader Reactions (Visible by default) */}
                  <ReaderReactions articleId={article.id} compact={true} />
                </div>
              </div>

              {/* Card Footer: Full Story Navigation Button */}
              <div className="px-4 sm:px-5 py-3 border-t border-stone-100 dark:border-[#223244] bg-[#FAF8F5]/50 dark:bg-[#111A24]/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Top Weekly Pick
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToArticle(article);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Full story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
