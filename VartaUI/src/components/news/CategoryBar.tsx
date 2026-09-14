import type { Category } from '../../api/types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryBar = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
}: CategoryBarProps) => {
  // Use categories from backend or fallback to mockup defaults
  const displayCategories = categories && categories.length > 0
    ? categories.map((c) => ({
        slug: c.slug,
        name: c.name.toLowerCase(),
      }))
    : [
        { slug: 'all', name: 'all' },
        { slug: 'climate', name: 'climate' },
        { slug: 'health', name: 'health' },
        { slug: 'community', name: 'community' },
        { slug: 'science', name: 'science' },
        { slug: 'culture', name: 'culture' },
      ];

  return (
    <div id="topics-section" className="w-full pb-6">
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto scrollbar-none py-1">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;

          return (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 ${
                isSelected
                  ? 'bg-[#1E242B] dark:bg-amber-500 text-white dark:text-slate-950 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
