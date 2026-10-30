import type {
  Category,
  Collection,
  DashboardStats,
  InventoryRecord,
  OrderStatus,
  Product,
  ProductStatus,
  Promotion,
} from '@/types';
import type {
  AdminCategoryInput,
  AdminCollectionInput,
  AdminProductInput,
  AdminPromotionInput,
  AdminService,
} from '@/services/contracts/admin';
import { db, simulateLatency } from './db';
import { orderService } from './orders';
import { accountService } from './account';
import { newsletterService } from './newsletter';
import { createId } from '@/utils/storage';
import { slugify } from '@/utils/misc';

function findCategory(slug: string) {
  return db.categories.find((category) => category.slug === slug) ?? db.categories[0]!;
}

function toInventory(product: Product): InventoryRecord[] {
  return product.variants.map((variant) => ({
    productId: product.id,
    variantId: variant.id,
    sku: variant.sku,
    productName: product.name,
    size: variant.size,
    color: product.colors.find((color) => color.slug === variant.colorSlug)?.name ?? variant.colorSlug,
    stock: variant.stock,
    reserved: 0,
    lowStockThreshold: 3,
    updatedAt: new Date().toISOString(),
  }));
}

function buildVariants(input: AdminProductInput, productId: string, slug: string) {
  const previous = input.id ? db.products.find((product) => product.id === input.id) : undefined;
  return input.colors.flatMap((color) =>
    input.sizes.map((size) => {
      const oldVariant = previous?.variants.find(
        (variant) => variant.colorSlug === color.slug && variant.size === size,
      );
      return {
        id: `${slug}-${color.slug}-${size.toLowerCase()}`,
        productId,
        sku:
          oldVariant?.sku ??
          `SW-${slug.slice(0, 3).toUpperCase()}-${color.slug.slice(0, 2).toUpperCase()}-${size.toUpperCase()}`,
        size,
        colorSlug: color.slug,
        priceMinor: input.priceMinor,
        compareAtPriceMinor: input.compareAtPriceMinor,
        stock: oldVariant?.stock ?? 5,
      };
    }),
  );
}

export const adminService: AdminService = {
  async getDashboard(): Promise<DashboardStats> {
    await simulateLatency(180);
    const [orders, customers, newsletter, inventory] = await Promise.all([
      orderService.listAll(),
      accountService.listCustomers(),
      newsletterService.list(),
      this.listInventory(),
    ]);
    const validOrders = orders.filter((order) => order.status !== 'cancelled');
    const revenueMinor = validOrders.reduce((sum, order) => sum + order.totalMinor, 0);
    const ordersByStatus: Record<OrderStatus, number> = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      ordersByStatus[order.status] += 1;
    });
    const productTotals = new Map<string, { name: string; units: number; revenueMinor: number }>();
    validOrders.forEach((order) => {
      order.items.forEach((item) => {
        const current = productTotals.get(item.productId) ?? {
          name: item.productName,
          units: 0,
          revenueMinor: 0,
        };
        current.units += item.quantity;
        current.revenueMinor += item.lineTotalMinor;
        productTotals.set(item.productId, current);
      });
    });
    return {
      revenueMinor,
      orderCount: orders.length,
      customerCount: customers.length,
      lowStockCount: inventory.filter((record) => record.stock <= record.lowStockThreshold).length,
      newsletterCount: newsletter.length,
      averageOrderValueMinor: validOrders.length
        ? Math.round(revenueMinor / validOrders.length)
        : 0,
      ordersByStatus,
      recentOrders: orders.slice(0, 5),
      lowStock: inventory
        .filter((record) => record.stock <= record.lowStockThreshold)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 8),
      topProducts: [...productTotals.entries()]
        .map(([productId, value]) => ({ productId, ...value }))
        .sort((a, b) => b.units - a.units)
        .slice(0, 5),
    };
  },

  async listProducts() {
    await simulateLatency(100);
    return [...db.products];
  },

  async getProduct(id) {
    await simulateLatency(80);
    return db.products.find((product) => product.id === id) ?? null;
  },

  async upsertProduct(input: AdminProductInput) {
    await simulateLatency(220);
    const category = findCategory(input.categorySlug);
    const slug = slugify(input.slug || input.name);
    if (!slug) throw new Error('A product slug is required.');
    if (!input.colors.length) throw new Error('Add at least one colour.');
    if (!input.sizes.length) throw new Error('Add at least one size.');
    const existing = input.id ? db.products.find((product) => product.id === input.id) : undefined;
    const id = existing?.id ?? createId('prd');
    const now = new Date().toISOString();
    const product: Product = {
      id,
      slug,
      name: input.name.trim(),
      subtitle: input.subtitle.trim(),
      description: input.description.trim(),
      story: existing?.story ?? input.description.trim(),
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name,
      collectionIds: existing?.collectionIds ?? ['col_new'],
      images: input.images.length
        ? input.images
        : [{ id: `${id}_img_1`, url: '/images/product-tee-white.jpg', alt: input.name }],
      priceMinor: input.priceMinor,
      compareAtPriceMinor: input.compareAtPriceMinor,
      currency: 'INR',
      colors: input.colors,
      sizes: input.sizes,
      variants: buildVariants({ ...input, id: existing?.id }, id, slug),
      details: input.details,
      materials: input.materials,
      care: input.care,
      badge: input.badge,
      isNew: input.isNew,
      isBestSeller: input.isBestSeller,
      isFeatured: input.isFeatured,
      popularity: existing?.popularity ?? 50,
      rating: existing?.rating ?? 0,
      reviewCount: existing?.reviewCount ?? 0,
      createdAt: existing?.createdAt ?? now,
      status: input.status,
    };
    const index = db.products.findIndex((item) => item.id === id);
    if (index >= 0) db.products[index] = product;
    else db.products.unshift(product);
    return product;
  },

  async listCategories() {
    await simulateLatency(80);
    return [...db.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async upsertCategory(input: AdminCategoryInput) {
    await simulateLatency(150);
    const name = input.name.trim();
    if (!name) throw new Error('Category name is required.');
    const existing = input.id ? db.categories.find((category) => category.id === input.id) : undefined;
    const category: Category = {
      id: existing?.id ?? createId('cat'),
      slug: slugify(name),
      name,
      description: input.description.trim(),
      imageUrl: input.imageUrl || '/images/category-tops.jpg',
      sortOrder: existing?.sortOrder ?? db.categories.length + 1,
    };
    const index = db.categories.findIndex((item) => item.id === category.id);
    if (index >= 0) db.categories[index] = category;
    else db.categories.push(category);
    return category;
  },

  async listInventory() {
    await simulateLatency(90);
    return db.products.flatMap(toInventory);
  },

  async updateStock(variantId, stock) {
    await simulateLatency(120);
    if (!Number.isSafeInteger(stock) || stock < 0) {
      throw new Error('Stock must be a whole number of zero or more.');
    }
    for (const product of db.products) {
      const variant = product.variants.find((item) => item.id === variantId);
      if (variant) {
        variant.stock = stock;
        const record = toInventory(product).find((item) => item.variantId === variantId);
        if (!record) throw new Error('Inventory record not found.');
        return record;
      }
    }
    throw new Error('Variant not found.');
  },

  async listOrders() {
    await simulateLatency(100);
    return orderService.listAll();
  },

  async updateOrderStatus(orderId, status) {
    return orderService.updateStatus(orderId, status);
  },

  async listCustomers() {
    await simulateLatency(80);
    return accountService.listCustomers();
  },

  async listPromotions() {
    await simulateLatency(80);
    return [...db.promotions];
  },

  async upsertPromotion(input: AdminPromotionInput) {
    await simulateLatency(150);
    const code = input.code.trim().toUpperCase();
    if (!code) throw new Error('Promotion code is required.');
    if (db.promotions.some((promotion) => promotion.code === code && promotion.id !== input.id)) {
      throw new Error('That code already exists.');
    }
    const existing = input.id ? db.promotions.find((promotion) => promotion.id === input.id) : undefined;
    const promotion: Promotion = {
      id: existing?.id ?? createId('promo'),
      code,
      description: input.description.trim(),
      type: input.type,
      value: input.value,
      minSubtotalMinor: input.minSubtotalMinor,
      active: input.active,
      usageCount: existing?.usageCount ?? 0,
      startsAt: existing?.startsAt ?? new Date().toISOString(),
      endsAt: existing?.endsAt,
      usageLimit: existing?.usageLimit,
    };
    const index = db.promotions.findIndex((item) => item.id === promotion.id);
    if (index >= 0) db.promotions[index] = promotion;
    else db.promotions.unshift(promotion);
    return promotion;
  },

  async togglePromotion(promotionId, active) {
    await simulateLatency(100);
    const promotion = db.promotions.find((item) => item.id === promotionId);
    if (!promotion) throw new Error('Promotion not found.');
    promotion.active = active;
    return promotion;
  },

  async listCollections() {
    await simulateLatency(80);
    return [...db.collections].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getCollection(slug) {
    await simulateLatency(80);
    return db.collections.find((c) => c.slug === slug) ?? null;
  },

  async upsertCollection(input: AdminCollectionInput) {
    await simulateLatency(180);
    const name = input.name.trim();
    if (!name) throw new Error('Collection name is required.');
    const slug = input.slug.trim();
    if (!slug) throw new Error('Collection slug is required.');

    // Validate slug uniqueness — skip the record being updated
    const slugConflict = db.collections.find((c) => c.slug === slug && c.id !== input.id);
    if (slugConflict) throw new Error(`Slug "${slug}" is already used by "${slugConflict.name}".`);

    const now = new Date().toISOString();
    const existing = input.id ? db.collections.find((c) => c.id === input.id) : undefined;

    const publishedAt =
      input.status === 'published'
        ? (existing?.publishedAt ?? input.publishedAt ?? now)
        : existing?.publishedAt ?? input.publishedAt;

    const unpublishedAt =
      input.status === 'archived'
        ? (existing?.unpublishedAt ?? input.unpublishedAt ?? now)
        : existing?.unpublishedAt ?? input.unpublishedAt;

    const collection: Collection = {
      id: existing?.id ?? createId('col'),
      slug,
      name,
      tagline: input.tagline.trim(),
      description: input.description.trim(),
      story: input.story?.trim(),
      imageUrl: input.imageUrl || '/images/collection-essentials.jpg',
      additionalImages: input.additionalImages,
      featured: existing?.featured ?? false,
      productIds: input.productIds,
      sortOrder: input.sortOrder,
      status: input.status,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      publishedAt,
      unpublishedAt,
    };

    const index = db.collections.findIndex((item) => item.id === collection.id);
    if (index >= 0) db.collections[index] = collection;
    else db.collections.push(collection);
    return collection;
  },

  async deleteCollection(id) {
    await simulateLatency(120);
    const index = db.collections.findIndex((c) => c.id === id);
    if (index < 0) throw new Error('Collection not found.');
    // Does NOT delete products — only removes the collection record
    db.collections.splice(index, 1);
  },

  async reorderCollections(ids) {
    await simulateLatency(100);
    ids.forEach((id, idx) => {
      const collection = db.collections.find((c) => c.id === id);
      if (collection) collection.sortOrder = idx + 1;
    });
  },
};

export type { ProductStatus };
