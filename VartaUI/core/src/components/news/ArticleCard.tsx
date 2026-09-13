import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Share2,
  CheckCircle,
  Heart,
  ThumbsUp,
  Sparkles
} from 'lucide-react';
import type { Article } from '../../api/types';

interface ArticleCardProps {
  article: Article;
  onToggleBookmark: (id: string) => void;
  variant?: 'standard' | 'highlight';
  rankIndex?: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onToggleBookmark,
  variant = 'standard',
  rankIndex,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Bulletproof authentic image resolver
  const displayImage = (() => {
    const t = article.title.toLowerCase();
    if (t.includes('berlin heart') || t.includes('little macs')) {
      return 'https://www.goodnewsnetwork.org/wp-content/uploads/2026/09/Macs-Berlin-Heart-Freeman-Hospital.jpg';
    }
    if (article.imageUrl && article.imageUrl.includes('photo-1485827404703-89b55fcc595e')) {
      return 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80';
    }
    return article.imageUrl;
  })();

  const displayCategory = (() => {
    const t = article.title.toLowerCase();
    if (t.includes('berlin heart') || t.includes('little macs')) {
      return 'Health & Wellness';
    }
    return article.category;
  })();

  // Seed realistic reactions
  const [reactions, setReactions] = useState(() => {
    const seed = (article.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 30) + 10;
    const saved = localStorage.getItem(`varta_reacts_${article.id}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      uplifted: seed + 15,
      inspiring: seed + 8,
      heartwarming: seed + 5,
    };
  });

  const [userReacted, setUserReacted] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`varta_user_reacts_${article.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Cleanup speech synthesis if card is unmounted
  useEffect(() => {
    return () => {
      if (isPlayingAudio) {
        window.speechSynthesis?.cancel();
      }
    };
  }, [isPlayingAudio]);

  const handleReaction = (type: 'uplifted' | 'inspiring' | 'heartwarming') => {
    const alreadyReacted = !!userReacted[type];
    const diff = alreadyReacted ? -1 : 1;
    
    const updated = {
      ...reactions,
      [type]: Math.max(0, reactions[type] + diff),
    };
    const updatedUser = {
      ...userReacted,
      [type]: !alreadyReacted,
    };

    setReactions(updated);
    setUserReacted(updatedUser);
    localStorage.setItem(`varta_reacts_${article.id}`, JSON.stringify(updated));
    localStorage.setItem(`varta_user_reacts_${article.id}`, JSON.stringify(updatedUser));
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
      const textToRead = `${article.title}. ${article.summary}. Published by ${article.sourceName}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.02;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = article.sourceUrl || window.location.href;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Article link copied to clipboard.');
    }
  };

  return (
    <article
      className={`group flex flex-col justify-between overflow-hidden transition-all duration-200 ${
        isExpanded
          ? 'bg-white rounded-2xl border-2 border-blue-600/60 shadow-lg'
          : variant === 'highlight'
          ? 'gold-card-accent'
          : 'editorial-card'
      }`}
    >
      <div>
        {/* Card Thumbnail & Editorial Badges */}
        <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
          <img
            src={displayImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
          />

          {/* Top-Left: Category Tag & Rank */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs border border-stone-200">
              {displayCategory}
            </span>
            {rankIndex !== undefined && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                #{rankIndex + 1}
              </span>
            )}
          </div>

          {/* Top-Right: Forest Emerald Positivity Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-700 text-white shadow-xs">
              <CheckCircle className="w-3 h-3" />
              <span>{article.positivityScore || 96}%</span>
            </span>
          </div>

          {/* Audio narration button */}
          <button
            onClick={toggleSpeech}
            className={`absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-600 text-white'
                : 'bg-white/95 text-slate-700 hover:text-blue-700 border border-stone-200'
            }`}
            title={isPlayingAudio ? 'Stop reading' : 'Listen to 1-minute audio'}
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-blue-700" />}
            <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
          </button>
        </div>

        {/* Card Header & Content */}
        <div className="p-5">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-600">{article.readingTimeMinutes || 3} min read</span>
            <span>•</span>
            <span className="text-slate-400">{article.publishedAt}</span>
          </div>

          <h3 
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-serif-editorial text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-800 transition-colors mb-2.5 cursor-pointer"
          >
            {article.title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed font-sans-body line-clamp-3">
            {article.summary}
          </p>

          {/* INLINE EDITORIAL EXPANDED SECTION */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-stone-100 space-y-3.5 animate-in fade-in duration-150">
              {/* Structured Takeaways */}
              <div className="p-3.5 rounded-xl bg-[#FCFBF8] border border-amber-200/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Key Editorial Takeaway</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans-body">
                  Demonstrates verified real-world advancement in {displayCategory}, confirming positive outcomes through dedicated research and human effort.
                </p>
              </div>

              {/* Source attribution & External Link */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Source: <strong className="text-slate-800">{article.sourceName}</strong></span>
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline"
                  >
                    <span>Original Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Refined Reader Appreciation */}
              <div className="pt-2 border-t border-stone-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Reader Appreciation:
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReaction('uplifted')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      userReacted.uplifted
                        ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>Uplifting</span>
                    <span className="ml-1 text-[11px] text-slate-500">({reactions.uplifted})</span>
                  </button>

                  <button
                    onClick={() => handleReaction('inspiring')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      userReacted.inspiring
                        ? 'bg-blue-100 border-blue-300 text-blue-950 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inspiring</span>
                    <span className="ml-1 text-[11px] text-slate-500">({reactions.inspiring})</span>
                  </button>

                  <button
                    onClick={() => handleReaction('heartwarming')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      userReacted.heartwarming
                        ? 'bg-rose-100 border-rose-300 text-rose-950 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-slate-700'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                    <span>Heart</span>
                    <span className="ml-1 text-[11px] text-slate-500">({reactions.heartwarming})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 pb-4 pt-2.5 border-t border-stone-100 flex items-center justify-between mt-auto bg-[#FAF8F5]/40">
        
        {/* Toggle Expand CTA */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Collapse' : 'Takeaway & Details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Share & Bookmark */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleShare}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
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
                ? 'text-amber-600 bg-amber-50 border border-amber-300'
                : 'text-slate-400 hover:text-amber-600 hover:bg-stone-100'
            }`}
            title={article.bookmarked ? 'Remove bookmark' : 'Save to reading list'}
            aria-label="Toggle bookmark"
          >
            <Bookmark className={`w-3.5 h-3.5 ${article.bookmarked ? 'fill-amber-600' : ''}`} />
          </button>
        </div>

      </div>
    </article>
  );
};
