import { CartItem, Order } from '../types/menu';
import { apiFetch } from './client';

/**
 * Order endpoints on the Django API. In dev the Vite proxy forwards `/api/*`
 * to http://127.0.0.1:8001 and strips the prefix (see vite.config.ts), so
 * `/api/orders` becomes Django's `POST /orders`. Every call carries the
 * session cookie; writes also carry the CSRF header (see api/client.ts).
 */

export interface OrderItemInput {
  menuItemId: string;
  quantity: number;
  options?: {
    doneness?: string;
    selectedAddOns?: { name: string; price: number }[];
    specialInstructions?: string;
  };
}

export interface CreateOrderInput {
  guestName: string;
  diningType: 'Dine-In' | 'Takeaway' | 'Delivery';
  tableNumber?: string;
  tip: number;
  items: OrderItemInput[];
}

/** Fire a new order; the API recomputes totals from live menu prices. */
export function createOrder(input: CreateOrderInput): Promise<Order> {
  return apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(input) });
}

/**
 * Load the orders the caller may see: their own for a guest, every ticket for
 * staff. Requires a signed-in session.
 */
export async function fetchOrders(signal?: AbortSignal): Promise<Order[]> {
  const data = await apiFetch<{ orders: Order[] }>('/orders', { signal });
  return Array.isArray(data?.orders) ? data.orders : [];
}

/** Move an order one stage down the kitchen line (staff only). */
export function advanceOrder(orderNumber: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${encodeURIComponent(orderNumber)}/advance`, {
    method: 'POST',
  });
}

/** Reset an order back to the top of the line (staff only). */
export function resetOrder(orderNumber: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${encodeURIComponent(orderNumber)}/reset`, {
    method: 'POST',
  });
}

/** Convert cart lines into the payload shape the API expects. */
export function toOrderItemInputs(cartItems: CartItem[]): OrderItemInput[] {
  return cartItems.map((cartItem) => ({
    menuItemId: cartItem.menuItem.id,
    quantity: cartItem.quantity,
    options: cartItem.options
      ? {
          doneness: cartItem.options.doneness,
          selectedAddOns: cartItem.options.selectedAddOns,
          specialInstructions: cartItem.options.specialInstructions,
        }
      : undefined,
  }));
}
