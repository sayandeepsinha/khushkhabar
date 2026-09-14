import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  RefreshCw,
  Bookmark
} from 'lucide-react';
import type { Article, Category } from '../api/types';
import { 
  getArticles, 
  getFeaturedArticle, 
  getBestNews, 
  getCategories, 
  toggleBookmarkArticle 
} from '../api/news';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PositivityRadar } from '../components/news/PositivityRadar';
import { HeroArticle } from '../components/news/HeroArticle';
import { BestNewsSection } from '../components/news/BestNewsSection';
import { CategoryBar } from '../components/news/CategoryBar';
import { ArticleCard } from '../components/news/ArticleCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SignInBanner } from '../components/auth/SignInBanner';

export const HomePage = () => {
  const { currentUser, openAuthModal } = useAuth();
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [bestArticles, setBestArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Sync state if URL search param updates (e.g. from footer links or navbar)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
  }, [searchParams]);

  // Load initial global data (Featured, Best News, Categories)
  useEffect(() => {
    async function loadInitial() {
      const [featured, best, cats] = await Promise.all([
        getFeaturedArticle(),
        getBestNews(),
        getCategories(),
      ]);
      setFeaturedArticle(featured);
      setBestArticles(best);
      setCategories(cats);
    }
    loadInitial();
  }, []);

  // Fetch articles whenever selected category or search query updates
  useEffect(() => {
    let isCancelled = false;
    async function updateFeed() {
      setLoading(true);
      try {
        const articles = await getArticles({
          categorySlug: selectedCategory,
          searchQuery,
        });
        if (!isCancelled) {
          setLatestArticles(
            articles.filter((a) => a.id !== featuredArticle?.id)
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    updateFeed();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, searchQuery, featuredArticle?.id]);

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setSearchQuery('');
    if (slug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  };

  const handleToggleBookmark = async (articleId: string) => {
    if (!currentUser) {
      openAuthModal("Sign in to save this story to your personal Varta reading list.");
      return;
    }

    const isNowBookmarked = await toggleBookmarkArticle(articleId);

    // Update state locally
    if (featuredArticle && featuredArticle.id === articleId) {
      setFeaturedArticle({ ...featuredArticle, bookmarked: isNowBookmarked });
    }

    setBestArticles((prev) =>
      prev.map((a) =>
        a.id === articleId ? { ...a, bookmarked: isNowBookmarked } : a
      )
    );

    setLatestArticles((prev) =>
      prev.map((a) =>
        a.id === articleId ? { ...a, bookmarked: isNowBookmarked } : a
      )
    );
  };

  // Filtered stories if user clicked "Saved List"
  const displayedArticles = showBookmarksOnly
    ? latestArticles.filter((a) => a.bookmarked)
    : latestArticles;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B131D] text-slate-900 dark:text-[#FDF9F2] flex flex-col transition-colors duration-200">
      {/* Minimalist Navbar */}
      <Navbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      {/* Editorial Masthead with Prominent Brand Logo */}
      <header className="w-full pt-10 pb-8 sm:pt-14 sm:pb-10 text-center">
        <div className="inline-block px-4 max-w-full">
          <img
            src={isDark ? '/varta-logo-dark-transparent.svg' : '/varta-logo-light-transparent.svg'}
            alt="Varta - Good News, Verified"
            className="w-72 sm:w-96 md:w-[540px] lg:w-[620px] max-w-full h-auto object-contain mx-auto transition-all duration-300 drop-shadow-xs hover:opacity-95"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 pt-2 pb-16">
        {/* Lead Feature Article (Twilight Gradient) */}
        {!searchQuery && !showBookmarksOnly && selectedCategory === 'all' && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-xs">
            <HeroArticle
              article={featuredArticle || {
                id: 'lead-default',
                title: 'The city that turned its rooftops into farmland',
                summary: 'In a pioneering municipal initiative, urban rooftops have been converted into self-sustaining farms producing over 40 tons of organic produce annually.',
                category: 'climate',
                categorySlug: 'climate',
                imageUrl: '',
                author: 'Editorial Team',
                readingTimeMinutes: 6,
                positivityScore: 92,
                sourceName: 'Urban Solutions Journal',
                publishedAt: 'Today',
              }}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {/* Positivity Radar (Speedometer Arc Gauge) */}
        {!searchQuery && !showBookmarksOnly && selectedCategory === 'all' && (
          <PositivityRadar score={78} />
        )}

        {/* Best of the Week (3 Columns) */}
        {!searchQuery && !showBookmarksOnly && selectedCategory === 'all' && bestArticles.length > 0 && (
          <BestNewsSection
            articles={bestArticles}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* Category Department Filter Pills */}
        {!showBookmarksOnly && (
          <CategoryBar
            categories={categories}
            selectedCategorySlug={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* Saved Reading List Banner if Active */}
        {showBookmarksOnly && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 text-xs font-bold">
              <Bookmark className="w-4 h-4 fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400" />
              <span>Personal Reading List ({displayedArticles.length} stories)</span>
            </div>
            <button
              onClick={() => setShowBookmarksOnly(false)}
              className="text-xs font-bold text-amber-900 dark:text-amber-300 hover:underline cursor-pointer"
            >
              Show All
            </button>
          </div>
        )}

        {/* Story List Feed (Responsive Multi-Column Card Grid) */}
        <div className="w-full">
          {loading ? (
            <div className="py-20 text-center text-slate-500 dark:text-slate-400">
              <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Loading constructive dispatches...</p>
            </div>
          ) : displayedArticles.length === 0 ? (
            <div className="py-16 text-center px-6 bg-white dark:bg-[#16202B] rounded-2xl border border-[#EAE5DC] dark:border-[#2A3848]">
              <Sparkles className="w-7 h-7 text-amber-500 mx-auto mb-2" />
              <h3 className="font-serif-editorial text-lg font-bold text-slate-800 dark:text-white mb-1">
                {showBookmarksOnly ? 'Your reading list is empty' : 'No matching stories found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4 font-sans-body">
                {showBookmarksOnly
                  ? 'Save any article by clicking the bookmark icon to review it here.'
                  : 'Try adjusting your search terms or select another category above.'}
              </p>
              <button
                onClick={() => {
                  handleSelectCategory('all');
                  setShowBookmarksOnly(false);
                }}
                className="px-4 py-1.5 bg-[#1E242B] dark:bg-amber-500 text-white dark:text-slate-950 rounded-full text-xs font-bold hover:bg-black dark:hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Editorial Footer with Dark Brand Assets */}
      <Footer />

      <SignInBanner />
    </div>
  );
};
