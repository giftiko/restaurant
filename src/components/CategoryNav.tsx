import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/menuData';
import { CategoryId } from '../types/menu';

interface CategoryNavProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dietaryFilter: string | null;
  setDietaryFilter: (filter: string | null) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  dietaryFilter,
  setDietaryFilter,
}) => {
  return (
    <div className="sticky top-20 md:top-20 z-30 bg-[#0f0e0d]/90 backdrop-blur-md border-b border-[#24211c] py-3 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Top line: Search and Dietary Toggles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#7d7568] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, pairings..."
              className="w-full pl-9 pr-9 py-2 text-xs text-[#e8e4de] bg-[#1a1815] border border-[#2e2a24] rounded-lg placeholder:text-[#6e675b] focus:outline-none focus:border-[#c28e58] focus:ring-1 focus:ring-[#c28e58] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7568] hover:text-[#e8e4de]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dietary Filters (Interactive Segmented controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] text-[#7d7568] uppercase tracking-wider mr-1 shrink-0 hidden lg:inline">
              Dietary:
            </span>
            {[
              { id: null, label: 'All Diets' },
              { id: 'Vegetarian', label: 'Vegetarian' },
              { id: 'Gluten-Free', label: 'Gluten-Free' },
              { id: 'Chef-Special', label: 'Chef Specials' },
            ].map((diet) => {
              const active = dietaryFilter === diet.id;
              return (
                <button
                  key={diet.label}
                  onClick={() => setDietaryFilter(diet.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                    active
                      ? 'bg-[#2a241c] text-[#f3ede4] border-[#c28e58]'
                      : 'bg-[#151412] text-[#8e8578] border-[#292520] hover:text-[#e8e4de] hover:border-[#38332c]'
                  }`}
                >
                  {diet.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as CategoryId)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#c28e58] text-[#0f0e0d] font-semibold shadow-sm'
                    : 'bg-[#181614] text-[#a59d90] hover:bg-[#221f1a] hover:text-[#f3ede4]'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
