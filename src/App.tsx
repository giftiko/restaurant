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
<<<<<<< HEAD
import { MENU_ITEMS } from './data/menuData';
import { fetchMenuItems } from './api/menu';
import { createOrder, fetchOrders, toOrderItemInputs } from './api/orders';
import { AuthUser, fetchMe, logout as logoutRequest } from './api/auth';
import { AuthModal } from './components/AuthModal';
import { MenuItem, CategoryId, CartItem, CartItemOption, Order } from './types/menu';
=======
import { MENU_ITEMS, INITIAL_ACTIVE_ORDER } from './data/menuData';
import { MenuItem, CategoryId, CartItem, CartItemOption, Order, OrderStage, KitchenLogEvent } from './types/menu';
>>>>>>> 11923a69831f2207a098e08b10313563f4731f3d
import { Check, Utensils } from 'lucide-react';

const nowLabel = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const makeLogId = () => `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;


const CART_STORAGE_KEY = 'hearth.cart.v1';
const GUEST_STORAGE_KEY = 'hearth.guest.v1';

type DiningType = 'Dine-In' | 'Takeaway' | 'Delivery';

interface GuestDetails {
  guestName: string;
  tableNumber: string;
  diningType: DiningType;
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadGuest(): Partial<GuestDetails> {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<'menu' | 'tracker' | 'philosophy'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);

  const [initialGuest] = useState(loadGuest);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  const [diningType, setDiningType] = useState<DiningType>(initialGuest.diningType ?? 'Dine-In');
  const [tableNumber, setTableNumber] = useState(
    initialGuest.tableNumber ?? 'Table 08 (Garden Veranda)'
  );
  const [guestName, setGuestName] = useState(initialGuest.guestName ?? '');

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

<<<<<<< HEAD
  // Account session (Django username + password, cookie-based).
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Live menu: starts on the local seed data, then swaps to the Django/PostgreSQL
  // menu as soon as GET /menu answers (falls back silently if the server is off).
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [menuIsLive, setMenuIsLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchMenuItems(controller.signal).then(({ items, live }) => {
      setMenuItems(items);
      setMenuIsLive(live);
    });
    return () => controller.abort();
  }, []);

  // Who is signed in? Ask the API once on load (cookie session).
  useEffect(() => {
    const controller = new AbortController();
    fetchMe(controller.signal)
      .then((account) => setUser(account))
      .catch(() => setUser(null))
      .finally(() => setAuthReady(true));
    return () => controller.abort();
  }, []);

  // Live orders: a guest sees their own history, staff see the whole kitchen.
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setActiveOrderId('');
      return;
    }
    const controller = new AbortController();
    fetchOrders(controller.signal)
      .then((serverOrders) => {
        setOrders(serverOrders);
        setActiveOrderId(serverOrders[0]?.id ?? '');
      })
      .catch(() => {
        /* API unreachable - keep whatever local state we have */
      });
    return () => controller.abort();
  }, [user]);

  // Default the guest name to the account username once we know it.
  useEffect(() => {
    if (user && !guestName) setGuestName(user.username);
  }, [user, guestName]);

  // Persist the cart + guest details so a reload keeps them.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      /* storage full or disabled */
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(
        GUEST_STORAGE_KEY,
        JSON.stringify({ guestName, tableNumber, diningType })
      );
    } catch {
      /* storage full or disabled */
    }
  }, [guestName, tableNumber, diningType]);

  // Search filtered results for the SearchModal
  const searchResults = menuItems.filter((item) => {
=======
  // Search filtered results for the SearchModal
  const searchResults = MENU_ITEMS.filter((item) => {
>>>>>>> 11923a69831f2207a098e08b10313563f4731f3d
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.pairingRecommendation?.toLowerCase().includes(q)
    );
  });

  // Filtered menu items for the main browsing experience
<<<<<<< HEAD
  const filteredMenuItems = menuItems.filter((item) => {
=======
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
>>>>>>> 11923a69831f2207a098e08b10313563f4731f3d
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

  // Fire new order. The Django API is the source of truth; if it can't be
  // reached we build the same ticket locally so the demo still works offline.
  const handleFireOrder = async ({
    guestName: chosenGuest,
    diningType: chosenDining,
    tableNumber: chosenTable,
    tip,
  }: {
    guestName: string;
    diningType: 'Dine-In' | 'Takeaway' | 'Delivery';
    tableNumber: string;
    tip: number;
  }) => {
    if (!user) {
      setIsAuthOpen(true);
      showToast('Please sign in to fire your order');
      return;
    }

    const goToTracker = (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      setActiveOrderId(order.id);
      setCartItems([]);
      setActiveView('tracker');
      showToast(`Order #${order.orderNumber} fired to live hearth`);
    };

    try {
      const created = await createOrder({
        guestName: chosenGuest || user.username,
        diningType: chosenDining,
        tableNumber: chosenDining === 'Dine-In' ? chosenTable : '',
        tip,
        items: toOrderItemInputs(cartItems),
      });
      goToTracker(created);
      return;
    } catch {
      /* fall through to the local ticket below */
    }

    const subtotal = cartTotal;
    const tax = subtotal * 0.08875;
    const serviceFee = 3.50;
    const total = subtotal + tax + serviceFee + tip;
    const orderNumber = `H-${Math.floor(1000 + Math.random() * 9000)}`;

    const fallbackOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: 'Just now',
      diningType: chosenDining,
      tableNumber: chosenDining === 'Dine-In' ? chosenTable : undefined,
      guestName: chosenGuest || user.username,
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
          id: makeLogId(),
          timestamp: nowLabel(),
          stage: 'received',
          title: 'Order Ticket Received & Fired',
          detail: `Ticket #${orderNumber} acknowledged by Expo. Preparing ${cartCount} courses.`,
          station: 'Central Expo & Pass',
        },
      ],
    };

<<<<<<< HEAD
    goToTracker(fallbackOrder);
=======
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setCartItems([]);
    setActiveView('tracker');
    showToast(`Order #${orderNumber} fired to live hearth`);
>>>>>>> 11923a69831f2207a098e08b10313563f4731f3d
  };

  const handleAuthenticated = (account: AuthUser) => {
    setUser(account);
    showToast(`Signed in as ${account.username}`);
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      /* even if the server is unreachable, drop the local session view */
    }
    setUser(null);
    setOrders([]);
    setActiveOrderId('');
    showToast('Signed out');
  };

  // Guest-side countdown: purely cosmetic. The kitchen (admin board) is the only
  // thing that actually advances a ticket, so this just ticks the ETA down.
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) => {
        let changed = false;
        const next = prevOrders.map((ord) => {
          if (ord.stage === 'completed' || ord.estimatedRemainingSeconds <= 0) return ord;
          changed = true;
          return { ...ord, estimatedRemainingSeconds: ord.estimatedRemainingSeconds - 1 };
        });
        return changed ? next : prevOrders;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll so a guest picks up stage/ETA changes staff make on the admin board.
  useEffect(() => {
    if (!user) return;
    const poll = setInterval(() => {
      fetchOrders()
        .then((serverOrders) => {
          setOrders(serverOrders);
          setActiveOrderId((current) =>
            serverOrders.some((o) => o.id === current) ? current : serverOrders[0]?.id ?? ''
          );
        })
        .catch(() => {
          /* API blip - keep the last known state */
        });
    }, 15000);
    return () => clearInterval(poll);
  }, [user]);

  const activeOrdersCount = orders.filter((o) => o.stage !== 'completed').length;
<<<<<<< HEAD
  const signatureDish = menuItems[0]; // Miyazaki Wagyu Ribeye (sort_order 0)
=======
  const signatureDish = MENU_ITEMS[0]; // Miyazaki Wagyu Ribeye
>>>>>>> 11923a69831f2207a098e08b10313563f4731f3d

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
        user={user}
        authReady={authReady}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
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
<<<<<<< HEAD
            {selectedCategory === 'all' && !dietaryFilter && signatureDish && (
=======
            {selectedCategory === 'all' && !dietaryFilter && (
>>>>>>> 11923a69831f2207a098e08b10313563f4731f3d
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
            onReturnToMenu={() => setActiveView('menu')}
            isAuthenticated={!!user}
            onOpenAuth={() => setIsAuthOpen(true)}
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

<<<<<<< HEAD
      {/* Sign in / create account */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

=======
>>>>>>> 11923a69831f2207a098e08b10313563f4731f3d
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
        guestName={guestName}
        setGuestName={setGuestName}
        isAuthenticated={!!user}
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
<<<<<<< HEAD
            <span
              className="flex items-center gap-1.5"
              title={
                menuIsLive
                  ? 'Menu served by Django from PostgreSQL'
                  : 'Django server not reachable - showing bundled menu data'
              }
            >
              <span
                aria-hidden="true"
                className={`w-1.5 h-1.5 rounded-full ${
                  menuIsLive ? 'bg-[#4a7c59] animate-pulse' : 'bg-[#c8c0b2]'
                }`}
              />
              {menuIsLive ? 'Live menu' : 'Offline menu'}
            </span>
=======
>>>>>>> 11923a69831f2207a098e08b10313563f4731f3d
          </div>

          <div className="text-[10px] text-[#948b80]">
            © 2026 L'Atelier Hearth. All culinary rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
