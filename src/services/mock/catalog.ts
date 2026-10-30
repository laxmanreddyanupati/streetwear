import type { ProductFilters, Product } from '@/types';
import type { CatalogService } from '@/services/contracts/catalog';
import { db, simulateLatency } from './db';

function matchesQuery(product: Product, query: string) {
  const haystack = [
    product.name,
    product.subtitle,
    product.description,
    product.categoryName,
    ...product.colors.map((color) => color.name),
    ...product.sizes,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase().trim());
}

function hasAvailableSize(product: Product, sizes: string[] | undefined) {
  if (!sizes?.length) return true;
  return product.variants.some(
    (variant) => sizes.includes(variant.size) && variant.stock > 0,
  );
}

function hasAvailableColor(product: Product, colors: string[] | undefined) {
  if (!colors?.length) return true;
  return product.variants.some(
    (variant) => colors.includes(variant.colorSlug) && variant.stock > 0,
  );
}

function filterProducts(filters: ProductFilters = {}): Product[] {
  const query = filters.query?.trim() ?? '';
  const active = db.products.filter((product) => product.status === 'active');

  const filtered = active.filter((product) => {
    if (query && !matchesQuery(product, query)) return false;
    if (filters.categorySlug && product.categorySlug !== filters.categorySlug) return false;
    if (filters.collectionSlug) {
      const collection = db.collections.find((item) => item.slug === filters.collectionSlug);
      if (!collection || !product.collectionIds.includes(collection.id)) return false;
    }
    if (filters.minPriceMinor !== undefined && product.priceMinor < filters.minPriceMinor)
      return false;
    if (filters.maxPriceMinor !== undefined && product.priceMinor > filters.maxPriceMinor)
      return false;
    if (!hasAvailableSize(product, filters.sizes)) return false;
    if (!hasAvailableColor(product, filters.colors)) return false;
    if (filters.inStockOnly && !product.variants.some((variant) => variant.stock > 0)) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort ?? 'featured') {
    case 'newest':
      sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      break;
    case 'price-asc':
      sorted.sort((a, b) => a.priceMinor - b.priceMinor);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.priceMinor - a.priceMinor);
      break;
    case 'popularity':
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'featured':
    default:
      sorted.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return b.popularity - a.popularity;
      });
  }

  return sorted;
}

export const catalogService: CatalogService = {
  async listProducts(filters = {}) {
    await simulateLatency();
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? 9));
    const all = filterProducts(filters);
    const start = (page - 1) * pageSize;
    return {
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
      hasMore: start + pageSize < all.length,
    };
  },

  async listAllProducts() {
    await simulateLatency(80);
    return [...db.products];
  },

  async getFacets() {
    await simulateLatency(60);
    const active = db.products.filter((product) => product.status === 'active');
    const colors = new Map<string, Product['colors'][number]>();
    const sizes = new Set<string>();
    active.forEach((product) => {
      product.colors.forEach((color) => colors.set(color.slug, color));
      product.sizes.forEach((size) => sizes.add(size));
    });
    const prices = active.map((product) => product.priceMinor);
    return {
      sizes: [...sizes],
      colors: [...colors.values()],
      minPriceMinor: prices.length ? Math.min(...prices) : 0,
      maxPriceMinor: prices.length ? Math.max(...prices) : 0,
    };
  },

  async getProductBySlug(slug) {
    await simulateLatency(120);
    return db.products.find((product) => product.slug === slug && product.status === 'active') ?? null;
  },

  async getProductById(id) {
    await simulateLatency(80);
    return db.products.find((product) => product.id === id) ?? null;
  },

  async searchProducts(query, limit = 5) {
    if (!query.trim()) return [];
    return filterProducts({ query, sort: 'popularity' }).slice(0, limit);
  },

  async getRelatedProducts(productId, limit = 4) {
    await simulateLatency(120);
    const product = db.products.find((item) => item.id === productId);
    if (!product) return [];
    const active = db.products.filter(
      (item) => item.id !== productId && item.status === 'active',
    );
    const scored = active
      .map((item) => {
        const sameCategory = item.categorySlug === product.categorySlug ? 2 : 0;
        const sharedCollections = item.collectionIds.filter((collectionId) =>
          product.collectionIds.includes(collectionId),
        ).length;
        return { item, score: sameCategory + sharedCollections };
      })
      .sort((a, b) => b.score - a.score || b.item.popularity - a.item.popularity);
    return scored.slice(0, limit).map(({ item }) => item);
  },

  async listCategories() {
    await simulateLatency(80);
    return [...db.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getCategory(slug) {
    await simulateLatency(80);
    return db.categories.find((category) => category.slug === slug) ?? null;
  },

  async listCollections() {
    await simulateLatency(80);
    return [...db.collections];
  },

  async getCollection(slug) {
    await simulateLatency(80);
    return db.collections.find((collection) => collection.slug === slug) ?? null;
  },
};
