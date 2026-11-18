import React, { useEffect, useRef } from 'react';
import { Search, X, Utensils } from 'lucide-react';
import { MenuItem } from '../types/menu';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: MenuItem[];
  onSelectDish: (item: MenuItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  results,
  onSelectDish,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-[#ffffff] border border-[#e8e3d8] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#e8e3d8] flex items-center gap-3 bg-[#fbf9f5]">
          <Search className="w-4 h-4 text-[#8a8174] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients, courses, pairings (e.g., Truffle, Wagyu, Barolo)..."
            className="w-full text-sm text-[#181716] bg-transparent placeholder:text-[#948b80] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#8a8174] hover:text-[#181716] text-xs px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8a8174] hover:text-[#181716] hover:bg-[#ede7dc] transition-colors ml-1"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {searchQuery.trim() === '' ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-[#8a8174] uppercase tracking-wider font-medium">
                Popular Discoveries
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['Wagyu Ribeye', 'Handmade Tagliatelle', 'Burrata Pizza', 'Yellowtail Crudo', 'Smoked Cocktail'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="text-xs text-[#665e54] bg-[#f5efe6] hover:bg-[#ede5d8] hover:text-[#181716] px-3 py-1.5 rounded transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Utensils className="w-6 h-6 text-[#b0a596] mx-auto stroke-1" />
              <p className="text-sm font-serif-display text-[#181716]">
                No culinary matches found for "{searchQuery}"
              </p>
              <p className="text-xs text-[#8a8174]">
                Try searching by ingredient, course name, or cooking technique.
              </p>
            </div>
          ) : (
            results.map((dish) => (
              <button
                key={dish.id}
                onClick={() => {
                  onSelectDish(dish);
                  onClose();
                }}
                className="w-full p-3 rounded flex items-center justify-between gap-4 text-left hover:bg-[#faf7f2] transition-colors border border-transparent hover:border-[#e8e3d8] group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-12 h-12 rounded object-cover shrink-0 bg-[#f4efe8]"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#8a8174] block">
                      {dish.categoryId.replace('-', ' ')}
                    </span>
                    <h4 className="font-serif-display text-sm font-medium text-[#181716] group-hover:text-[#9e5a2a] truncate">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-[#665e54] truncate max-w-sm">
                      {dish.description}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-[#181716] tabular-nums shrink-0">
                  ${dish.price.toFixed(2)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
