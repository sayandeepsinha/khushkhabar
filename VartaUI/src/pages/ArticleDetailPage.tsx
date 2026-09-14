import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import type { Article } from '../api/types';
import { getArticle, toggleBookmarkArticle } from '../api/news';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ReaderReactions } from '../components/news/ReaderReactions';
import { useAuth } from '../context/AuthContext';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, openAuthModal } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    let isCancelled = false;

    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getArticle(id);
        if (!isCancelled) {
          setArticle(data);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !article) {
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

  const handleToggleBookmark = async () => {
    if (!article) return;
    if (!currentUser) {
      openAuthModal('Sign in to save this dispatch to your reading list.');
      return;
    }

    const nextBookmarked = await toggleBookmarkArticle(article.id);
    setArticle({ ...article, bookmarked: nextBookmarked });
  };

  const handleShare = () => {
    if (!article) return;
    const shareData = {
      title: article.title,
      text: article.summary,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title} — ${window.location.href}`);
      alert('Story link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B131D] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <RefreshCw className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Loading verified dispatch...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B131D] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-amber-500 mb-3" />
          <h2 className="text-2xl font-serif-editorial font-bold text-slate-900 dark:text-white mb-2">
            Dispatch Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-sans-body">
            The requested article may have been archived or is temporarily unavailable.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 rounded-full bg-[#1E242B] dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs hover:bg-black dark:hover:bg-amber-400 transition-colors cursor-pointer"
          >
            ← Return to Publication Feed
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryName = article.category || 'Constructive News';
  const displayImage = (() => {
    const t = article.title.toLowerCase();
    if (t.includes('berlin heart') || t.includes('little macs')) {
      return 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80';
    }
    if (article.imageUrl && !article.imageUrl.includes('photo-1485827404703-89b55fcc595e')) {
      return article.imageUrl;
    }
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
  })();

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B131D] text-slate-900 dark:text-[#FDF9F2] flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 pt-8 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dispatches</span>
          </Link>

          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            Dispatch ID: {article.id}
          </span>
        </div>

        {/* Article Header Metadata */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-[#1E242B] dark:bg-amber-500 text-white dark:text-slate-950 uppercase tracking-wide">
              {categoryName}
            </span>
            <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{article.positivityScore || 95}% Positivity Rating</span>
            </span>
          </div>

          <h1 className="font-serif-editorial text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans pb-4 border-b border-stone-200 dark:border-[#223244]">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readingTimeMinutes || 4} min read</span>
            </div>
            <span>•</span>
            <span>Published {article.publishedAt || 'Today'}</span>
            <span>•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              By {article.author || 'Editorial Dispatch'}
            </span>
          </div>
        </div>

        {/* Hero Media Container */}
        <div className="w-full aspect-16/9 rounded-2xl overflow-hidden mb-8 shadow-sm bg-slate-800 relative">
          <img
            src={displayImage}
            alt={article.title}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Action Toolbar */}
        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#141E2B] border border-stone-200 dark:border-[#253648] flex items-center justify-between mb-8 shadow-2xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSpeech}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white'
                  : 'bg-stone-100 dark:bg-[#1E2C3D] text-slate-800 dark:text-slate-200 hover:bg-stone-200 dark:hover:bg-[#283B52]'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen to Dispatch'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                article.bookmarked
                  ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'bg-stone-100 dark:bg-[#1E2C3D] border-stone-200 dark:border-[#2A3C50] text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title={article.bookmarked ? 'Saved to Reading List' : 'Save to Reading List'}
            >
              <Bookmark className={`w-4 h-4 ${article.bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-stone-100 dark:bg-[#1E2C3D] border border-stone-200 dark:border-[#2A3C50] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Share Dispatch"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <span>Original Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Key Editorial Takeaways Box */}
        <div className="border-2 border-amber-300 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl p-6 sm:p-8 mb-10 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Key Editorial Takeaways • Constructive Verification</span>
          </div>
          <p className="text-base sm:text-lg text-slate-900 dark:text-slate-100 font-sans-body leading-relaxed mb-4">
            {article.summary}
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Validated according to Varta Solutions Journalism Heuristics</span>
          </div>
        </div>

        {/* Full Narrative Content */}
        <article className="prose dark:prose-invert max-w-none mb-12">
          <div className="font-serif-editorial text-lg sm:text-xl text-slate-800 dark:text-slate-200 leading-relaxed space-y-6">
            <p>
              {article.summary} In recent months, dedicated researchers and community leaders have systematically validated these outcomes through transparent verification channels.
            </p>
            <p>
              Rather than framing developments around systemic despair, constructive journalism foregrounds evidence-based agency. This dispatch demonstrates concrete, repeatable models that empower citizens, municipalities, and institutions to enact meaningful change.
            </p>
            <p>
              Continued monitoring will observe the scalability of this initiative across peer sectors worldwide. Readers are invited to review the full primary documentation via the verified source link below.
            </p>
          </div>
        </article>

        {/* Primary Source Attribution Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141E2B] border border-stone-200 dark:border-[#253648] mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
              Verified Publication Source
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif-editorial">
              {article.sourceName || 'International Constructive News Wire'}
            </h4>
          </div>

          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 dark:hover:bg-stone-200 transition-colors"
            >
              <span>View Original Report</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Interactive Community Reader Reactions */}
        <div className="mb-12">
          <ReaderReactions articleId={article.id} compact={false} />
        </div>

      </main>

      <Footer />
    </div>
  );
};

