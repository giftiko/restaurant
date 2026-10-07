export type CategoryId = 
  | 'all'
  | 'starters'
  | 'hearth-mains'
  | 'wood-fired'
  | 'fresh-pastas'
  | 'desserts'
  | 'mixology';

export interface MenuItem {
  id: string;
  name: string;
  categoryId: CategoryId;
  price: number;
  description: string;
  image: string;
  prepTime: string;
  calories: string;
  isChefSpecial?: boolean;
  dietary?: ('Vegetarian' | 'Gluten-Free' | 'Dairy-Free' | 'Vegan' | 'Pescatarian')[];
  spiceLevel?: 0 | 1 | 2 | 3;
  pairingRecommendation?: string;
  customizationOptions?: {
    doneness?: string[];
    addOns?: { name: string; price: number }[];
    substitutions?: string[];
  };
}

export interface CartItemOption {
  doneness?: string;
  selectedAddOns: { name: string; price: number }[];
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  options?: CartItemOption;
  itemTotalPrice: number;
}

export type OrderStage = 
  | 'received'
  | 'mise_en_place'
  | 'wood_fired_hearth'
  | 'plating_qc'
  | 'ready_for_service'
  | 'completed';

export interface KitchenLogEvent {
  id: string;
  timestamp: string;
  stage: OrderStage;
  title: string;
  detail: string;
  station: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  diningType: 'Dine-In' | 'Takeaway' | 'Delivery';
  tableNumber?: string;
  guestName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceFee: number;
  tip: number;
  total: number;
  stage: OrderStage;
  estimatedRemainingSeconds: number;
  totalEstimatedSeconds: number;
  stationName: string;
  stationTemp: string;
  stationChef: string;
  logs: KitchenLogEvent[];
}
