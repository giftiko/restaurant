import React, { useState } from 'react';
import { ShoppingBag, Search, MapPin, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeView: 'menu' | 'tracker' | 'philosophy';
  setActiveView: (view: 'menu' | 'tracker' | 'philosophy') => void;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  openSearch: () => void;
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
  openSearch,
  tableNumber,
  setTableNumber,
  activeOrderCount,
}) => {
  const [showTablePicker, setShowTablePicker] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#fbf9f5]/96 backdrop-blur-md border-b border-[#e8e3d8] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* P0: Restaurant Identity - Dominant Visual Anchor */}
        <button
          onClick={() => setActiveView('menu')}
          className="text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9e5a2a] rounded-sm"
        >
          <span className="font-serif-display text-2xl sm:text-[27px] tracking-[0.01em] font-medium text-[#181716] group-hover:text-[#9e5a2a] transition-colors whitespace-nowrap block leading-tight">
            L'Atelier Hearth
          </span>
          <span className="block text-[9px] tracking-[0.28em] uppercase text-[#7a7267] font-sans-body">
            Artisanal Kitchen & Ember Bar
          </span>
        </button>

        {/* Quiet Navigation Links - Plain typography, zero button boxes */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-sans-body">
          <button
            onClick={() => setActiveView('menu')}
            className={`py-1 cursor-pointer transition-colors relative ${
              activeView === 'menu'
                ? 'text-[#181716] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#9e5a2a]'
                : 'text-[#6b6359] hover:text-[#181716]'
            }`}
          >
            Menu
          </button>

          <button
            onClick={() => setActiveView('philosophy')}
            className={`py-1 cursor-pointer transition-colors relative ${
              activeView === 'philosophy'
                ? 'text-[#181716] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#9e5a2a]'
                : 'text-[#6b6359] hover:text-[#181716]'
            }`}
          >
            Hearth Story
          </button>

          <button
            onClick={() => setActiveView('tracker')}
            className={`py-1 cursor-pointer transition-colors relative flex items-center gap-2 ${
              activeView === 'tracker'
                ? 'text-[#181716] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#9e5a2a]'
                : 'text-[#6b6359] hover:text-[#181716]'
            }`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9e5a2a]" />
            <span>Tracking</span>
            {activeOrderCount > 0 && (
              <span className="text-[10px] font-mono text-[#9e5a2a] bg-[#f2ebe0] px-1.5 py-0.2 rounded-xs border border-[#e2d8c7]">
                {activeOrderCount} Live
              </span>
            )}
          </button>
        </nav>

        {/* Utility Controls & Cart Trigger */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          {/* Progressive Disclosure Search Trigger */}
          <button
            onClick={openSearch}
            className="p-2 text-[#6b6359] hover:text-[#181716] hover:bg-[#f3ece2] rounded transition-colors cursor-pointer"
            aria-label="Search menu"
            title="Search dishes & ingredients"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Discreet Table Indicator - Pure utility, minimal styling */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowTablePicker(!showTablePicker)}
              className="text-[#6b6359] hover:text-[#181716] flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#f3ece2] transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#9e5a2a]" />
              <span className="font-medium text-[#181716]">{tableNumber.split(' (')[0]}</span>
              <ChevronDown className="w-3 h-3 text-[#948b80]" />
            </button>

            {showTablePicker && (
              <div className="absolute right-0 mt-2 w-52 p-1.5 bg-[#ffffff] border border-[#e5dfd4] rounded shadow-lg z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#948b80]">
                  Dining Station
                </div>
                {['Table 04 (Main Dining)', 'Table 08 (Garden Veranda)', 'Chef Hearth Counter 02', 'Private Alcove 01', 'Bar Stool 06'].map((tbl) => (
                  <button
                    key={tbl}
                    onClick={() => {
                      setTableNumber(tbl);
                      setShowTablePicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded transition-colors cursor-pointer ${
                      tableNumber === tbl
                        ? 'bg-[#f4eee6] text-[#181716] font-medium'
                        : 'text-[#6b6359] hover:bg-[#faf7f2] hover:text-[#181716]'
                    }`}
                  >
                    {tbl}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ticket / Cart Trigger - Quiet when empty, responsive */}
          <button
            onClick={openCart}
            className={`flex items-center gap-2 py-1.5 px-3 rounded transition-all cursor-pointer ${
              cartCount > 0
                ? 'bg-[#181716] text-[#fbf9f5] hover:bg-[#2c2927] shadow-xs'
                : 'text-[#6b6359] hover:text-[#181716] hover:bg-[#f3ece2]'
            }`}
            aria-label={`View dining ticket (${cartCount} items)`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="font-sans-body text-xs font-medium">Ticket</span>
            <span className="font-mono text-xs tabular-nums opacity-90">({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#ede7dc] bg-[#f7f4ee] px-4 py-2 text-xs">
        <button
          onClick={() => setActiveView('menu')}
          className={`py-1 cursor-pointer transition-colors ${
            activeView === 'menu' ? 'text-[#9e5a2a] font-medium' : 'text-[#6b6359]'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveView('philosophy')}
          className={`py-1 cursor-pointer transition-colors ${
            activeView === 'philosophy' ? 'text-[#9e5a2a] font-medium' : 'text-[#6b6359]'
          }`}
        >
          Hearth Story
        </button>
        <button
          onClick={() => setActiveView('tracker')}
          className={`py-1 flex items-center gap-1.5 cursor-pointer transition-colors ${
            activeView === 'tracker' ? 'text-[#9e5a2a] font-medium' : 'text-[#6b6359]'
          }`}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9e5a2a]" />
          <span>Tracking ({activeOrderCount})</span>
        </button>
      </div>
    </header>
  );
};
