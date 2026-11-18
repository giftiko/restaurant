import { MenuItem } from '../types/menu';
import { MENU_ITEMS } from '../data/menuData';

/**
 * Base path for the Django API. In dev the Vite proxy forwards `/api/*` to
 * http://127.0.0.1:8001 and strips the prefix (see vite.config.ts), so
 * `/api/menu` becomes Django's `GET /menu`.
 */
export const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '/api';

export interface MenuPayload {
  count: number;
  source: string;
  items: MenuItem[];
}

export interface MenuResult {
  items: MenuItem[];
  /** true when the dishes came from the database, false when from local seed data */
  live: boolean;
  error?: string;
}

/** Fetch the live menu from Django; falls back to the local seed data. */
export async function fetchMenuItems(signal?: AbortSignal): Promise<MenuResult> {
  try {
    const response = await fetch(`${API_BASE}/menu`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!response.ok) {
      throw new Error(`GET /menu responded ${response.status}`);
    }
    const data = (await response.json()) as MenuPayload;
    if (!Array.isArray(data?.items) || data.items.length === 0) {
      throw new Error('GET /menu returned no items');
    }
    return { items: data.items, live: true };
  } catch (error) {
    // Server down / not migrated yet -> keep the UI usable with local data.
    return {
      items: MENU_ITEMS,
      live: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
