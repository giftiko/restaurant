import React from 'react';
import { Flame, Clock, Award, Compass, ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/menuData';

interface ChefPhilosophyProps {
  onExploreMenu: () => void;
}

export const ChefPhilosophy: React.FC<ChefPhilosophyProps> = ({ onExploreMenu }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in text-[#e8e4de]">
      {/* Hero Showcase Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-[#2d2822] shadow-2xl aspect-[16/9] max-h-[480px] w-full">
        <img
          src={HERO_IMAGE}
          alt="L'Atelier Hearth Open Kitchen"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0d] via-[#0f0e0d]/50 to-transparent" />
        
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#c28e58]">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Open Fire Gastronomy</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl font-medium text-[#f3ede4] leading-tight">
            Crafted Over White Oak Coals, Perfected by Time.
          </h1>
          <p className="text-xs sm:text-sm text-[#c4bcaa] leading-relaxed max-w-xl">
            At L'Atelier Hearth, every dish is an intimate dialogue with primeval fire. Our kitchen is centered around a custom dual-hearth wood oven burning white oak at 850°F.
          </p>
        </div>
      </div>

      {/* 3 Pillar Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#161412] border border-[#27231e] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#25201a] border border-[#383126] flex items-center justify-center text-[#c28e58]">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#f3ede4]">
            850°F White Oak Fire
          </h3>
          <p className="text-xs text-[#9c9489] leading-relaxed">
            We reject electric convection in favor of living, breathing fire. Seasoned white oak imparts delicate aromatic smoke notes without overpowering pristine raw ingredients.
          </p>
        </div>

        <div className="p-6 bg-[#161412] border border-[#27231e] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#25201a] border border-[#383126] flex items-center justify-center text-[#c28e58]">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#f3ede4]">
            Hyper-Local Sourcing
          </h3>
          <p className="text-xs text-[#9c9489] leading-relaxed">
            Our heirloom vegetables arrive daily from regenerative family farms within 45 miles. Our Wagyu beef is sourced directly from ethical heritage Japanese bloodlines.
          </p>
        </div>

        <div className="p-6 bg-[#161412] border border-[#27231e] rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#25201a] border border-[#383126] flex items-center justify-center text-[#c28e58]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#f3ede4]">
            Live Expo Transparency
          </h3>
          <p className="text-xs text-[#9c9489] leading-relaxed">
            Every step—from butcher tempering to hearth sear, delicate plating, and server dispatch—is tracked live through our digital kitchen telemetry system.
          </p>
        </div>
      </div>

      {/* Action Banner */}
      <div className="p-8 bg-[#181512] border border-[#2e2922] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif-display text-xl text-[#f3ede4]">
            Ready to Begin Your Culinary Journey?
          </h3>
          <p className="text-xs text-[#9c9489]">
            Explore our curated selection of wood-fired mains, fresh pastas, and botanical cocktails.
          </p>
        </div>
        <button
          onClick={onExploreMenu}
          className="py-3 px-6 bg-[#c28e58] hover:bg-[#d4a373] text-[#0f0e0d] font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
        >
          <span>View Current Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
