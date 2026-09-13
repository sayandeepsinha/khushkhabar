import type { Article, Category } from './types';
import { MOCK_ARTICLES, MOCK_CATEGORIES } from './mockData';
import { apiRequest, simulateDelay, USE_MOCK } from './client';

// Local bookmark cache to keep track during UI interactions
const BOOKMARKS_KEY = 'varta_bookmarks';

const getLocalBookmarks = (): string[] => {
  try {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocalBookmarks = (ids: string[]) => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
};

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    await simulateDelay();
    return MOCK_CATEGORIES;
  }
  return apiRequest<Category[]>('/categories');
}

export async function getFeaturedArticle(): Promise<Article | null> {
  if (USE_MOCK) {
    await simulateDelay();
    const bookmarks = getLocalBookmarks();
    const featured = MOCK_ARTICLES.find((a) => a.isFeatured) || MOCK_ARTICLES[0];
    if (!featured) return null;
    return {
      ...featured,
      bookmarked: bookmarks.includes(featured.id),
    };
  }
  return apiRequest<Article>('/articles/featured');
}

export async function getBestNews(): Promise<Article[]> {
  if (USE_MOCK) {
    await simulateDelay();
    const bookmarks = getLocalBookmarks();
    return MOCK_ARTICLES.filter((a) => a.isBestOfWeek).map((a) => ({
      ...a,
      bookmarked: bookmarks.includes(a.id),
    }));
  }
  return apiRequest<Article[]>('/articles/best');
}

export async function getArticles(options?: {
  categorySlug?: string;
  searchQuery?: string;
}): Promise<Article[]> {
  if (USE_MOCK) {
    await simulateDelay();
    const bookmarks = getLocalBookmarks();
    let list = [...MOCK_ARTICLES];

    if (options?.categorySlug && options.categorySlug !== 'all') {
      list = list.filter((a) => a.categorySlug === options.categorySlug);
    }

    if (options?.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    return list.map((a) => ({
      ...a,
      bookmarked: bookmarks.includes(a.id),
    }));
  }

  const params = new URLSearchParams();
  if (options?.categorySlug && options.categorySlug !== 'all') {
    params.set('category', options.categorySlug);
  }
  if (options?.searchQuery) {
    params.set('search', options.searchQuery);
  }
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<Article[]>(`/articles${query}`);
}

export async function toggleBookmarkArticle(articleId: string): Promise<boolean> {
  if (USE_MOCK) {
    await simulateDelay(150);
    const bookmarks = getLocalBookmarks();
    const exists = bookmarks.includes(articleId);
    const updated = exists
      ? bookmarks.filter((id) => id !== articleId)
      : [...bookmarks, articleId];
    saveLocalBookmarks(updated);
    return !exists;
  }

  const res = await apiRequest<{ bookmarked: boolean }>(
    `/articles/${articleId}/bookmark`,
    { method: 'POST' }
  );
  return res.bookmarked;
}
