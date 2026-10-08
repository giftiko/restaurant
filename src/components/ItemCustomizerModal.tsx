import React, { useState } from 'react';
import { X, Plus, Minus, Check, Wine, Utensils } from 'lucide-react';
import { MenuItem, CartItemOption } from '../types/menu';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, options: CartItemOption) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedDoneness, setSelectedDoneness] = useState<string>(
    item.customizationOptions?.doneness ? item.customizationOptions.doneness[0] : ''
  );
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  const toggleAddOn = (addon: { name: string; price: number }) => {
    if (selectedAddOns.some((a) => a.name === addon.name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const singleItemTotal = item.price + addOnsTotal;
  const totalPrice = singleItemTotal * quantity;

  const handleConfirm = () => {
    onAddToCart(item, quantity, {
      doneness: selectedDoneness || undefined,
      selectedAddOns,
      specialInstructions: specialInstructions.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-xl max-h-[90vh] bg-[#ffffff] border border-[#e8e3d8] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#181716]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#ffffff]/90 text-[#665e54] hover:text-[#181716] border border-[#ded8cc] transition-colors cursor-pointer shadow-xs"
          aria-label="Close customization modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Culinary Customization Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-7 space-y-6">
          {/* Visual Showcase Frame */}
          <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-[#f4efe8] border border-[#e8e3d8]">
            {!imageFailed ? (
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#f0ebe2]">
                <Utensils className="w-9 h-9 text-[#9e5a2a]/60 mb-2" />
                <span className="font-serif-display text-base text-[#3d3833]">{item.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#e2b07e] font-medium block mb-1">
                {item.categoryId.replace('-', ' ')}
              </span>
              <h2 className="font-serif-display text-2xl font-medium tracking-tight">
                {item.name}
              </h2>
            </div>
          </div>

          {/* Description & Preparation Metadata */}
          <div className="space-y-3">
            <p className="text-xs sm:text-[13px] text-[#665e54] leading-relaxed font-sans-body">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#7a7267] font-sans-body">
              <span>Preparation: {item.prepTime}</span>
              <span aria-hidden="true" className="text-[#c8c0b2]">·</span>
              <span>Caloric profile: {item.calories}</span>
              {item.dietary?.map((diet) => (
                <React.Fragment key={diet}>
                  <span aria-hidden="true" className="text-[#c8c0b2]">·</span>
                  <span className="text-[#3d3833] font-medium">{diet}</span>
                </React.Fragment>
              ))}
            </div>

            {item.pairingRecommendation && (
              <div className="p-3 bg-[#faf7f2] border border-[#e8e3d8] rounded flex items-start gap-2.5 text-xs text-[#524a40]">
                <Wine className="w-4 h-4 text-[#9e5a2a] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#181716]">Sommelier Cellar Pairing: </span>
                  {item.pairingRecommendation}
                </div>
              </div>
            )}
          </div>

          {/* Doneness Options (if applicable) */}
          {item.customizationOptions?.doneness && (
            <div className="space-y-2 pt-2 border-t border-[#f0ebe2]">
              <label className="text-[11px] uppercase tracking-[0.16em] font-medium text-[#665e54] block">
                Preparation Temperature / Doneness
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.customizationOptions.doneness.map((done) => (
                  <button
                    key={done}
                    type="button"
                    onClick={() => setSelectedDoneness(done)}
                    className={`px-3 py-2 text-xs font-sans-body rounded text-left transition-colors flex items-center justify-between border cursor-pointer ${
                      selectedDoneness === done
                        ? 'bg-[#f4ede3] border-[#9e5a2a] text-[#181716] font-medium'
                        : 'bg-[#faf8f5] border-[#ded8cc] text-[#665e54] hover:bg-[#f2ece2] hover:text-[#181716]'
                    }`}
                  >
                    <span>{done}</span>
                    {selectedDoneness === done && <Check className="w-3.5 h-3.5 text-[#9e5a2a]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons List */}
          {item.customizationOptions?.addOns && item.customizationOptions.addOns.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#f0ebe2]">
              <label className="text-[11px] uppercase tracking-[0.16em] font-medium text-[#665e54] block">
                Artisanal Enhancements
              </label>
              <div className="space-y-2">
                {item.customizationOptions.addOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.name === addon.name);
                  return (
                    <button
                      key={addon.name}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`w-full px-3.5 py-2.5 text-xs font-sans-body rounded transition-colors flex items-center justify-between border cursor-pointer ${
                        isChecked
                          ? 'bg-[#f4ede3] border-[#9e5a2a] text-[#181716]'
                          : 'bg-[#faf8f5] border-[#ded8cc] text-[#665e54] hover:bg-[#f2ece2] hover:text-[#181716]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#9e5a2a] border-[#9e5a2a] text-white'
                              : 'border-[#c8c0b2] bg-[#ffffff]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-mono tabular-nums text-[#9e5a2a] font-medium">
                        +${addon.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Dietary Instructions */}
          <div className="space-y-2 pt-2 border-t border-[#f0ebe2]">
            <label className="text-[11px] uppercase tracking-[0.16em] font-medium text-[#665e54] block">
              Chef Dietary Notes / Accommodations
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., dressing served on side, no cracked pepper"
              className="w-full px-3 py-2 text-xs text-[#181716] bg-[#faf8f5] border border-[#ded8cc] rounded placeholder:text-[#9e9589] focus:outline-none focus:border-[#9e5a2a]"
            />
          </div>
        </div>

        {/* Contiguous Sticky Bottom Purchase Module */}
        <div className="p-4 sm:p-5 bg-[#faf8f5] border-t border-[#e8e3d8] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#ded8cc] rounded bg-[#ffffff]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-2 text-[#665e54] hover:text-[#181716] disabled:opacity-30 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 font-mono text-xs font-semibold tabular-nums text-[#181716]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-[#665e54] hover:text-[#181716] cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-5 bg-[#181716] hover:bg-[#2c2927] text-[#fbf9f5] font-medium text-xs sm:text-sm rounded transition-colors flex items-center justify-between cursor-pointer shadow-sm"
          >
            <span>Add to Order Ticket</span>
            <span className="font-mono tabular-nums font-semibold">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
