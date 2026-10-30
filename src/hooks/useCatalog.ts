import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { ProductFilters } from '@/types';

export function useProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.products(filters),
    queryFn: ({ pageParam }) => catalogService.listProducts({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: queryKeys.allProducts,
    queryFn: () => catalogService.listAllProducts(),
    staleTime: 5 * 60_000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => catalogService.getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(productId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.relatedProducts(productId ?? ''),
    queryFn: () => catalogService.getRelatedProducts(productId!, 4),
    enabled: Boolean(productId),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => catalogService.listCategories(),
    staleTime: 10 * 60_000,
  });
}

export function useFacets() {
  return useQuery({
    queryKey: queryKeys.facets,
    queryFn: () => catalogService.getFacets(),
    staleTime: 10 * 60_000,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections,
    queryFn: () => catalogService.listCollections(),
    staleTime: 10 * 60_000,
  });
}

export function useCollection(slug: string) {
  return useQuery({
    queryKey: queryKeys.collection(slug),
    queryFn: () => catalogService.getCollection(slug),
    enabled: Boolean(slug),
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => catalogService.searchProducts(query, 4),
    enabled: query.trim().length > 1,
    staleTime: 60_000,
  });
}
