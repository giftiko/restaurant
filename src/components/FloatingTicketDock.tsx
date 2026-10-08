import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FloatingTicketDockProps {
  itemCount: number;
  totalPrice: number;
  onOpenTicket: () => void;
}

export const FloatingTicketDock: React.FC<FloatingTicketDockProps> = ({
  itemCount,
  totalPrice,
  onOpenTicket,
}) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
      <button
        onClick={onOpenTicket}
        className="group flex items-center gap-3.5 pl-4 pr-5 py-3 bg-[#181716] text-[#fbf9f5] rounded-full shadow-2xl hover:bg-[#2c2927] transition-all duration-200 cursor-pointer border border-[#3b3632] hover:scale-102"
        aria-label={`View dining ticket with ${itemCount} courses`}
      >
        <div className="w-7 h-7 rounded-full bg-[#34302c] flex items-center justify-center text-[#e2b07e]">
          <ShoppingBag className="w-3.5 h-3.5" />
        </div>

        <div className="text-left font-sans-body">
          <div className="text-[11px] text-[#b8afa3] leading-none">
            Dining Ticket · {itemCount} {itemCount === 1 ? 'course' : 'courses'}
          </div>
          <div className="font-mono text-sm font-semibold tabular-nums text-[#ffffff]">
            ${totalPrice.toFixed(2)}
          </div>
        </div>

        <div className="pl-2 border-l border-[#3a3530] flex items-center gap-1 text-xs font-medium text-[#e2b07e] group-hover:translate-x-0.5 transition-transform">
          <span>Review</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
