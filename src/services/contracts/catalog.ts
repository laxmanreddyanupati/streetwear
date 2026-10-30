import type {
  Category,
  Collection,
  PaginatedProducts,
  Product,
  ProductColor,
  ProductFilters,
} from '@/types';

export interface CatalogFacets {
  sizes: string[];
  colors: ProductColor[];
  minPriceMinor: number;
  maxPriceMinor: number;
}

export interface CatalogService {
  listProducts(filters?: ProductFilters): Promise<PaginatedProducts>;
  listAllProducts(): Promise<Product[]>;
  getFacets(): Promise<CatalogFacets>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: string): Promise<Product | null>;
  searchProducts(query: string, limit?: number): Promise<Product[]>;
  getRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
  listCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | null>;
  listCollections(): Promise<Collection[]>;
  getCollection(slug: string): Promise<Collection | null>;
}
