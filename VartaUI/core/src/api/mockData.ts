import type { Article, Category, User, UserPreferences } from './types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-all',
    name: 'All Stories',
    slug: 'all',
    iconName: 'Sparkles',
    description: 'Every uplifting story from around the world',
  },
  {
    id: 'cat-planet',
    name: 'Planet & Climate',
    slug: 'planet',
    iconName: 'Leaf',
    description: 'Reforestation, wildlife comebacks, and clean energy milestones',
    articleCount: 42,
  },
  {
    id: 'cat-science',
    name: 'Science & Discovery',
    slug: 'science',
    iconName: 'FlaskConical',
    description: 'Medical triumphs, space exploration, and human ingenuity',
    articleCount: 38,
  },
  {
    id: 'cat-kindness',
    name: 'Humanity & Kindness',
    slug: 'kindness',
    iconName: 'HeartHandshake',
    description: 'Selfless neighbors, heroic rescues, and uplifting communities',
    articleCount: 56,
  },
  {
    id: 'cat-health',
    name: 'Health & Wellness',
    slug: 'health',
    iconName: 'Activity',
    description: 'Breakthrough treatments, mental health progress, and longevity',
    articleCount: 29,
  },
  {
    id: 'cat-innovation',
    name: 'Positive Tech',
    slug: 'innovation',
    iconName: 'Cpu',
    description: 'Technology built for human flourishing and planetary balance',
    articleCount: 34,
  },
  {
    id: 'cat-community',
    name: 'Culture & Arts',
    slug: 'culture',
    iconName: 'Palette',
    description: 'Inspiring arts, restored heritage, and joyful traditions',
    articleCount: 21,
  },
];

export const MOCK_ARTICLES: Article[] = [];

export const MOCK_USER: User = {
  id: 'usr-varta-01',
  name: 'Prince Sharma',
  email: 'prince@varta.news',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  createdAt: '2025-01-15',
};

export const MOCK_DEFAULT_PREFERENCES: UserPreferences = {
  favoriteCategories: ['planet', 'science', 'kindness', 'innovation', 'health', 'culture'],
  positivityThreshold: 85,
  dailyDigestEmail: true,
  breakingGoodNewsAlerts: false,
  readingLayout: 'comfortable',
  quoteOfTheDay: true,
};

export const MOCK_DAILY_QUOTE = {
  quote: "Kindness is like snow—it beautifies everything it covers.",
  author: "Kahlil Gibran",
  category: "Humanity & Spirit",
};
