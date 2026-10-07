import React from 'react';
import { ShoppingBag, Flame, Clock, Sparkles, MapPin, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeView: 'menu' | 'tracker' | 'philosophy';
  setActiveView: (view: 'menu' | 'tracker' | 'philosophy') => void;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  diningType: 'Dine-In' | 'Takeaway' | 'Delivery';
  tableNumber: string;
  setTableNumber: (table: string) => void;
  activeOrderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  cartCount,
  cartTotal,
  openCart,
  diningType,
  tableNumber,
  setTableNumber,
  activeOrderCount,
}) => {
  const [showTablePicker, setShowTablePicker] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f0e0d]/95 backdrop-blur-md border-b border-[#25221d] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single element wordmark (Display Font) */}
        <button
          onClick={() => setActiveView('menu')}
          className="text-left group cursor-pointer"
        >
          <span className="font-serif-display text-2xl sm:text-3xl tracking-wide font-medium text-[#f3ede4] group-hover:text-[#c28e58] transition-colors whitespace-nowrap">
            L'Atelier Hearth
          </span>
          <span className="block text-[10px] tracking-[0.2em] uppercase text-[#8e8578] font-sans-body">
            Artisanal Kitchen & Ember Bar
          </span>
        </button>

        {/* Zone 2: 4 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveView('menu')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer ${
              activeView === 'menu'
                ? 'text-[#f3ede4] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c28e58]'
                : 'text-[#9c9489] hover:text-[#f3ede4]'
            }`}
          >
            Menu Catalog
          </button>

          <button
            onClick={() => setActiveView('tracker')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer flex items-center gap-2 ${
              activeView === 'tracker'
                ? 'text-[#f3ede4] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c28e58]'
                : 'text-[#9c9489] hover:text-[#f3ede4]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c28e58] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c28e58]"></span>
            </span>
            <span>Live Order Tracking</span>
            {activeOrderCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-[#25221d] text-[#c28e58] rounded border border-[#3b362f]">
                {activeOrderCount} Active
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('philosophy')}
            className={`transition-colors whitespace-nowrap pb-1 relative cursor-pointer ${
              activeView === 'philosophy'
                ? 'text-[#f3ede4] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c28e58]'
                : 'text-[#9c9489] hover:text-[#f3ede4]'
            }`}
          >
            Hearth Philosophy
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions (Table Selector + Cart Button) */}
        <div className="flex items-center gap-3">
          {/* Table / Dining Station Pill Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTablePicker(!showTablePicker)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#c4bcaa] bg-[#1a1816] hover:bg-[#23201d] border border-[#2d2924] rounded-lg transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c28e58]" />
              <span className="truncate max-w-[120px]">{diningType}: {tableNumber}</span>
              <ChevronDown className="w-3 h-3 text-[#7d7568]" />
            </button>

            {showTablePicker && (
              <div className="absolute right-0 mt-2 w-56 p-2 bg-[#191715] border border-[#2e2a25] rounded-xl shadow-2xl z-50 text-xs">
                <div className="p-2 text-[11px] font-semibold uppercase tracking-wider text-[#8e8578]">
                  Select Seating Area
                </div>
                {['Table 04 (Main Dining)', 'Table 08 (Garden Veranda)', 'Chef Hearth Counter 02', 'Private Alcove 01', 'Bar Stool 06'].map((tbl) => (
                  <button
                    key={tbl}
                    onClick={() => {
                      setTableNumber(tbl);
                      setShowTablePicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      tableNumber === tbl
                        ? 'bg-[#2b2620] text-[#f3ede4] font-medium'
                        : 'text-[#9c9489] hover:bg-[#201d19] hover:text-[#e8e4de]'
                    }`}
                  >
                    {tbl}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#0f0e0d] bg-[#c28e58] hover:bg-[#d4a373] active:scale-[0.98] rounded-lg transition-all duration-150 cursor-pointer shadow-md"
            aria-label={`Open shopping cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-semibold whitespace-nowrap">Cart</span>
            {cartCount > 0 ? (
              <span className="font-mono tabular-nums font-semibold bg-[#0f0e0d] text-[#f3ede4] px-1.5 py-0.5 rounded text-[11px]">
                {cartCount} · ${cartTotal.toFixed(2)}
              </span>
            ) : (
              <span className="text-[11px] opacity-80">(0)</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#23201d] bg-[#141210] px-4 py-2 text-xs">
        <button
          onClick={() => setActiveView('menu')}
          className={`py-1 cursor-pointer ${
            activeView === 'menu' ? 'text-[#c28e58] font-medium' : 'text-[#8e8578]'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveView('tracker')}
          className={`py-1 flex items-center gap-1.5 cursor-pointer ${
            activeView === 'tracker' ? 'text-[#c28e58] font-medium' : 'text-[#8e8578]'
          }`}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c28e58]"></span>
          <span>Order Tracker ({activeOrderCount})</span>
        </button>
        <button
          onClick={() => setActiveView('philosophy')}
          className={`py-1 cursor-pointer ${
            activeView === 'philosophy' ? 'text-[#c28e58] font-medium' : 'text-[#8e8578]'
          }`}
        >
          Hearth Story
        </button>
      </div>
    </header>
  );
};
