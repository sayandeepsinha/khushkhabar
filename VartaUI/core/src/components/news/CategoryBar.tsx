import { 
  Sparkles, 
  Leaf, 
  FlaskConical, 
  HeartHandshake, 
  Activity, 
  Cpu, 
  Palette,
  Compass
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
  Compass,
};

export const CategoryBar = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
}: CategoryBarProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-blue-700" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Departments & Topics
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline font-serif-editorial italic">
          Filtered by constructive solutions & progress
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
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-blue-700 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-slate-700 hover:text-slate-900 border border-stone-200 shadow-2xs'
              }`}
            >
              <IconComponent
                className={`w-3.5 h-3.5 ${
                  isSelected ? 'text-amber-300' : 'text-slate-400'
                }`}
              />
              <span>{cat.name}</span>
              {cat.articleCount !== undefined && cat.articleCount > 0 && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected
                      ? 'bg-blue-800 text-blue-100'
                      : 'bg-stone-100 text-slate-500'
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
