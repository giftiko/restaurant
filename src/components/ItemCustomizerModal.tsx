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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#141210] border border-[#2b2721] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#e8e4de]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#0f0e0d]/80 text-[#9c9489] hover:text-[#f3ede4] border border-[#302c25] transition-colors cursor-pointer"
          aria-label="Close customization modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Visual Showcase */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#1d1a16] border border-[#26221d]">
            {!imageFailed ? (
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#24201b] to-[#151311]">
                <Utensils className="w-10 h-10 text-[#c28e58]/60 mb-2" />
                <span className="font-serif-display text-base text-[#c4bcaa]">{item.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[11px] uppercase tracking-widest text-[#c28e58] font-medium">
                {item.categoryId.replace('-', ' ')}
              </span>
              <h2 className="font-serif-display text-2xl font-semibold text-[#f3ede4]">
                {item.name}
              </h2>
            </div>
          </div>

          {/* Description & Metadata */}
          <div className="space-y-3">
            <p className="text-sm text-[#9c9489] leading-relaxed">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#7d7568]">
              <span>Preparation: {item.prepTime}</span>
              <span aria-hidden="true">·</span>
              <span>Caloric profile: {item.calories}</span>
              {item.dietary?.map((diet) => (
                <React.Fragment key={diet}>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#a59d90]">{diet}</span>
                </React.Fragment>
              ))}
            </div>

            {item.pairingRecommendation && (
              <div className="p-3 bg-[#1c1915] border border-[#2b2620] rounded-lg flex items-start gap-2.5 text-xs text-[#c4bcaa]">
                <Wine className="w-4 h-4 text-[#c28e58] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#e8e4de]">Sommelier Pairing: </span>
                  {item.pairingRecommendation}
                </div>
              </div>
            )}
          </div>

          {/* Doneness Options (if applicable) */}
          {item.customizationOptions?.doneness && (
            <div className="space-y-2 pt-2 border-t border-[#23201b]">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#a59d90]">
                Temperature / Doneness
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.customizationOptions.doneness.map((done) => (
                  <button
                    key={done}
                    type="button"
                    onClick={() => setSelectedDoneness(done)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors flex items-center justify-between border cursor-pointer ${
                      selectedDoneness === done
                        ? 'bg-[#29231b] border-[#c28e58] text-[#f3ede4]'
                        : 'bg-[#181613] border-[#292520] text-[#8e8578] hover:text-[#e8e4de]'
                    }`}
                  >
                    <span>{done}</span>
                    {selectedDoneness === done && <Check className="w-3.5 h-3.5 text-[#c28e58]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons list */}
          {item.customizationOptions?.addOns && item.customizationOptions.addOns.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#23201b]">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#a59d90]">
                Artisanal Enhancements & Add-ons
              </label>
              <div className="space-y-2">
                {item.customizationOptions.addOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.name === addon.name);
                  return (
                    <button
                      key={addon.name}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-between border cursor-pointer ${
                        isChecked
                          ? 'bg-[#29231b] border-[#c28e58] text-[#f3ede4]'
                          : 'bg-[#181613] border-[#292520] text-[#9c9489] hover:text-[#e8e4de]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#c28e58] border-[#c28e58] text-[#0f0e0d]'
                              : 'border-[#423c33] bg-[#12110f]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-mono tabular-nums text-[#c28e58]">
                        +${addon.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2 pt-2 border-t border-[#23201b]">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#a59d90]">
              Chef Notes or Dietary Adjustments
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., dressing on side, extra crispy crust, no cracked pepper"
              className="w-full px-3 py-2.5 text-xs text-[#e8e4de] bg-[#181613] border border-[#2a2620] rounded-lg placeholder:text-[#655e53] focus:outline-none focus:border-[#c28e58]"
            />
          </div>
        </div>

        {/* Contiguous Sticky Bottom Purchase Module */}
        <div className="p-4 sm:p-5 bg-[#171513] border-t border-[#292520] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#302b24] rounded-lg bg-[#11100e]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-2.5 text-[#9c9489] hover:text-[#f3ede4] disabled:opacity-30 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 font-mono text-xs font-semibold tabular-nums text-[#f3ede4]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2.5 text-[#9c9489] hover:text-[#f3ede4] cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-5 bg-[#c28e58] hover:bg-[#d4a373] text-[#0f0e0d] font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer shadow-lg"
          >
            <span>Add to Order</span>
            <span className="font-mono tabular-nums font-bold">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
