import { useState } from 'react';
import { Bookmark, Clock, Sparkles, Share2, Volume2, VolumeX, ExternalLink } from 'lucide-react';
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

  // Fallback and authentic image sanitizer
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

  const handleShare = () => {
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

  const toggleSpeech = () => {
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
    <section className="mb-12">
      <div className="overflow-hidden rounded-2xl bg-white border border-[#EAE5DC] shadow-xs group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Hero Image Section */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] overflow-hidden bg-stone-100">
            <img
              src={displayImage}
              alt={article.title}
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:hidden" />
            
            {/* Spotlight Badges with Gold & Emerald Accents */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-white/95 text-slate-900 border border-amber-300 shadow-xs backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Varta Lead Story</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
                {article.positivityScore || 98}% Verified Positive
              </span>
            </div>

            {/* Mobile Audio button */}
            <button
              onClick={toggleSpeech}
              className="absolute bottom-4 left-4 lg:hidden z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold shadow-md"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen • 1 min'}</span>
            </button>
          </div>

          {/* Hero Content Section */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-stone-100 text-slate-800 border border-stone-200 uppercase tracking-wider">
                  {displayCategory}
                </span>
                
                <div className="flex items-center space-x-3 text-slate-500">
                  <button
                    onClick={toggleSpeech}
                    className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-semibold cursor-pointer border border-blue-200"
                    title={isPlayingAudio ? 'Stop audio' : 'Listen to story'}
                  >
                    {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                    <span>{isPlayingAudio ? 'Stop' : 'Listen • 1 min'}</span>
                  </button>

                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readingTimeMinutes || 3}m read</span>
                  </div>
                </div>
              </div>

              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug mb-3 group-hover:text-blue-900 transition-colors">
                {article.title}
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans-body">
                {article.summary}
              </p>

              {/* Refined Editorial Takeaway */}
              <div className="mb-6 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5">
                <span className="text-sm font-bold text-amber-800">Impact:</span>
                <p className="text-xs text-slate-700 font-medium">
                  Documented real-world triumph illustrating that dedicated medical and community collaboration saves lives.
                </p>
              </div>
            </div>

            {/* Bottom Actions & Author */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{article.author || 'Editorial Correspondent'}</p>
                <p className="text-[11px] text-slate-400">{article.publishedAt} • {article.sourceName}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Share story"
                  aria-label="Share story"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onToggleBookmark(article.id)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    article.bookmarked
                      ? 'text-amber-600 bg-amber-50 border border-amber-300'
                      : 'text-slate-400 hover:text-amber-600 hover:bg-stone-100'
                  }`}
                  title={article.bookmarked ? 'Saved to reading list' : 'Bookmark story'}
                  aria-label="Bookmark story"
                >
                  <Bookmark className={`w-4 h-4 ${article.bookmarked ? 'fill-amber-600' : ''}`} />
                </button>

                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-stone-100 hover:bg-blue-600 hover:text-white transition-colors border border-stone-200"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
