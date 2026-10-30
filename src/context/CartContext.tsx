import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, CartLine, CartTotals } from '@/types';
import { cartService } from '@/services';
import { useAllProducts } from '@/hooks/useCatalog';
import {
  FREE_SHIPPING_THRESHOLD_MINOR,
  STANDARD_SHIPPING_MINOR,
} from '@/utils/money';

export interface CartActionResult {
  ok: boolean;
  message: string;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  totals: CartTotals;
  count: number;
  isOpen: boolean;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  lastMessage: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<CartActionResult>;
  updateQuantity: (variantId: string, quantity: number) => Promise<CartActionResult>;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  clearError: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => cartService.load());
  const [isOpen, setIsOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const { data: products, isLoading } = useAllProducts();

  const items = useMemo(
    () => cartService.resolve(lines, products ?? []),
    [lines, products],
  );

  useEffect(() => {
    cartService.save(lines);
  }, [lines]);

  // Reconcile with live stock/catalogue once products load. This removes
  // lines that no longer exist and clamps quantities to available stock.
  useEffect(() => {
    if (!products) return;
    const reconciled = items.map((item) => ({
      variantId: item.variant.id,
      quantity: item.line.quantity,
    }));
    const current = lines.map((line) => ({
      variantId: line.variantId,
      quantity: line.quantity,
    }));
    if (JSON.stringify(reconciled) !== JSON.stringify(current)) {
      queueMicrotask(() => {
        setLines(reconciled);
      });
    }
  }, [items, lines, products]);

  const subtotalMinor = items.reduce((sum, item) => sum + item.lineTotalMinor, 0);
  const estimatedShippingMinor =
    items.length === 0
      ? 0
      : subtotalMinor >= FREE_SHIPPING_THRESHOLD_MINOR
        ? 0
        : STANDARD_SHIPPING_MINOR;
  const totals = cartService.calculateTotals(items, {
    shippingMinor: estimatedShippingMinor,
  });
  const count = items.reduce((sum, item) => sum + item.line.quantity, 0);

  const openCart = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1): Promise<CartActionResult> => {
      setIsMutating(true);
      setError(null);
      try {
        if (!products?.length) {
          const message = 'The catalogue is still loading. Try again in a moment.';
          setError(message);
          return { ok: false, message };
        }
        const result = cartService.add(lines, variantId, quantity, products);
        if (result.error) {
          setError(result.error);
          return { ok: false, message: result.error };
        }
        setLines(result.lines);
        const added = result.item;
        const message = added
          ? `${added.product.name} — ${added.color.name} / ${added.variant.size} added to your bag.`
          : 'Added to your bag.';
        setLastMessage(message);
        setIsOpen(true);
        return { ok: true, message };
      } finally {
        setIsMutating(false);
      }
    },
    [lines, products],
  );

  const updateQuantity = useCallback(
    async (variantId: string, quantity: number): Promise<CartActionResult> => {
      setIsMutating(true);
      setError(null);
      try {
        if (!products?.length) {
          const message = 'The catalogue is still loading.';
          setError(message);
          return { ok: false, message };
        }
        const result = cartService.setQuantity(lines, variantId, quantity, products);
        if (result.error) {
          setError(result.error);
          return { ok: false, message: result.error };
        }
        setLines(result.lines);
        return { ok: true, message: 'Bag updated.' };
      } finally {
        setIsMutating(false);
      }
    },
    [lines, products],
  );

  const removeItem = useCallback((variantId: string) => {
    setError(null);
    setLines((current) => cartService.remove(current, variantId));
    setLastMessage('Item removed from your bag.');
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setError(null);
    setLastMessage(null);
    cartService.clear();
  }, []);

  const value = useMemo(
    () => ({
      items,
      lines,
      totals,
      count,
      isOpen,
      isLoading,
      isMutating,
      error,
      lastMessage,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      clearError: () => setError(null),
    }),
    [
      items,
      lines,
      totals,
      count,
      isOpen,
      isLoading,
      isMutating,
      error,
      lastMessage,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
