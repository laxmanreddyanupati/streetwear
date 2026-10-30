import type {
  CartItem,
  Order,
  PlaceOrderInput,
  Promotion,
  PromotionValidation,
  ShippingMethod,
} from '@/types';

export interface CheckoutQuote {
  items: CartItem[];
  subtotalMinor: number;
  discountMinor: number;
  shippingMinor: number;
  totalMinor: number;
  shippingMethod: ShippingMethod;
  promotion?: Promotion;
}

export interface CheckoutService {
  listShippingMethods(): Promise<ShippingMethod[]>;
  validatePromotion(code: string, subtotalMinor: number): Promise<PromotionValidation>;
  getQuote(input: {
    items: CartItem[];
    shippingMethodId: string;
    promoCode?: string;
  }): Promise<CheckoutQuote>;
  /**
   * Mock implementation only. In production this must run in a Cloud Function
   * that re-validates prices, stock, promotions and payment status.
   */
  placeOrder(input: PlaceOrderInput, items: CartItem[]): Promise<Order>;
}
