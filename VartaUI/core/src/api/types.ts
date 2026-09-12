export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  categorySlug: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl?: string;
  author: string;
  publishedAt: string;
  readingTimeMinutes: number;
  positivityScore: number; // 0 to 100
  upliftBadge?: string; // e.g. "98% Inspiring", "Breakthrough", "Acts of Kindness"
  isFeatured?: boolean;
  isBestOfWeek?: boolean;
  bookmarked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  articleCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserPreferences {
  favoriteCategories: string[]; // slugs
  positivityThreshold: number; // e.g. 70 means only show articles with >= 70 score
  dailyDigestEmail: boolean;
  breakingGoodNewsAlerts: boolean;
  readingLayout: 'comfortable' | 'compact';
  quoteOfTheDay: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

