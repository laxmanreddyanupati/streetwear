import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { catalogService } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';

export function SearchSuggestions({
  query,
  onNavigate,
}: {
  query: string;
  onNavigate: () => void;
}) {
  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => catalogService.searchProducts(query, 4),
    enabled: query.trim().length > 1,
  });

  if (query.trim().length < 2) return null;

  return (
    <div className="mt-3 border-t border-ink/10 pt-3" aria-live="polite">
      <p className="label-xs mb-2 text-ink-muted">
        {isFetching ? 'Searching…' : `Results for “${query.trim()}”`}
      </p>
      {isFetching && !data ? (
        <div className="space-y-2">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-16 w-full" />
          ))}
        </div>
      ) : data?.length ? (
        <ul className="divide-y divide-ink/10">
          {data.map((product) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.slug}`}
                onClick={onNavigate}
                className="flex items-center gap-3 py-2.5 transition-colors hover:bg-bone/60"
              >
                <img
                  src={product.images[0]?.url}
                  alt=""
                  className="h-14 w-11 object-cover"
                  loading="lazy"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{product.name}</span>
                  <span className="block text-xs text-ink-muted">{product.categoryName}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-3 text-sm text-ink-muted">
          No pieces matched. Try “tee”, “outerwear” or “denim”.
        </p>
      )}
    </div>
  );
}
