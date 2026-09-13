import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Newspaper, 
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
import { SignInBanner } from '../components/auth/SignInBanner';

export const HomePage = () => {
  const { currentUser, openAuthModal } = useAuth();
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [bestArticles, setBestArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onToggleBookmarksFilter={() => setShowBookmarksOnly(!showBookmarksOnly)}
        showingBookmarksOnly={showBookmarksOnly}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {/* Editorial Positivity Radar & Briefing */}
        <PositivityRadar
          onSelectMoodFilter={(filter) => {
            setShowBookmarksOnly(false);
            setSearchQuery(filter);
          }}
          activeFilter={searchQuery}
          totalArticlesCount={latestArticles.length + (featuredArticle ? 1 : 0)}
        />

        {/* Saved List Active Notice */}
        {showBookmarksOnly && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50/80 border border-amber-300 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-900">
              <Bookmark className="w-4 h-4 fill-amber-600 text-amber-600" />
              <span className="text-sm font-bold">Personal Reading List ({displayedArticles.length} stories)</span>
            </div>
            <button
              onClick={() => setShowBookmarksOnly(false)}
              className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
            >
              Show All Stories
            </button>
          </div>
        )}

        {/* Featured Story (Lead Story) - Only shown on default homepage */}
        {!searchQuery && !showBookmarksOnly && selectedCategory === 'all' && featuredArticle && (
          <HeroArticle
            article={featuredArticle}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* Best of the Week Spotlight - Only shown on default homepage */}
        {!searchQuery && !showBookmarksOnly && selectedCategory === 'all' && bestArticles.length > 0 && (
          <BestNewsSection
            articles={bestArticles}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* Category Filter Bar */}
        {!showBookmarksOnly && (
          <CategoryBar
            categories={categories}
            selectedCategorySlug={selectedCategory}
            onSelectCategory={(slug) => {
              setSelectedCategory(slug);
              setSearchQuery('');
            }}
          />
        )}

        {/* Latest News Feed Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EAE5DC]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-slate-800 flex items-center justify-center border border-stone-200">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {showBookmarksOnly
                  ? 'Your Saved Stories'
                  : searchQuery
                  ? `Search Dispatches for "${searchQuery}"`
                  : selectedCategory === 'all'
                  ? 'Latest Positive Stories'
                  : `${categories.find((c) => c.slug === selectedCategory)?.name || 'Filtered Stories'}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
              {displayedArticles.length} dispatches
            </span>
          </div>
        </div>

        {/* Articles Feed */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="font-bold text-slate-700 text-sm">Curating constructive dispatches...</p>
          </div>
        ) : displayedArticles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 max-w-lg mx-auto mb-16 shadow-2xs">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-serif-editorial text-xl font-bold text-slate-800 mb-1">
              {showBookmarksOnly ? 'Your reading list is empty' : 'No matching stories found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4 font-sans-body">
              {showBookmarksOnly
                ? 'Save any article by tapping the bookmark icon to review it here later.'
                : 'Try adjusting your search terms or select another category above.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setShowBookmarksOnly(false);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}

      </main>

      <SignInBanner />
      <Footer />
    </div>
  );
};
