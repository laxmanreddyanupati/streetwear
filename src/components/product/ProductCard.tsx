import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/common/Price';
import { cn } from '@/utils/cn';

const badgeVariant = {
  New: 'acid',
  Bestseller: 'default',
  Limited: 'outline',
  'Almost gone': 'warning',
} as const;

export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const secondaryImage = product.images[1] ?? product.images[0];
  const isSoldOut = !product.variants.some((variant) => variant.stock > 0);

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <Link
        to={`/product/${product.slug}`}
        className="media-zoom relative block aspect-[3/4]"
        aria-label={`${product.name} — ${product.subtitle}`}
      >
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt ?? product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            secondaryImage && secondaryImage.url !== product.images[0]?.url
              ? 'group-hover:opacity-0'
              : '',
          )}
        />
        {secondaryImage && secondaryImage.url !== product.images[0]?.url && (
          <img
            src={secondaryImage.url}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {isSoldOut ? (
            <Badge variant="secondary">Sold out</Badge>
          ) : (
            product.badge && (
              <Badge variant={badgeVariant[product.badge]}>{product.badge}</Badge>
            )
          )}
          {product.compareAtPriceMinor && !isSoldOut && product.badge !== 'New' && (
            <Badge variant="outline" className="bg-bone-light/85 backdrop-blur-sm">
              Reduced
            </Badge>
          )}
        </div>

        <span className="absolute inset-x-3 bottom-3 hidden translate-y-2 items-center justify-center bg-bone-light/95 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          View piece
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium leading-5">
              <Link to={`/product/${product.slug}`} className="link-underline">
                {product.name}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-ink-muted">{product.subtitle}</p>
          </div>
          <Price
            priceMinor={product.priceMinor}
            compareAtPriceMinor={product.compareAtPriceMinor}
            className="shrink-0 flex-col items-end gap-0.5"
          />
        </div>
        <div className="mt-2.5 flex items-center gap-1.5" aria-label={`${product.colors.length} colours available`}>
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.slug}
              title={color.name}
              className="size-2.5 rounded-full border border-ink/20"
              style={{ backgroundColor: color.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[9px] text-ink-muted">+{product.colors.length - 4}</span>
          )}
          <span className="ml-auto text-[10px] tabular-nums text-ink-muted">
            {product.rating.toFixed(1)} ★
          </span>
        </div>
      </div>
    </article>
  );
}
