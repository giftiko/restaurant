import React, { useState } from 'react';
import { Plus, Check, ArrowRight, Flame } from 'lucide-react';
import { MenuItem } from '../types/menu';

interface FeaturedSpotlightProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const FeaturedSpotlight: React.FC<FeaturedSpotlightProps> = ({
  item,
  onSelect,
  onQuickAdd,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <section className="mb-14 pb-12 border-b border-[#e8e3d8]">
      <div 
        onClick={() => onSelect(item)}
        className="group relative bg-[#ffffff] border border-[#e8e3d8] hover:border-[#d5ccbd] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Dominant Food Photography (7 of 12 columns on desktop) */}
        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#f4efe8]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
          
          <div className="absolute top-4 left-4 bg-[#fdfbf7]/92 backdrop-blur-xs border border-[#e2dacb] text-[#8b4e22] text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-xs">
            Hearth Signature Spotlight
          </div>
        </div>

        {/* Editorial Story & Purchase Column (5 of 12 columns) */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#fcfaf7]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#8a8174] font-medium">
              <Flame className="w-3.5 h-3.5 text-[#9e5a2a] fill-current" />
              <span>White Oak Coals · Chef's Cut</span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-[32px] font-medium text-[#181716] group-hover:text-[#9e5a2a] transition-colors leading-tight">
              {item.name}
            </h2>

            <p className="text-xs sm:text-[13px] text-[#665e54] leading-relaxed font-sans-body">
              {item.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-[#7a7267] font-sans-body pt-1">
              <span>{item.prepTime}</span>
              <span className="text-[#c8c0b2]">·</span>
              <span>{item.calories}</span>
              {item.dietary?.[0] && (
                <>
                  <span className="text-[#c8c0b2]">·</span>
                  <span className="text-[#181716] font-medium">{item.dietary[0]}</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#ede7dc] flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8a8174] block">Course Price</span>
              <span className="font-mono text-xl sm:text-2xl font-semibold text-[#181716] tabular-nums">
                ${item.price.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAdd}
                className={`px-4 py-2.5 text-xs font-medium rounded transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-xs ${
                  justAdded
                    ? 'bg-[#181716] text-[#ffffff]'
                    : 'bg-[#181716] hover:bg-[#2c2927] text-[#fbf9f5]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#e2b07e]" />
                    <span>Added to Ticket</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Order</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onSelect(item)}
                className="hidden sm:flex items-center gap-1 px-3 py-2.5 text-xs text-[#665e54] hover:text-[#181716] transition-colors"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
