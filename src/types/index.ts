/**
 * Domain models for the STREETWEAR. storefront.
 *
 * Money rule: every monetary amount is stored as an integer in minor currency
 * units (paise for INR). Never mix currencies. Components format via
 * `formatMoney`, never by inventing their own arithmetic.
 */

export const SUPPORTED_CURRENCY = 'INR' as const;
export type CurrencyCode = typeof SUPPORTED_CURRENCY;

export type IsoDateString = string;

export interface Money {
  amountMinor: number;
  currency: CurrencyCode;
}

export type ProductStatus = 'active' | 'draft' | 'archived';
export type ProductBadge = 'New' | 'Bestseller' | 'Limited' | 'Almost gone' | null;

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductColor {
  name: string;
  slug: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  colorSlug: string;
  /** Minor units (paise). */
  priceMinor: number;
  /** Minor units (paise). Only set for reduced-price items. */
  compareAtPriceMinor?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  collectionIds: string[];
  images: ProductImage[];
  /** Display price in minor units. Variants may override. */
  priceMinor: number;
  compareAtPriceMinor?: number;
  currency: CurrencyCode;
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
  details: string[];
  materials: string;
  care: string;
  badge: ProductBadge;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  popularity: number;
  rating: number;
  reviewCount: number;
  createdAt: IsoDateString;
  status: ProductStatus;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

export interface InventoryRecord {
  productId: string;
  variantId: string;
  sku: string;
  productName: string;
  size: string;
  color: string;
  stock: number;
  reserved: number;
  lowStockThreshold: number;
  updatedAt: IsoDateString;
}

export interface CartLine {
  variantId: string;
  quantity: number;
}

export interface CartItem {
  line: CartLine;
  product: Product;
  variant: ProductVariant;
  color: ProductColor;
  unitPriceMinor: number;
  lineTotalMinor: number;
}

export interface CartTotals {
  itemCount: number;
  subtotalMinor: number;
  discountMinor: number;
  shippingMinor: number;
  totalMinor: number;
  currency: CurrencyCode;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popularity';

export interface ProductFilters {
  query?: string;
  categorySlug?: string;
  collectionSlug?: string;
  sizes?: string[];
  colors?: string[];
  minPriceMinor?: number;
  maxPriceMinor?: number;
  inStockOnly?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: IsoDateString;
  /** Demo adapter marker. Always true until Firebase Auth is connected. */
  demo: true;
}

export interface Address {
  id: string;
  customerId: string;
  label?: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'demo_pending' | 'demo_authorised' | 'refunded';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  priceMinor: number;
  estimatedDays: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  variantLabel: string;
  sku: string;
  imageUrl: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
}

export interface Order {
  id: string;
  number: string;
  customerId?: string;
  email: string;
  items: OrderItem[];
  shippingAddress: Omit<Address, 'id' | 'customerId' | 'isDefault'>;
  shippingMethod: ShippingMethod;
  subtotalMinor: number;
  discountMinor: number;
  shippingMinor: number;
  totalMinor: number;
  currency: CurrencyCode;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  promoCode?: string;
  notes?: string;
  createdAt: IsoDateString;
  /** Client-generated key used by the mock service to reject duplicates. */
  idempotencyKey: string;
}

export type PromotionType = 'percentage' | 'fixed' | 'free_shipping';

export interface Promotion {
  id: string;
  code: string;
  description: string;
  type: PromotionType;
  /** Percent (0-100) for percentage, minor units for fixed. */
  value: number;
  minSubtotalMinor?: number;
  active: boolean;
  startsAt?: IsoDateString;
  endsAt?: IsoDateString;
  usageLimit?: number;
  usageCount: number;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: IsoDateString;
  source: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: IsoDateString;
  source: string;
}

export interface DashboardStats {
  revenueMinor: number;
  orderCount: number;
  customerCount: number;
  lowStockCount: number;
  newsletterCount: number;
  averageOrderValueMinor: number;
  ordersByStatus: Record<OrderStatus, number>;
  recentOrders: Order[];
  lowStock: InventoryRecord[];
  topProducts: Array<{ productId: string; name: string; units: number; revenueMinor: number }>;
}

export interface CheckoutAddressInput {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PlaceOrderInput {
  customer?: Customer | null;
  email: string;
  shippingAddress: CheckoutAddressInput;
  shippingMethod: ShippingMethod;
  promoCode?: string;
  notes?: string;
  idempotencyKey: string;
}

export interface PromotionValidation {
  valid: boolean;
  promotion?: Promotion;
  discountMinor: number;
  message: string;
}
