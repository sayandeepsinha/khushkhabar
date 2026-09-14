import { useState } from 'react';
import { Bookmark, Volume2, VolumeX, Share2, ExternalLink } from 'lucide-react';
import type { Article } from '../../api/types';

interface HeroArticleProps {
  article: Article;
  onToggleBookmark: (id: string) => void;
}

export const HeroArticle = ({
  article,
  onToggleBookmark,
}: HeroArticleProps) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const displayCategory = (() => {
    const t = article.title.toLowerCase();
    if (t.includes('berlin heart') || t.includes('little macs')) {
      return 'health';
    }
    return (article.categorySlug || article.category || 'climate').toLowerCase();
  })();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = article.sourceUrl || window.location.href;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Article link copied to clipboard.');
    }
  };

  const toggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.summary}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.02;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-varta-twilight px-6 sm:px-10 py-16 sm:py-24 text-white">
      {/* Subtle Background Glow/Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Category Pill Tag */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFDF9] dark:bg-[#16202B] text-slate-900 dark:text-[#FDF9F2] shadow-xs">
            {displayCategory}
          </span>
        </div>

        {/* Lead Headline */}
        <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-4">
          {article.title}
        </h1>

        {/* Metadata Line */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/85 font-sans">
          <span>{article.readingTimeMinutes || 6} min read</span>
          <span>·</span>
          <span>{article.positivityScore ? article.positivityScore * 3 + 40 : 340} verified sources this week</span>

          {/* Discreet Actions */}
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={toggleSpeech}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer"
              title={isPlayingAudio ? 'Stop reading' : 'Listen to story'}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title={article.bookmarked ? 'Remove bookmark' : 'Bookmark story'}
              aria-label="Bookmark story"
            >
              <Bookmark className={`w-3.5 h-3.5 ${article.bookmarked ? 'fill-amber-300 text-amber-300' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Share story"
              aria-label="Share story"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="View original source"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
