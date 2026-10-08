import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Flame } from 'lucide-react';
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
  diningType,
  setDiningType,
  tableNumber,
  onFireOrder,
}) => {
  const [guestName] = useState('Guest Patron');
  const [tipRate, setTipRate] = useState<number>(0.18);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const tax = subtotal * 0.08875;
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
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/45 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#ffffff] border-l border-[#e8e3d8] flex flex-col shadow-2xl text-[#181716]">
          {/* Header */}
          <div className="p-5 border-b border-[#e8e3d8] flex items-center justify-between bg-[#fbf9f5]">
            <div className="space-y-0.5">
              <span className="font-serif-display text-lg font-medium text-[#181716] block leading-snug">
                Your Dining Ticket
              </span>
              <span className="text-xs text-[#7a7267] font-sans-body">
                {items.reduce((acc, i) => acc + i.quantity, 0)} {items.length === 1 ? 'course' : 'courses'} selected
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#7a7267] hover:text-[#181716] hover:bg-[#ede7dc] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dining Type Selector */}
          <div className="px-5 py-3 bg-[#faf7f2] border-b border-[#e8e3d8] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#665e54]">
              <span className="uppercase tracking-[0.16em] text-[10px] text-[#8a8174] font-medium">Service</span>
              <span className="font-medium text-[#9e5a2a]">{tableNumber.split(' (')[0]}</span>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-[#eee8dd] p-1 rounded">
              {(['Dine-In', 'Takeaway', 'Delivery'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDiningType(type)}
                  className={`py-1.5 text-xs font-sans-body rounded transition-colors cursor-pointer ${
                    diningType === type
                      ? 'bg-[#ffffff] text-[#181716] font-medium shadow-2xs'
                      : 'text-[#665e54] hover:text-[#181716]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#fbf9f5]">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Flame className="w-9 h-9 text-[#c4b9aa] mx-auto stroke-1" />
                <h4 className="font-serif-display text-base text-[#665e54]">
                  Your hearth ticket is empty
                </h4>
                <p className="text-xs text-[#8a8174] max-w-xs mx-auto">
                  Select seasonal courses from our menu to begin your culinary experience.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 bg-[#ffffff] border border-[#e8e3d8] rounded space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-serif-display text-sm font-medium text-[#181716]">
                        {item.menuItem.name}
                      </h4>
                      <div className="text-[11px] text-[#7a7267] font-mono tabular-nums">
                        ${item.menuItem.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="text-[#9e9589] hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Customizations summary */}
                  {(item.options?.doneness ||
                    (item.options?.selectedAddOns && item.options.selectedAddOns.length > 0) ||
                    item.options?.specialInstructions) && (
                    <div className="text-[11px] text-[#665e54] space-y-1 bg-[#faf8f5] p-2 rounded border border-[#ede7dc]">
                      {item.options?.doneness && (
                        <div>• Temperature: {item.options.doneness}</div>
                      )}
                      {item.options?.selectedAddOns?.map((a) => (
                        <div key={a.name} className="flex justify-between">
                          <span>• {a.name}</span>
                          <span className="font-mono text-[#9e5a2a] font-medium">+${a.price.toFixed(2)}</span>
                        </div>
                      ))}
                      {item.options?.specialInstructions && (
                        <div className="text-[#7a7267] italic">
                          "{item.options.specialInstructions}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity Stepper & Line Item Subtotal */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-[#ded8cc] rounded bg-[#ffffff]">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1.5 text-[#665e54] hover:text-[#181716] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-xs tabular-nums text-[#181716] font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1.5 text-[#665e54] hover:text-[#181716] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-sm font-semibold text-[#181716] tabular-nums">
                      ${item.itemTotalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Checkout Section */}
          {items.length > 0 && (
            <div className="p-5 bg-[#faf8f5] border-t border-[#e8e3d8] space-y-4">
              {/* Gratuity / Kitchen Tip selector */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-[#665e54]">
                  <span>Kitchen & Service Staff Gratuity</span>
                  <span className="font-mono text-[#9e5a2a] font-medium">${tipAmount.toFixed(2)}</span>
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
                          ? 'bg-[#181716] border-[#181716] text-[#ffffff]'
                          : 'bg-[#ffffff] border-[#ded8cc] text-[#665e54] hover:text-[#181716]'
                      }`}
                    >
                      {tip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtotal, tax & fee breakdown */}
              <div className="space-y-1 text-xs text-[#665e54]">
                <div className="flex justify-between">
                  <span>Culinary Subtotal</span>
                  <span className="font-mono tabular-nums text-[#181716] font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospitality & Sales Tax (8.875%)</span>
                  <span className="font-mono tabular-nums text-[#181716]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>White Oak Hearth Care & Service</span>
                  <span className="font-mono tabular-nums text-[#181716]">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#e8e3d8] flex justify-between text-sm font-semibold text-[#181716]">
                  <span className="font-serif-display">Total Investment</span>
                  <span className="font-mono text-base text-[#9e5a2a] tabular-nums font-bold">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Fire Order Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#181716] hover:bg-[#2c2927] text-[#ffffff] font-medium text-xs sm:text-sm rounded transition-all duration-150 flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Ticket to Hearth...</span>
                ) : (
                  <>
                    <Flame className="w-4 h-4 fill-current text-[#e2b07e]" />
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
