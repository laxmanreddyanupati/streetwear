import type {
  CartItem,
  Order,
  OrderItem,
  PlaceOrderInput,
  Promotion,
  PromotionValidation,
  ShippingMethod,
} from '@/types';
import type { CheckoutQuote, CheckoutService } from '@/services/contracts/checkout';
import { shippingMethods } from '@/data/catalog';
import { appendLocalOrder } from './orders';
import { db, simulateLatency } from './db';
import { createId } from '@/utils/storage';
import {
  FREE_SHIPPING_THRESHOLD_MINOR,
  STANDARD_SHIPPING_MINOR,
} from '@/utils/money';

function cloneShipping(method: ShippingMethod): ShippingMethod {
  return { ...method };
}

/**
 * Rebuild line items from the catalogue rather than trusting prices or totals
 * supplied by the client. This is the mock equivalent of the server-side
 * recalculation that Cloud Functions will perform.
 */
function repriceItems(items: CartItem[]): CartItem[] {
  if (!items.length) throw new Error('Your bag is empty.');
  return items.map((item) => {
    const product = db.products.find((candidate) => candidate.id === item.product.id);
    const variant = product?.variants.find((candidate) => candidate.id === item.variant.id);
    if (!product || !variant || product.status !== 'active') {
      throw new Error(`${item.product.name} is no longer available.`);
    }
    const quantity = item.line.quantity;
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      throw new Error('One of your bag items has an invalid quantity.');
    }
    if (quantity > variant.stock) {
      throw new Error(
        `${product.name} (${variant.size}) only has ${variant.stock} left. Update your bag to continue.`,
      );
    }
    const color = product.colors.find((candidate) => candidate.slug === variant.colorSlug);
    if (!color) throw new Error(`${product.name} is missing colour information.`);
    return {
      line: { variantId: variant.id, quantity },
      product,
      variant,
      color,
      unitPriceMinor: variant.priceMinor,
      lineTotalMinor: variant.priceMinor * quantity,
    };
  });
}

function computeShipping(
  subtotalAfterDiscount: number,
  method: ShippingMethod,
  promotion?: Promotion,
) {
  if (method.id === 'standard' && subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD_MINOR) return 0;
  if (promotion?.type === 'free_shipping' && method.id === 'standard') return 0;
  return method.id === 'standard' ? STANDARD_SHIPPING_MINOR : method.priceMinor;
}

export const checkoutService: CheckoutService = {
  async listShippingMethods() {
    await simulateLatency(50);
    return shippingMethods.map(cloneShipping);
  },

  async validatePromotion(code: string, subtotalMinor: number): Promise<PromotionValidation> {
    await simulateLatency(140);
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      return { valid: false, discountMinor: 0, message: 'Enter a promotion code.' };
    }
    const promotion = db.promotions.find((item) => item.code === normalized);
    if (!promotion) {
      return { valid: false, discountMinor: 0, message: 'That promotion code is not recognised.' };
    }
    if (!promotion.active) {
      return { valid: false, discountMinor: 0, message: 'That promotion is no longer active.' };
    }
    const now = Date.now();
    if (promotion.startsAt && Date.parse(promotion.startsAt) > now) {
      return { valid: false, discountMinor: 0, message: 'That promotion has not started yet.' };
    }
    if (promotion.endsAt && Date.parse(promotion.endsAt) < now) {
      return { valid: false, discountMinor: 0, message: 'That promotion has expired.' };
    }
    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return { valid: false, discountMinor: 0, message: 'That promotion has reached its limit.' };
    }
    if (promotion.minSubtotalMinor && subtotalMinor < promotion.minSubtotalMinor) {
      return {
        valid: false,
        discountMinor: 0,
        message: `This code needs a subtotal of at least ₹${(promotion.minSubtotalMinor / 100).toLocaleString('en-IN')}.`,
      };
    }
    let discountMinor = 0;
    if (promotion.type === 'percentage') {
      discountMinor = Math.round((subtotalMinor * Math.min(100, promotion.value)) / 100);
    } else if (promotion.type === 'fixed') {
      discountMinor = Math.min(subtotalMinor, promotion.value);
    }
    return {
      valid: true,
      promotion,
      discountMinor,
      message:
        promotion.type === 'free_shipping'
          ? 'Complimentary standard shipping applied.'
          : `${promotion.code} applied — ₹${(discountMinor / 100).toLocaleString('en-IN')} off.`,
    };
  },

  async getQuote({ items, shippingMethodId, promoCode }): Promise<CheckoutQuote> {
    await simulateLatency(120);
    const priced = repriceItems(items);
    const method = shippingMethods.find((candidate) => candidate.id === shippingMethodId);
    if (!method) throw new Error('Choose a delivery method.');
    const subtotalMinor = priced.reduce((sum, item) => sum + item.lineTotalMinor, 0);
    let discountMinor = 0;
    let promotion: Promotion | undefined;
    if (promoCode?.trim()) {
      const validation = await this.validatePromotion(promoCode, subtotalMinor);
      if (!validation.valid) throw new Error(validation.message);
      discountMinor = validation.discountMinor;
      promotion = validation.promotion;
    }
    const shippingMinor = computeShipping(subtotalMinor - discountMinor, method, promotion);
    return {
      items: priced,
      subtotalMinor,
      discountMinor,
      shippingMinor,
      totalMinor: Math.max(0, subtotalMinor - discountMinor) + shippingMinor,
      shippingMethod: cloneShipping(method),
      promotion,
    };
  },

  async placeOrder(input: PlaceOrderInput, items: CartItem[]): Promise<Order> {
    await simulateLatency(420);
    const allOrders = await import('./orders').then((module) => module.orderService.listAll());
    const existing = allOrders.find((order) => order.idempotencyKey === input.idempotencyKey);
    if (existing) return existing;

    const quote = await this.getQuote({
      items,
      shippingMethodId: input.shippingMethod.id,
      promoCode: input.promoCode,
    });
    if (!quote.items.length) throw new Error('Your bag is empty.');

    const now = new Date();
    const year = now.getFullYear();
    const orderItems: OrderItem[] = quote.items.map((item) => ({
      productId: item.product.id,
      variantId: item.variant.id,
      productName: item.product.name,
      productSlug: item.product.slug,
      variantLabel: `${item.color.name} / ${item.variant.size}`,
      sku: item.variant.sku,
      imageUrl: item.product.images[0]?.url ?? '',
      unitPriceMinor: item.unitPriceMinor,
      quantity: item.line.quantity,
      lineTotalMinor: item.lineTotalMinor,
    }));

    const order: Order = {
      id: createId('ord'),
      number: `SW-${year}-${String(1050 + allOrders.length + 1).padStart(4, '0')}`,
      customerId: input.customer?.id,
      email: input.email.trim().toLowerCase(),
      items: orderItems,
      shippingAddress: { ...input.shippingAddress },
      shippingMethod: quote.shippingMethod,
      subtotalMinor: quote.subtotalMinor,
      discountMinor: quote.discountMinor,
      shippingMinor: quote.shippingMinor,
      totalMinor: quote.totalMinor,
      currency: 'INR',
      status: 'confirmed',
      // Demo only. A verified payment provider webhook must set this in production.
      paymentStatus: 'demo_pending',
      promoCode: quote.promotion?.code,
      notes: input.notes?.trim() || undefined,
      createdAt: now.toISOString(),
      idempotencyKey: input.idempotencyKey,
    };

    appendLocalOrder(order);

    // Demo stock decrement. Production must do this atomically in a trusted
    // transaction that also checks availability and prevents double ordering.
    quote.items.forEach((item) => {
      const product = db.products.find((candidate) => candidate.id === item.product.id);
      const variant = product?.variants.find((candidate) => candidate.id === item.variant.id);
      if (variant) variant.stock = Math.max(0, variant.stock - item.line.quantity);
    });

    if (quote.promotion) {
      const promotion = db.promotions.find((item) => item.id === quote.promotion?.id);
      if (promotion) promotion.usageCount += 1;
    }

    return order;
  },
};
