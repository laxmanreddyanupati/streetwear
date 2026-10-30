import type { CartItem, CartLine, Product } from '@/types';
import type { CartMutationResult, CartService } from '@/services/contracts/cart';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';
import { STANDARD_SHIPPING_MINOR } from '@/utils/money';

const MAX_QUANTITY_PER_LINE = 10;

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.variantId === 'string' &&
    Number.isSafeInteger(line.quantity) &&
    (line.quantity ?? 0) > 0
  );
}

function findVariant(productList: Product[], variantId: string) {
  for (const product of productList) {
    const variant = product.variants.find((item) => item.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

export const cartService: CartService = {
  load() {
    const stored = readStorage<unknown>(STORAGE_KEYS.cart, []);
    if (!Array.isArray(stored)) return [];
    const seen = new Set<string>();
    return stored.filter(isCartLine).reduce<CartLine[]>((lines, line) => {
      if (seen.has(line.variantId)) return lines;
      seen.add(line.variantId);
      lines.push({
        variantId: line.variantId,
        quantity: Math.min(MAX_QUANTITY_PER_LINE, Math.max(1, line.quantity)),
      });
      return lines;
    }, []);
  },

  save(lines) {
    writeStorage(STORAGE_KEYS.cart, lines);
  },

  clear() {
    writeStorage(STORAGE_KEYS.cart, []);
  },

  resolve(lines, productList) {
    return lines.flatMap<CartItem>((line) => {
      const match = findVariant(productList, line.variantId);
      if (!match || match.product.status !== 'active') return [];
      const { product, variant } = match;
      const availableQuantity = Math.min(variant.stock, MAX_QUANTITY_PER_LINE);
      if (availableQuantity <= 0) return [];
      const quantity = Math.min(line.quantity, availableQuantity);
      const color = product.colors.find((item) => item.slug === variant.colorSlug);
      if (!color) return [];
      return [
        {
          line: { variantId: variant.id, quantity },
          product,
          variant,
          color,
          unitPriceMinor: variant.priceMinor,
          lineTotalMinor: variant.priceMinor * quantity,
        },
      ];
    });
  },

  add(lines, variantId, quantity, productList): CartMutationResult {
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return { lines, error: 'Choose a quantity of at least 1.' };
    }
    const match = findVariant(productList, variantId);
    if (!match || match.product.status !== 'active') {
      return { lines, error: 'This product is no longer available.' };
    }
    const { product, variant } = match;
    if (variant.stock <= 0) {
      return { lines, error: 'This size and colour is sold out. Try another option.' };
    }
    const existing = lines.find((line) => line.variantId === variantId);
    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    const maxAllowed = Math.min(variant.stock, MAX_QUANTITY_PER_LINE);
    if (nextQuantity > maxAllowed) {
      return {
        lines,
        error:
          variant.stock < MAX_QUANTITY_PER_LINE
            ? `Only ${variant.stock} left in this option.`
            : `You can add up to ${MAX_QUANTITY_PER_LINE} per option.`,
      };
    }
    const nextLines = existing
      ? lines.map((line) =>
          line.variantId === variantId ? { ...line, quantity: nextQuantity } : line,
        )
      : [...lines, { variantId, quantity }];
    const color = product.colors.find((item) => item.slug === variant.colorSlug);
    return {
      lines: nextLines,
      item: color
        ? {
            line: { variantId, quantity: nextQuantity },
            product,
            variant,
            color,
            unitPriceMinor: variant.priceMinor,
            lineTotalMinor: variant.priceMinor * nextQuantity,
          }
        : undefined,
    };
  },

  setQuantity(lines, variantId, quantity, productList): CartMutationResult {
    const match = findVariant(productList, variantId);
    if (!match) return { lines, error: 'This product is no longer available.' };
    if (quantity <= 0) return { lines: this.remove(lines, variantId) };
    if (!Number.isSafeInteger(quantity)) {
      return { lines, error: 'Enter a whole number.' };
    }
    const maxAllowed = Math.min(match.variant.stock, MAX_QUANTITY_PER_LINE);
    if (maxAllowed <= 0) {
      return { lines: this.remove(lines, variantId), error: 'This option just sold out.' };
    }
    if (quantity > maxAllowed) {
      return {
        lines,
        error:
          match.variant.stock < MAX_QUANTITY_PER_LINE
            ? `Only ${match.variant.stock} left in this option.`
            : `Maximum ${MAX_QUANTITY_PER_LINE} per option.`,
      };
    }
    return {
      lines: lines.map((line) =>
        line.variantId === variantId ? { ...line, quantity } : line,
      ),
    };
  },

  remove(lines, variantId) {
    return lines.filter((line) => line.variantId !== variantId);
  },

  calculateTotals(items, options = {}) {
    const itemCount = items.reduce((sum, item) => sum + item.line.quantity, 0);
    const subtotalMinor = items.reduce((sum, item) => sum + item.lineTotalMinor, 0);
    const discountMinor = Math.min(Math.max(0, options.discountMinor ?? 0), subtotalMinor);
    const shippingMinor = options.shippingMinor ?? STANDARD_SHIPPING_MINOR;
    return {
      itemCount,
      subtotalMinor,
      discountMinor,
      shippingMinor,
      totalMinor: Math.max(0, subtotalMinor - discountMinor) + shippingMinor,
      currency: 'INR',
    };
  },
};

export { MAX_QUANTITY_PER_LINE };
