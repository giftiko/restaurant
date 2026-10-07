import React, { useState } from 'react';
import { Plus, Utensils, Clock, Flame, Sparkles } from 'lucide-react';
import { MenuItem } from '../types/menu';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onSelect,
  onQuickAdd,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group flex flex-col bg-[#161412] hover:bg-[#1b1916] border border-[#26221d] hover:border-[#3d372e] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40"
    >
      {/* Visual Area (approx 65% visual weight, 4:3 aspect ratio) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1f1d19]">
        {!imageFailed ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#24201b] to-[#151311]">
            <Utensils className="w-8 h-8 text-[#c28e58]/50 mb-2" />
            <span className="font-serif-display text-sm text-[#c4bcaa]">{item.name}</span>
          </div>
        )}

        {/* Subtle Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-transparent opacity-80" />

        {/* Quiet top corner badges if Chef Special */}
        {item.isChefSpecial && (
          <div className="absolute top-3 left-3 bg-[#0f0e0d]/85 backdrop-blur-sm border border-[#3b342a] text-[#c28e58] text-[11px] font-medium tracking-wide px-2.5 py-1 rounded">
            Chef's Signature
          </div>
        )}

        {/* Quick Add Overlay Button */}
        <button
          onClick={handleQuickAddClick}
          aria-label={`Add ${item.name} to cart`}
          className={`absolute bottom-3 right-3 p-2.5 rounded-lg backdrop-blur-md transition-all duration-150 cursor-pointer shadow-lg ${
            justAdded
              ? 'bg-emerald-700 text-white scale-105'
              : 'bg-[#0f0e0d]/85 text-[#f3ede4] hover:bg-[#c28e58] hover:text-[#0f0e0d] border border-[#3a342a]'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category kicker */}
          <div className="text-[11px] uppercase tracking-wider text-[#8e8578] font-medium font-sans-body">
            {item.categoryId.replace('-', ' ')}
          </div>

          {/* Dish Name & Price line */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif-display text-base sm:text-lg font-medium text-[#f3ede4] group-hover:text-[#c28e58] transition-colors leading-snug">
              {item.name}
            </h3>
            <span className="font-mono text-base font-semibold text-[#f3ede4] tabular-nums shrink-0">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-[#9c9489] line-clamp-2 leading-relaxed font-sans-body">
            {item.description}
          </p>
        </div>

        {/* Zero-Pill Metadata (Clean text with typographic separators) */}
        <div className="pt-2 border-t border-[#23201b] flex items-center justify-between text-[11px] text-[#7d7568]">
          <div className="flex items-center gap-2">
            <span>{item.prepTime}</span>
            <span aria-hidden="true">·</span>
            <span>{item.calories}</span>
            {item.dietary && item.dietary[0] && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#a59d90]">{item.dietary[0]}</span>
              </>
            )}
          </div>
          <span className="text-[11px] font-medium text-[#c28e58] group-hover:underline">
            Customize &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
