import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { MenuItemCard } from './components/MenuItemCard';
import { FeaturedSpotlight } from './components/FeaturedSpotlight';
import { SearchModal } from './components/SearchModal';
import { FloatingTicketDock } from './components/FloatingTicketDock';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { ChefPhilosophy } from './components/ChefPhilosophy';
import { MENU_ITEMS, INITIAL_ACTIVE_ORDER } from './data/menuData';
import { MenuItem, CategoryId, CartItem, CartItemOption, Order, OrderStage, KitchenLogEvent } from './types/menu';
import { Check, Utensils } from 'lucide-react';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // Search filtered results for the SearchModal
  const searchResults = MENU_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.pairingRecommendation?.toLowerCase().includes(q)
    );
  });

  // Filtered menu items for the main browsing experience
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
    showToast(`Added ${quantity}x ${item.name} to ticket`);
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
    }, 2400);
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
      estimatedRemainingSeconds: 960,
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
    showToast(`Order #${orderNumber} fired to live hearth`);
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
  const signatureDish = MENU_ITEMS[0]; // Miyazaki Wagyu Ribeye

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#181716] flex flex-col font-sans-body selection:bg-[#9e5a2a]/20 selection:text-[#181716]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#181716] text-[#fbf9f5] px-4 py-2.5 rounded shadow-lg flex items-center gap-2 text-xs animate-fade-in border border-[#34302c]">
          <Check className="w-3.5 h-3.5 text-[#e2b07e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Redesigned Quiet Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartCount}
        cartTotal={cartTotal}
        openCart={() => setIsCartOpen(true)}
        openSearch={() => setIsSearchOpen(true)}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        activeOrderCount={activeOrdersCount}
      />

      {/* Main Content Flow */}
      <main className="flex-1 pt-18">
        {activeView === 'menu' && (
          <div>
            {/* SECTION 1: Editorial Introduction */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 text-center sm:text-left">
              <div className="max-w-2xl space-y-3">
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#9e5a2a] font-medium block">
                  The Hearth Culinary Catalog
                </span>
                <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#181716] leading-tight tracking-tight">
                  A seasonal menu shaped by fire, craft, and the finest ingredients.
                </h1>
                <p className="text-xs sm:text-sm text-[#665e54] font-sans-body leading-relaxed pt-1">
                  12 courses prepared over 850°F white-oak embers and organic harvests from regenerative regional farms.
                </p>
              </div>
            </section>

            {/* SECTION 2: Signature Culinary Spotlight (Food is the hero) */}
            {selectedCategory === 'all' && !dietaryFilter && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FeaturedSpotlight
                  item={signatureDish}
                  onSelect={(dish) => setSelectedItemForModal(dish)}
                  onQuickAdd={handleQuickAdd}
                />
              </div>
            )}

            {/* SECTION 3: Content Chapter Index (No bulky control panel) */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              dietaryFilter={dietaryFilter}
              setDietaryFilter={setDietaryFilter}
            />

            {/* SECTION 4: Menu Dishes Grid with Generous Whitespace */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
              {/* Category Chapter Heading & Count */}
              <div className="flex items-baseline justify-between border-b border-[#e8e3d8] pb-3">
                <h2 className="font-serif-display text-2xl font-medium text-[#181716]">
                  {selectedCategory === 'all'
                    ? 'All Offerings'
                    : selectedCategory.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </h2>
                <span className="font-mono text-xs text-[#8a8174] tabular-nums">
                  {filteredMenuItems.length} {filteredMenuItems.length === 1 ? 'course' : 'courses'}
                </span>
              </div>

              {filteredMenuItems.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-[#ffffff] border border-[#e8e3d8] rounded p-8">
                  <Utensils className="w-8 h-8 text-[#b8afa3] mx-auto stroke-1" />
                  <h3 className="font-serif-display text-lg text-[#181716]">
                    No courses found for this dietary selection
                  </h3>
                  <p className="text-xs text-[#786f63]">
                    Clear dietary preferences to view our full seasonal menu.
                  </p>
                  <button
                    onClick={() => {
                      setDietaryFilter(null);
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 text-xs bg-[#f4eee6] text-[#9e5a2a] border border-[#ded8cc] rounded hover:bg-[#ede5d8] transition-colors cursor-pointer font-medium"
                  >
                    View All Offerings
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9">
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
            </section>
          </div>
        )}

        {/* SECTION 5: Dedicated Order Tracking View */}
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

        {/* SECTION 6: Restaurant Philosophy & Story */}
        {activeView === 'philosophy' && (
          <ChefPhilosophy onExploreMenu={() => setActiveView('menu')} />
        )}
      </main>

      {/* Progressive Disclosure: Search Modal (Only rendered when activated) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        results={searchResults}
        onSelectDish={(dish) => setSelectedItemForModal(dish)}
      />

      {/* Dish Customization & Detail Modal */}
      <ItemCustomizerModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCart={handleCustomAddToCart}
      />

      {/* Order Ticket Drawer */}
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

      {/* SECTION 6: Floating Dining Ticket Summary (Only visible when items exist) */}
      <FloatingTicketDock
        itemCount={cartCount}
        totalPrice={cartTotal}
        onOpenTicket={() => setIsCartOpen(true)}
      />

      {/* Elegant Quiet Editorial Footer */}
      <footer className="mt-auto border-t border-[#e8e3d8] bg-[#f4f0e6] py-12 text-xs text-[#7a7267]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-serif-display text-base font-medium text-[#181716] block">
              L'Atelier Hearth Restaurant & Bar
            </span>
            <p className="text-[11px] text-[#8a8174]">
              Wood-Fired Gastronomy · Artisanal Cellar · Live Hearth Kitchen
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>Dinner: 5:00 PM – 11:30 PM Daily</span>
            <span aria-hidden="true" className="text-[#c8c0b2]">·</span>
            <span>Hospitality: {tableNumber.split(' (')[0]}</span>
          </div>

          <div className="text-[10px] text-[#948b80]">
            © 2026 L'Atelier Hearth. All culinary rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
