import React, { useState } from 'react';
import { SlidersHorizontal, Check, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../data/menuData';
import { CategoryId } from '../types/menu';

interface CategoryNavProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  dietaryFilter: string | null;
  setDietaryFilter: (filter: string | null) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  dietaryFilter,
  setDietaryFilter,
}) => {
  const [showDietaryMenu, setShowDietaryMenu] = useState(false);

  const getChapterNumber = (id: string, index: number) => {
    if (id === 'all') return 'ALL';
    const num = index < 10 ? `0${index}` : `${index}`;
    return num;
  };

  return (
    <div className="sticky top-[72px] z-30 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#e8e3d8] transition-colors py-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Editorial Content Navigation: Chapter Index (No bulky pill buttons) */}
        <nav 
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-1"
          aria-label="Menu courses"
        >
          {CATEGORIES.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            const chapter = getChapterNumber(cat.id, idx);

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as CategoryId)}
                className={`group text-left whitespace-nowrap cursor-pointer transition-colors relative pb-1 ${
                  isSelected
                    ? 'text-[#181716] font-medium'
                    : 'text-[#6b6359] hover:text-[#181716]'
                }`}
              >
                <div className="flex items-baseline gap-1.5 text-xs sm:text-[13px] tracking-wide">
                  <span className="font-mono text-[10px] text-[#9e5a2a] opacity-80">
                    {chapter}
                  </span>
                  <span>{cat.label}</span>
                </div>
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#9e5a2a] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Progressive Disclosure: Single quiet Dietary Filter popover */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowDietaryMenu(!showDietaryMenu)}
            className={`flex items-center gap-1.5 text-xs py-1 px-2.5 rounded transition-colors cursor-pointer border ${
              dietaryFilter
                ? 'bg-[#f4eee6] border-[#cfc4b2] text-[#181716] font-medium'
                : 'bg-transparent border-[#e5dfd4] text-[#6b6359] hover:text-[#181716] hover:border-[#d5ccbd]'
            }`}
            aria-expanded={showDietaryMenu}
            aria-label="Filter by dietary preferences"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#9e5a2a]" />
            <span className="hidden sm:inline">Dietary:</span>
            <span>{dietaryFilter ? dietaryFilter.replace('-', ' ') : 'All'}</span>
            <ChevronDown className="w-3 h-3 text-[#8a8174]" />
          </button>

          {showDietaryMenu && (
            <div className="absolute right-0 mt-2 w-48 p-1.5 bg-[#ffffff] border border-[#e5dfd4] rounded shadow-xl z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#8a8174]">
                Dietary Preferences
              </div>
              {[
                { id: null, label: 'All Offerings' },
                { id: 'Vegetarian', label: 'Vegetarian Only' },
                { id: 'Gluten-Free', label: 'Gluten-Free Only' },
                { id: 'Chef-Special', label: "Chef's Specials" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setDietaryFilter(opt.id);
                    setShowDietaryMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors cursor-pointer ${
                    dietaryFilter === opt.id
                      ? 'bg-[#f4eee6] text-[#181716] font-medium'
                      : 'text-[#6b6359] hover:bg-[#faf7f2] hover:text-[#181716]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {dietaryFilter === opt.id && (
                    <Check className="w-3.5 h-3.5 text-[#9e5a2a]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
