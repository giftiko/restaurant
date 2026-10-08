import React, { useState } from 'react';
import { Plus, Check, Utensils } from 'lucide-react';
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
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article
      onClick={() => onSelect(item)}
      className="group flex flex-col bg-[#ffffff] border border-[#e8e3d8] hover:border-[#d5ccbd] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Visual Area - Hero of the card (approx 65% visual weight, 4:3 aspect ratio) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4efe8]">
        {!imageFailed ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#f0ebe2]">
            <Utensils className="w-7 h-7 text-[#9e5a2a]/60 mb-2" />
            <span className="font-serif-display text-sm text-[#3d3833]">{item.name}</span>
          </div>
        )}

        {/* Subtle Scrim for Atmospheric Depth without heavy darkening */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />

        {/* Quiet Chef's Signature Badge */}
        {item.isChefSpecial && (
          <div className="absolute top-3 left-3 bg-[#fdfbf7]/92 backdrop-blur-xs border border-[#e2dacb] text-[#8b4e22] text-[9px] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 rounded-xs shadow-2xs">
            Chef's Signature
          </div>
        )}

        {/* Refined Add Button with Hover Expansion & Immediate Clear Feedback */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            onClick={handleQuickAddClick}
            aria-label={`Add ${item.name} to order`}
            className={`min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] px-2.5 py-1.5 rounded flex items-center justify-center gap-1.5 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm ${
              justAdded
                ? 'bg-[#181716] text-[#ffffff] scale-102'
                : 'bg-[#ffffff]/92 text-[#181716] hover:bg-[#181716] hover:text-[#fbf9f5] border border-[#ded8cc]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#e2b07e]" />
                <span className="text-[11px] font-sans-body font-medium">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:group-hover:inline text-[11px] font-sans-body font-medium pr-0.5">
                  Add
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dish Information Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          {/* Category Kicker */}
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#8a8174] font-medium font-sans-body">
            {item.categoryId.replace('-', ' ')}
          </div>

          {/* Dish Name & Price Baseline */}
          <div className="flex items-start justify-between gap-3 pt-0.5">
            <h3 className="font-serif-display text-base sm:text-[18px] font-medium text-[#181716] group-hover:text-[#9e5a2a] transition-colors leading-snug">
              {item.name}
            </h3>
            <span className="font-mono text-[15px] font-semibold text-[#181716] tabular-nums shrink-0">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {/* Editorial Description - 2-3 lines max */}
          <p className="text-xs text-[#665e54] line-clamp-2 leading-relaxed font-sans-body">
            {item.description}
          </p>
        </div>

        {/* Clean Metadata Baseline (Unboxed with subtle separators) */}
        <div className="pt-2.5 border-t border-[#f0ebe2] flex items-center justify-between text-[11px] text-[#7a7267]">
          <div className="flex items-center gap-2">
            <span>{item.prepTime}</span>
            <span aria-hidden="true" className="text-[#c8c0b2]">·</span>
            <span>{item.calories}</span>
            {item.dietary && item.dietary[0] && (
              <>
                <span aria-hidden="true" className="text-[#c8c0b2]">·</span>
                <span className="text-[#3d3833] font-medium">{item.dietary[0]}</span>
              </>
            )}
          </div>
          <span className="text-[11px] font-medium text-[#9e5a2a] group-hover:underline">
            Customize &rarr;
          </span>
        </div>
      </div>
    </article>
  );
};
