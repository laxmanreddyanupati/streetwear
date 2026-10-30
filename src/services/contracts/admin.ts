import type {
  Category,
  Customer,
  DashboardStats,
  InventoryRecord,
  Order,
  OrderStatus,
  Product,
  ProductBadge,
  ProductColor,
  ProductImage,
  ProductStatus,
  Promotion,
  PromotionType,
} from '@/types';

export interface AdminProductInput {
  id?: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  categorySlug: string;
  priceMinor: number;
  compareAtPriceMinor?: number;
  status: ProductStatus;
  badge: ProductBadge;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  colors: ProductColor[];
  sizes: string[];
  images: ProductImage[];
  details: string[];
  materials: string;
  care: string;
}

export interface AdminCategoryInput {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface AdminPromotionInput {
  id?: string;
  code: string;
  description: string;
  type: PromotionType;
  value: number;
  minSubtotalMinor?: number;
  active: boolean;
}

export interface AdminService {
  getDashboard(): Promise<DashboardStats>;
  listProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  upsertProduct(input: AdminProductInput): Promise<Product>;
  listCategories(): Promise<Category[]>;
  upsertCategory(input: AdminCategoryInput): Promise<Category>;
  listInventory(): Promise<InventoryRecord[]>;
  updateStock(variantId: string, stock: number): Promise<InventoryRecord>;
  listOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
  listCustomers(): Promise<Customer[]>;
  listPromotions(): Promise<Promotion[]>;
  upsertPromotion(input: AdminPromotionInput): Promise<Promotion>;
  togglePromotion(promotionId: string, active: boolean): Promise<Promotion>;
}
