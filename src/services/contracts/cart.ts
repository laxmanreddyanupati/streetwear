import type { CartItem, CartLine, CartTotals, Product } from '@/types';

export interface CartMutationResult {
  lines: CartLine[];
  error?: string;
  item?: CartItem;
}

export interface CartService {
  load(): CartLine[];
  save(lines: CartLine[]): void;
  clear(): void;
  resolve(lines: CartLine[], products: Product[]): CartItem[];
  add(lines: CartLine[], variantId: string, quantity: number, products: Product[]): CartMutationResult;
  setQuantity(lines: CartLine[], variantId: string, quantity: number, products: Product[]): CartMutationResult;
  remove(lines: CartLine[], variantId: string): CartLine[];
  calculateTotals(
    items: CartItem[],
    options?: { discountMinor?: number; shippingMinor?: number },
  ): CartTotals;
}
