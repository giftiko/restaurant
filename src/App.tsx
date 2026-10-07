import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { MenuItemCard } from './components/MenuItemCard';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { ChefPhilosophy } from './components/ChefPhilosophy';
import { MENU_ITEMS, INITIAL_ACTIVE_ORDER, HERO_IMAGE } from './data/menuData';
import { MenuItem, CategoryId, CartItem, CartItemOption, Order, OrderStage, KitchenLogEvent } from './types/menu';
import { ShoppingBag, Flame, Sparkles, Check, Clock, Utensils } from 'lucide-react';

const ORDER_STAGES: OrderStage[] = [
  'received',
  'mise_en_place',
  'wood_fired_hearth',
  'plating_qc',
  'ready_for_service',
  'completed',
];

const STAGE_LOGS: Record<OrderStage, { title: string; detail: string; station: string }> = {
  received: {
    title: 'Order Ticket Confirmed & Distributed',
    detail: 'Ticket acknowledged by Kitchen Expo. Station prep commenced.',
    station: 'Central Pass & Expo',
  },
  mise_en_place: {
    title: 'Mise en Place & Precision Prep',
    detail: 'Butcher tempering cuts, fresh herbs harvested from culinary garden.',
    station: 'Cold Larder Station',
  },
  wood_fired_hearth: {
    title: 'Fired over 840°F White Oak Embers',
    detail: 'Proteins seared over open fire bed; artisanal crusts blistered in wood oven.',
    station: 'White Oak Hearth Station',
  },
  plating_qc: {
    title: 'Executive Chef Plating Inspection',
    detail: 'Micro herbs delicately placed, temperature probe verified, finishing jus drizzled.',
    station: 'Chef Inspection Pass',
  },
  ready_for_service: {
    title: 'Dispatched for Table Service',
    detail: 'Dedicated table runner carrying dish cloaks to dining room.',
    station: 'Service Floor Expedition',
  },
  completed: {
    title: 'Order Delivered & Enjoyed',
    detail: 'Guests served at table. Culinary journey underway.',
    station: 'Table Hospitality',
  },
};

export default function App() {
  const [activeView, setActiveView] = useState<'menu' | 'tracker' | 'philosophy'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  const [diningType, setDiningType] = useState<'Dine-In' | 'Takeaway' | 'Delivery'>('Dine-In');
  const [tableNumber, setTableNumber] = useState('Table 08 (Garden Veranda)');

  const [orders, setOrders] = useState<Order[]>([INITIAL_ACTIVE_ORDER]);
  const [activeOrderId, setActiveOrderId] = useState<string>(INITIAL_ACTIVE_ORDER.id);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered menu items
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
      return false;
    }
    if (dietaryFilter) {
      if (dietaryFilter === 'Chef-Special' && !item.isChefSpecial) {
        return false;
      }
      if (dietaryFilter !== 'Chef-Special' && !item.dietary?.includes(dietaryFilter as any)) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchPairing = item.pairingRecommendation?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchPairing) return false;
    }
    return true;
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.itemTotalPrice, 0);

  // Cart operations
  const handleQuickAdd = (item: MenuItem) => {
    const existingIndex = cartItems.findIndex(
      (c) => c.menuItem.id === item.id && (!c.options?.selectedAddOns || c.options.selectedAddOns.length === 0)
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].itemTotalPrice += item.price;
      setCartItems(updated);
    } else {
      const newCartItem: CartItem = {
        cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        menuItem: item,
        quantity: 1,
        options: {
          selectedAddOns: [],
        },
        itemTotalPrice: item.price,
      };
      setCartItems([...cartItems, newCartItem]);
    }

    showToast(`Added ${item.name} to ticket`);
  };

  const handleCustomAddToCart = (
    item: MenuItem,
    quantity: number,
    options: CartItemOption
  ) => {
    const addOnsCost = options.selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = item.price + addOnsCost;

    const newCartItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      menuItem: item,
      quantity,
      options,
      itemTotalPrice: unitPrice * quantity,
    };

    setCartItems([...cartItems, newCartItem]);
    showToast(`Added ${quantity}x ${item.name} with customizations`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const addOnsCost = item.options?.selectedAddOns.reduce((sum, a) => sum + a.price, 0) || 0;
          const unitPrice = item.menuItem.price + addOnsCost;
          return {
            ...item,
            quantity: newQuantity,
            itemTotalPrice: unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Fire new order
  const handleFireOrder = ({
    guestName,
    diningType: chosenDining,
    tableNumber: chosenTable,
    tip,
  }: {
    guestName: string;
    diningType: 'Dine-In' | 'Takeaway' | 'Delivery';
    tableNumber: string;
    tip: number;
  }) => {
    const subtotal = cartTotal;
    const tax = subtotal * 0.08875;
    const serviceFee = 3.50;
    const total = subtotal + tax + serviceFee + tip;
    const orderNumber = `H-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: 'Just now',
      diningType: chosenDining,
      tableNumber: chosenDining === 'Dine-In' ? chosenTable : undefined,
      guestName: guestName || 'Gourmet Patron',
      items: [...cartItems],
      subtotal,
      tax,
      serviceFee,
      tip,
      total,
      stage: 'received',
      estimatedRemainingSeconds: 960, // 16 min
      totalEstimatedSeconds: 960,
      stationName: 'Central Hearth & Expo',
      stationTemp: '840°F White Oak Fire',
      stationChef: 'Executive Chef Laurent',
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 'received',
          title: 'Order Ticket Received & Fired',
          detail: `Ticket #${orderNumber} acknowledged by Expo. Preparing ${cartCount} courses.`,
          station: 'Central Expo & Pass',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setCartItems([]);
    setActiveView('tracker');
    showToast(`Order #${orderNumber} fired to live hearth!`);
  };

  // Advance Order Stage manually
  const handleAdvanceOrderStage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const currentIdx = ORDER_STAGES.indexOf(ord.stage);
        if (currentIdx >= ORDER_STAGES.length - 1) return ord;

        const nextStage = ORDER_STAGES[currentIdx + 1];
        const stageInfo = STAGE_LOGS[nextStage];
        const newLog: KitchenLogEvent = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: nextStage,
          title: stageInfo.title,
          detail: stageInfo.detail,
          station: stageInfo.station,
        };

        const newRemaining = Math.max(
          0,
          Math.round(ord.totalEstimatedSeconds * (1 - (currentIdx + 1) / (ORDER_STAGES.length - 1)))
        );

        return {
          ...ord,
          stage: nextStage,
          estimatedRemainingSeconds: nextStage === 'completed' ? 0 : newRemaining,
          stationName: stageInfo.station,
          logs: [newLog, ...ord.logs],
        };
      })
    );
  };

  // Reset Order status for testing
  const handleResetOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          stage: 'received',
          estimatedRemainingSeconds: ord.totalEstimatedSeconds,
          logs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              stage: 'received',
              title: 'Simulation Reset - Ticket Queued',
              detail: 'Kitchen reset order cycle for live demonstration.',
              station: 'Central Expo',
            },
          ],
        };
      })
    );
  };

  // Live timer tick for real-time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((ord) => {
          if (ord.stage === 'completed' || ord.estimatedRemainingSeconds <= 0) {
            return ord;
          }

          const decrement = 1 * simSpeed;
          const nextRemaining = Math.max(0, ord.estimatedRemainingSeconds - decrement);

          // Check if we should automatically progress to next stage
          const currentStageIndex = ORDER_STAGES.indexOf(ord.stage);
          const stageDuration = ord.totalEstimatedSeconds / (ORDER_STAGES.length - 1);
          const targetStageIndex = Math.min(
            ORDER_STAGES.length - 1,
            Math.floor((ord.totalEstimatedSeconds - nextRemaining) / stageDuration)
          );

          if (targetStageIndex > currentStageIndex) {
            const nextStage = ORDER_STAGES[targetStageIndex];
            const stageInfo = STAGE_LOGS[nextStage];
            const newLog: KitchenLogEvent = {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              stage: nextStage,
              title: stageInfo.title,
              detail: stageInfo.detail,
              station: stageInfo.station,
            };

            return {
              ...ord,
              stage: nextStage,
              estimatedRemainingSeconds: nextRemaining,
              stationName: stageInfo.station,
              logs: [newLog, ...ord.logs],
            };
          }

          return {
            ...ord,
            estimatedRemainingSeconds: nextRemaining,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [simSpeed]);

  const activeOrdersCount = orders.filter((o) => o.stage !== 'completed').length;

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-[#e8e4de] flex flex-col font-sans-body selection:bg-[#c28e58]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1c1915] border border-[#c28e58] text-[#f3ede4] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-fade-in">
          <Check className="w-4 h-4 text-[#c28e58]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fixed Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartCount}
        cartTotal={cartTotal}
        openCart={() => setIsCartOpen(true)}
        diningType={diningType}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        activeOrderCount={activeOrdersCount}
      />

      {/* Main Content Area (padding-top 80px / 20 for fixed header) */}
      <main className="flex-1 pt-20 md:pt-20">
        {activeView === 'menu' && (
          <div>
            {/* Sticky Category Bar */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              dietaryFilter={dietaryFilter}
              setDietaryFilter={setDietaryFilter}
            />

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
              {/* Category Header & Item Count */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#23201b]">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#c28e58] font-medium">
                    Seasonal Course Selection
                  </span>
                  <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#f3ede4]">
                    {selectedCategory === 'all'
                      ? 'The Hearth Culinary Catalog'
                      : selectedCategory
                          .replace('-', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </h1>
                </div>

                <div className="text-xs text-[#7d7568] font-mono tabular-nums">
                  Showing {filteredMenuItems.length} dishes
                </div>
              </div>

              {/* Menu Grid: 3-column desktop, 2-column tablet, 1-column mobile */}
              {filteredMenuItems.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <Utensils className="w-10 h-10 text-[#524b3f] mx-auto stroke-1" />
                  <h3 className="font-serif-display text-lg text-[#c4bcaa]">
                    No dishes found matching your criteria
                  </h3>
                  <p className="text-xs text-[#7d7568]">
                    Try clearing your search query or adjusting dietary filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setDietaryFilter(null);
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 text-xs bg-[#24201a] text-[#c28e58] rounded-lg hover:bg-[#302b23] transition-colors cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredMenuItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onSelect={(clickedItem) => setSelectedItemForModal(clickedItem)}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'tracker' && (
          <OrderTracker
            orders={orders}
            activeOrderId={activeOrderId}
            setActiveOrderId={setActiveOrderId}
            onAdvanceOrderStage={handleAdvanceOrderStage}
            onResetOrder={handleResetOrder}
            onReturnToMenu={() => setActiveView('menu')}
            simSpeed={simSpeed}
            setSimSpeed={setSimSpeed}
          />
        )}

        {activeView === 'philosophy' && (
          <ChefPhilosophy onExploreMenu={() => setActiveView('menu')} />
        )}
      </main>

      {/* Item Customization Modal */}
      <ItemCustomizerModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCart={handleCustomAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        diningType={diningType}
        setDiningType={setDiningType}
        tableNumber={tableNumber}
        onFireOrder={handleFireOrder}
      />

      {/* Fixed Sticky Mobile Bar (Complies with 15% mobile sticky cap rule) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#13110f]/95 backdrop-blur-md border-t border-[#26221d] px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setActiveView('tracker')}
          className="flex items-center gap-2 text-xs text-[#c4bcaa] cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c28e58] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c28e58]"></span>
          </span>
          <span className="font-medium">Track Order</span>
          <span className="text-[10px] font-mono text-[#c28e58]">({activeOrdersCount})</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="px-4 py-2 bg-[#c28e58] text-[#0f0e0d] font-semibold text-xs rounded-lg flex items-center gap-2 shadow-md cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Cart ({cartCount})</span>
          {cartTotal > 0 && (
            <span className="font-mono tabular-nums font-bold">
              · ${cartTotal.toFixed(2)}
            </span>
          )}
        </button>
      </div>

      {/* Elegant Quiet Footer */}
      <footer className="mt-auto border-t border-[#221f1a] bg-[#0c0b0a] py-8 text-xs text-[#70685c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-serif-display text-sm font-medium text-[#c4bcaa]">
              L'Atelier Hearth Restaurant & Bar
            </span>
            <p className="text-[11px] text-[#5e564a]">
              Wood-Fired Gastronomy · Artisanal Cellar · Live Hearth Kitchen
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>Hours: 5:00 PM – 11:30 PM Daily</span>
            <span aria-hidden="true">·</span>
            <span>Table Hospitality: {tableNumber}</span>
          </div>

          <div className="text-[10px] text-[#504a40]">
            © 2026 L'Atelier Hearth. All culinary rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
