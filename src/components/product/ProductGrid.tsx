import type { Product } from '@/types';
import { cn } from '@/utils/cn';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  className,
  columns = 4,
}: {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:gap-x-7 lg:gap-y-12',
        columns === 4 ? 'md:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-3',
        className,
      )}
    >
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        : products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
    </div>
  );
}
