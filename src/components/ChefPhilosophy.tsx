import React from 'react';
import { Flame, Award, Compass, ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/menuData';

interface ChefPhilosophyProps {
  onExploreMenu: () => void;
}

export const ChefPhilosophy: React.FC<ChefPhilosophyProps> = ({ onExploreMenu }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in text-[#181716]">
      {/* Hero Showcase Frame */}
      <div className="relative rounded-lg overflow-hidden border border-[#e8e3d8] shadow-md aspect-[16/9] max-h-[460px] w-full">
        <img
          src={HERO_IMAGE}
          alt="L'Atelier Hearth Open Kitchen"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 max-w-2xl space-y-3 text-white">
          <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#e2b07e]">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Open Fire Gastronomy</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-4xl lg:text-[42px] font-medium leading-tight tracking-tight">
            Crafted Over White Oak Coals, Perfected by Time.
          </h1>
          <p className="text-xs sm:text-sm text-[#e8e4dc] leading-relaxed max-w-xl font-sans-body">
            At L'Atelier Hearth, every dish is an intimate dialogue with primeval fire. Our kitchen is centered around a custom dual-hearth wood oven burning seasoned white oak at 850°F.
          </p>
        </div>
      </div>

      {/* 3 Pillar Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#ffffff] border border-[#e8e3d8] rounded space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded bg-[#faf7f2] border border-[#ded8cc] flex items-center justify-center text-[#9e5a2a]">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#181716]">
            850°F White Oak Fire
          </h3>
          <p className="text-xs text-[#665e54] leading-relaxed font-sans-body">
            We reject electric convection in favor of living, breathing fire. Seasoned white oak imparts delicate aromatic smoke notes without overpowering pristine raw ingredients.
          </p>
        </div>

        <div className="p-6 bg-[#ffffff] border border-[#e8e3d8] rounded space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded bg-[#faf7f2] border border-[#ded8cc] flex items-center justify-center text-[#9e5a2a]">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#181716]">
            Hyper-Local Sourcing
          </h3>
          <p className="text-xs text-[#665e54] leading-relaxed font-sans-body">
            Our heirloom vegetables arrive daily from regenerative family farms within 45 miles. Our Wagyu beef is sourced directly from ethical heritage Japanese bloodlines.
          </p>
        </div>

        <div className="p-6 bg-[#ffffff] border border-[#e8e3d8] rounded space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded bg-[#faf7f2] border border-[#ded8cc] flex items-center justify-center text-[#9e5a2a]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#181716]">
            Live Expo Transparency
          </h3>
          <p className="text-xs text-[#665e54] leading-relaxed font-sans-body">
            Every step—from butcher tempering to hearth sear, delicate plating, and server dispatch—is tracked live through our digital kitchen telemetry system.
          </p>
        </div>
      </div>

      {/* Action Banner */}
      <div className="p-8 bg-[#ffffff] border border-[#e8e3d8] rounded flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif-display text-xl text-[#181716]">
            Ready to Begin Your Culinary Journey?
          </h3>
          <p className="text-xs text-[#665e54]">
            Explore our curated selection of wood-fired mains, fresh pastas, and botanical cocktails.
          </p>
        </div>
        <button
          onClick={onExploreMenu}
          className="py-3 px-6 bg-[#181716] hover:bg-[#2c2927] text-[#ffffff] font-medium text-xs rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <span>Explore Seasonal Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
