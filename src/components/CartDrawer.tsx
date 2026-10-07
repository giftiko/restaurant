import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Flame, MapPin, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types/menu';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  diningType: 'Dine-In' | 'Takeaway' | 'Delivery';
  setDiningType: (type: 'Dine-In' | 'Takeaway' | 'Delivery') => void;
  tableNumber: string;
  onFireOrder: (orderDetails: {
    guestName: string;
    diningType: 'Dine-In' | 'Takeaway' | 'Delivery';
    tableNumber: string;
    tip: number;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  diningType,
  setDiningType,
  tableNumber,
  onFireOrder,
}) => {
  const [guestName, setGuestName] = useState('Guest Gourmet');
  const [tipRate, setTipRate] = useState<number>(0.18);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const tax = subtotal * 0.08875; // 8.875% tax
  const serviceFee = items.length > 0 ? 3.50 : 0;
  const tipAmount = subtotal * tipRate;
  const grandTotal = subtotal + tax + serviceFee + tipAmount;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onFireOrder({
        guestName,
        diningType,
        tableNumber,
        tip: tipAmount,
      });
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141210] border-l border-[#292520] flex flex-col shadow-2xl text-[#e8e4de]">
          {/* Header */}
          <div className="p-5 border-b border-[#26221d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-lg font-medium text-[#f3ede4]">
                Your Order Ticket
              </span>
              <span className="text-xs text-[#8e8578] font-mono">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#8e8578] hover:text-[#f3ede4] hover:bg-[#201d19] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dining Type Selector */}
          <div className="px-5 py-3 bg-[#191714] border-b border-[#25211c] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#9c9489]">
              <span className="uppercase tracking-wider text-[10px] text-[#7d7568]">Dining Mode</span>
              <span className="font-medium text-[#c28e58]">{tableNumber}</span>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-[#100f0d] p-1 rounded-lg border border-[#2b2721]">
              {(['Dine-In', 'Takeaway', 'Delivery'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDiningType(type)}
                  className={`py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    diningType === type
                      ? 'bg-[#29241d] text-[#f3ede4] border border-[#c28e58]/40 shadow-sm'
                      : 'text-[#8e8578] hover:text-[#e8e4de]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Flame className="w-10 h-10 text-[#544d41] mx-auto stroke-1" />
                <h4 className="font-serif-display text-base text-[#a59d90]">
                  Your hearth ticket is empty
                </h4>
                <p className="text-xs text-[#70685c] max-w-xs mx-auto">
                  Select seasonal dishes from our categorized menu to begin your culinary experience.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 bg-[#1a1714] border border-[#27231d] rounded-xl space-y-2.5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-serif-display text-sm font-medium text-[#f3ede4]">
                        {item.menuItem.name}
                      </h4>
                      <div className="text-[11px] text-[#8e8578] font-mono tabular-nums">
                        ${item.menuItem.price.toFixed(2)} each
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="text-[#6e6659] hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Customizations summary */}
                  {(item.options?.doneness ||
                    (item.options?.selectedAddOns && item.options.selectedAddOns.length > 0) ||
                    item.options?.specialInstructions) && (
                    <div className="text-[11px] text-[#a59d90] space-y-1 bg-[#141210] p-2 rounded-lg border border-[#211e19]">
                      {item.options?.doneness && (
                        <div>• Temperature: {item.options.doneness}</div>
                      )}
                      {item.options?.selectedAddOns?.map((a) => (
                        <div key={a.name} className="flex justify-between">
                          <span>• {a.name}</span>
                          <span className="font-mono text-[#c28e58]">+${a.price.toFixed(2)}</span>
                        </div>
                      ))}
                      {item.options?.specialInstructions && (
                        <div className="text-[#847b6e] italic">
                          "{item.options.specialInstructions}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity Stepper & Line Item Subtotal */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-[#2d2822] rounded bg-[#12110e]">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1.5 text-[#8e8578] hover:text-[#f3ede4] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-xs tabular-nums text-[#f3ede4]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1.5 text-[#8e8578] hover:text-[#f3ede4] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-sm font-semibold text-[#f3ede4] tabular-nums">
                      ${item.itemTotalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Checkout Section */}
          {items.length > 0 && (
            <div className="p-5 bg-[#171512] border-t border-[#29241d] space-y-4">
              {/* Gratuity / Kitchen Tip selector */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-[#8e8578]">
                  <span>Kitchen & Staff Gratuity</span>
                  <span className="font-mono text-[#c28e58]">${tipAmount.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { rate: 0.15, label: '15%' },
                    { rate: 0.18, label: '18%' },
                    { rate: 0.20, label: '20%' },
                    { rate: 0.25, label: '25%' },
                  ].map((tip) => (
                    <button
                      key={tip.label}
                      onClick={() => setTipRate(tip.rate)}
                      className={`py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer border ${
                        tipRate === tip.rate
                          ? 'bg-[#2b251e] border-[#c28e58] text-[#f3ede4]'
                          : 'bg-[#11100e] border-[#29241d] text-[#8e8578] hover:text-[#e8e4de]'
                      }`}
                    >
                      {tip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtotal, tax & fee breakdown */}
              <div className="space-y-1 text-xs text-[#8e8578]">
                <div className="flex justify-between">
                  <span>Culinary Subtotal</span>
                  <span className="font-mono tabular-nums text-[#e8e4de]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax & State Hospitality (8.875%)</span>
                  <span className="font-mono tabular-nums text-[#e8e4de]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wood Hearth Maintenance & Service</span>
                  <span className="font-mono tabular-nums text-[#e8e4de]">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#2a2620] flex justify-between text-sm font-semibold text-[#f3ede4]">
                  <span className="font-serif-display">Total Investment</span>
                  <span className="font-mono text-base text-[#c28e58] tabular-nums">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Fire Order Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#c28e58] hover:bg-[#d4a373] text-[#0f0e0d] font-semibold text-xs sm:text-sm rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Ticket to Hearth...</span>
                ) : (
                  <>
                    <Flame className="w-4 h-4 fill-current" />
                    <span>Fire Order to Kitchen</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
