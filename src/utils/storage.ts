export const STORAGE_KEYS = {
  cart: 'streetwear.cart.v1',
  demoSession: 'streetwear.demo.session.v1',
  demoAdmin: 'streetwear.demo.admin.v1',
  demoOrders: 'streetwear.demo.orders.v1',
  demoAddresses: 'streetwear.demo.addresses.v1',
  demoProfiles: 'streetwear.demo.profiles.v1',
  newsletter: 'streetwear.demo.newsletter.v1',
  recentlyViewed: 'streetwear.demo.recently-viewed.v1',
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage can be disabled; demo state simply becomes session-only.
  }
}

export function createId(prefix: string) {
  const random = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);
  return `${prefix}_${random}`;
}
