import { 
  Sparkles, 
  Leaf, 
  FlaskConical, 
  HeartHandshake, 
  Activity, 
  Cpu, 
  Palette 
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { Category } from '../../api/types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
}

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  Sparkles,
  Leaf,
  FlaskConical,
  HeartHandshake,
  Activity,
  Cpu,
  Palette,
};

export const CategoryBar = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
}: CategoryBarProps) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Filter by Uplifting Topic
        </h3>
        <span className="text-xs text-slate-400">
          Showing curated solutions & progress
        </span>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;
          const IconComponent = ICON_MAP[cat.iconName] || Sparkles;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-amber-300 shadow-md shadow-slate-900/10 scale-102'
                  : 'bg-white hover:bg-amber-50/60 text-slate-700 hover:text-slate-900 border border-[#E7DFD2]'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 ${
                  isSelected ? 'text-amber-400' : 'text-slate-400'
                }`}
              />
              <span>{cat.name}</span>
              {cat.articleCount && (
                <span
                  className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-slate-800 text-amber-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.articleCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
