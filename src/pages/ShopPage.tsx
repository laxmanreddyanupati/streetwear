import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import type { SortOption } from '@/types';
import { useCategories, useCollections, useFacets, useProducts } from '@/hooks/useCatalog';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ProductGrid } from '@/components/product/ProductGrid';
import {
  PRICE_RANGES,
  ProductFilters,
  type ShopFilterValues,
} from '@/components/product/ProductFilters';
import { PageIntro } from '@/components/common/PageIntro';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/utils/cn';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'popularity', label: 'Most popular' },
];

function readMultiParam(params: URLSearchParams, key: string) {
  return (params.get(key) ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function readSort(value: string | null): SortOption {
  return SORT_OPTIONS.some((option) => option.value === value)
    ? (value as SortOption)
    : 'featured';
}

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: facets } = useFacets();
  const { data: categories } = useCategories();
  const { data: collections } = useCollections();

  const q = params.get('q') ?? '';
  const category = params.get('category') ?? undefined;
  const collection = params.get('collection') ?? undefined;
  const sizes = readMultiParam(params, 'size');
  const colors = readMultiParam(params, 'color');
  const price = params.get('price') ?? undefined;
  const inStock = params.get('stock') === '1';
  const sort = readSort(params.get('sort'));
  const priceRange = PRICE_RANGES.find((range) => range.id === price);

  const filters = useMemo(
    () => ({
      query: q || undefined,
      categorySlug: category,
      collectionSlug: collection,
      sizes: sizes.length ? sizes : undefined,
      colors: colors.length ? colors : undefined,
      minPriceMinor: priceRange?.min,
      maxPriceMinor: priceRange?.max,
      inStockOnly: inStock,
      sort,
      pageSize: 9,
    }),
    [q, category, collection, sizes, colors, priceRange?.min, priceRange?.max, inStock, sort],
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useProducts(filters);

  const products = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const activeFilters: ShopFilterValues = {
    category,
    collection,
    sizes,
    colors,
    price,
    inStock,
  };

  const categoryName = categories?.find((item) => item.slug === category)?.name;
  const collectionName = collections?.find((item) => item.slug === collection)?.name;
  const title = q
    ? `Search: “${q}”`
    : categoryName ?? collectionName ?? 'All pieces';

  const description = q
    ? 'Pieces matching your search across the collection.'
    : categoryName
      ? categories?.find((item) => item.slug === category)?.description
      : collectionName
        ? collections?.find((item) => item.slug === collection)?.description
        : 'Every piece currently in the studio. Small runs, considered materials and a palette that holds together.';

  function updateParams(patch: Partial<ShopFilterValues> & { q?: string; sort?: SortOption }) {
    const next = new URLSearchParams(params);
    const singleKeys: Array<keyof ShopFilterValues> = ['category', 'collection', 'price'];
    singleKeys.forEach((key) => {
      if (key in patch) {
        const value = patch[key];
        if (value) next.set(key, String(value));
        else next.delete(key);
      }
    });
    if ('sizes' in patch) {
      const value = patch.sizes ?? [];
      if (value.length) next.set('size', value.join(','));
      else next.delete('size');
    }
    if ('colors' in patch) {
      const value = patch.colors ?? [];
      if (value.length) next.set('color', value.join(','));
      else next.delete('color');
    }
    if ('inStock' in patch) {
      if (patch.inStock) next.set('stock', '1');
      else next.delete('stock');
    }
    if ('q' in patch) {
      if (patch.q) next.set('q', patch.q);
      else next.delete('q');
    }
    if ('sort' in patch && patch.sort) {
      if (patch.sort === 'featured') next.delete('sort');
      else next.set('sort', patch.sort);
    }
    setParams(next, { replace: true });
  }

  function clearFilters() {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (sort !== 'featured') next.set('sort', sort);
    setParams(next, { replace: true });
  }

  usePageMeta({
    title: title === 'All pieces' ? 'Shop all pieces' : title,
    description,
  });

  const filterPanel = (
    <ProductFilters
      facets={facets}
      categories={categories}
      collections={collections}
      value={activeFilters}
      onChange={updateParams}
      onClear={clearFilters}
    />
  );

  return (
    <>
      <PageIntro
        eyebrow={`Shop — ${isLoading ? 'loading' : `${total} ${total === 1 ? 'piece' : 'pieces'}`}`}
        title={title}
        description={description}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }]}
        aside={
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <FilterChip label={categoryName ?? category} onRemove={() => updateParams({ category: undefined })} />
            )}
            {collection && (
              <FilterChip
                label={collectionName ?? collection}
                onRemove={() => updateParams({ collection: undefined })}
              />
            )}
            {q && <FilterChip label={`“${q}”`} onRemove={() => updateParams({ q: '' })} />}
          </div>
        }
      />

      <div className="container-editorial py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">{filterPanel}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
              <p className="text-xs text-ink-muted" aria-live="polite">
                {isLoading ? 'Loading pieces…' : `${total} ${total === 1 ? 'piece' : 'pieces'}`}
                {(sizes.length || colors.length || price || inStock) && ' — filtered'}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal aria-hidden="true" /> Filters
                  {(sizes.length || colors.length || price || inStock || category || collection) && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-ink text-[9px] text-bone-light">
                      {[category, collection, price, inStock ? 'stock' : '', ...sizes, ...colors].filter(Boolean).length}
                    </span>
                  )}
                </Button>
                <label htmlFor="sort" className="sr-only">
                  Sort products
                </label>
                <Select value={sort} onValueChange={(value) => updateParams({ sort: value as SortOption })}>
                  <SelectTrigger id="sort" className="h-9 w-[190px] border-ink/20 bg-transparent text-xs">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(sizes.length > 0 || colors.length > 0 || price || inStock || category || collection) && (
              <div className="flex flex-wrap gap-2 pt-4">
                {category && (
                  <FilterChip label={categoryName ?? category} onRemove={() => updateParams({ category: undefined })} />
                )}
                {collection && (
                  <FilterChip
                    label={collectionName ?? collection}
                    onRemove={() => updateParams({ collection: undefined })}
                  />
                )}
                {sizes.map((size) => (
                  <FilterChip
                    key={size}
                    label={`Size ${size}`}
                    onRemove={() => updateParams({ sizes: sizes.filter((item) => item !== size) })}
                  />
                ))}
                {colors.map((colorSlug) => (
                  <FilterChip
                    key={colorSlug}
                    label={facets?.colors.find((color) => color.slug === colorSlug)?.name ?? colorSlug}
                    onRemove={() => updateParams({ colors: colors.filter((item) => item !== colorSlug) })}
                  />
                ))}
                {priceRange && (
                  <FilterChip label={priceRange.label} onRemove={() => updateParams({ price: undefined })} />
                )}
                {inStock && (
                  <FilterChip label="In stock" onRemove={() => updateParams({ inStock: false })} />
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[10px] uppercase tracking-[0.1em] text-ink-muted underline underline-offset-4 hover:text-ink"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="pt-8">
              {!isLoading && products.length === 0 ? (
                <EmptyState
                  title="No pieces match"
                  description="Try removing a filter, widening the price range or searching for a different term."
                  action={
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button onClick={clearFilters}>Clear filters</Button>
                      <Button asChild variant="outline">
                        <Link to="/shop">Browse everything</Link>
                      </Button>
                    </div>
                  }
                />
              ) : (
                <>
                  <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    skeletonCount={9}
                    columns={3}
                    className={cn(isLoading && 'opacity-90')}
                  />
                  <div className="mt-12 flex flex-col items-center gap-3">
                    {hasNextPage ? (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => void fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? 'Loading…' : 'Load more pieces'}
                      </Button>
                    ) : (
                      products.length > 0 && (
                        <p className="text-[10px] uppercase tracking-label text-ink-muted">
                          You have seen all {total} pieces
                        </p>
                      )
                    )}
                    <p className="text-[10px] text-ink-muted">
                      Showing {products.length} of {total}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[90vw] max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine by category, collection, size, colour and price.</SheetDescription>
          </SheetHeader>
          <div className="p-5">
            {filterPanel}
            <Button className="mt-6 w-full" onClick={() => setMobileFiltersOpen(false)}>
              Show {total} {total === 1 ? 'piece' : 'pieces'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-ink/20 bg-bone px-2.5 py-1 text-[10px] font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-ink-muted transition-colors hover:text-ink"
        aria-label={`Remove filter ${label}`}
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </span>
  );
}
