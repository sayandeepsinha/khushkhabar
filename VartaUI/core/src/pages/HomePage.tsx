import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Quote, 
  Newspaper, 
  RefreshCw 
} from 'lucide-react';
import type { Article, Category } from '../api/types';
import { 
  getArticles, 
  getFeaturedArticle, 
  getBestNews, 
  getCategories, 
  toggleBookmarkArticle 
} from '../api/news';
import { MOCK_DAILY_QUOTE } from '../api/mockData';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroArticle } from '../components/news/HeroArticle';
import { BestNewsSection } from '../components/news/BestNewsSection';
import { CategoryBar } from '../components/news/CategoryBar';
import { ArticleCard } from '../components/news/ArticleCard';

export const HomePage = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [bestArticles, setBestArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        
        {/* Daily Inspiration / Quote of the Day Banner */}
        <section className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-100/60 via-amber-50 to-white border border-amber-200/70 shadow-xs">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                <Quote className="w-5 h-5 fill-amber-700/20" />
              </div>
              <div>
                <p className="font-serif-editorial text-base sm:text-lg italic text-slate-800 font-medium">
                  "{MOCK_DAILY_QUOTE.quote}"
                </p>
                <p className="text-xs text-amber-900/80 font-semibold tracking-wide uppercase mt-0.5">
                  — {MOCK_DAILY_QUOTE.author} • {MOCK_DAILY_QUOTE.category}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Restoring your faith in humanity, one story at a time.</span>
            </div>
          </div>
        </section>

        {/* Featured Story (Hero) */}
        {!searchQuery && selectedCategory === 'all' && featuredArticle && (
          <HeroArticle
            article={featuredArticle}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* Best of the Week Spotlight */}
        {!searchQuery && selectedCategory === 'all' && bestArticles.length > 0 && (
          <BestNewsSection
            articles={bestArticles}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* Category Filter Bar */}
        <CategoryBar
          categories={categories}
          selectedCategorySlug={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Latest News Feed Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E7DFD2]">
          <div className="flex items-center space-x-2.5">
            <Newspaper className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif-editorial text-2xl font-bold text-slate-900 tracking-tight">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedCategory === 'all'
                ? 'Latest Positive Stories'
                : `${categories.find((c) => c.slug === selectedCategory)?.name || 'Filtered Stories'}`}
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{latestArticles.length}</span>
            <span>stories curated</span>
          </div>
        </div>

        {/* Articles Feed */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-amber-500" />
            <p className="font-medium">Fetching uplifting stories...</p>
          </div>
        ) : latestArticles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-[#DDD5C7] p-8">
            <Sparkles className="w-10 h-10 mx-auto text-amber-400 mb-3" />
            <h3 className="font-serif-editorial text-xl font-bold text-slate-800 mb-1">
              No matching positive stories found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
              Try adjusting your search query or switching to another uplifting topic category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {latestArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
