import { formatMoney } from '@/utils/money';
import { cn } from '@/utils/cn';

export function Price({
  priceMinor,
  compareAtPriceMinor,
  className,
  size = 'default',
}: {
  priceMinor: number;
  compareAtPriceMinor?: number;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}) {
  const hasCompare = Boolean(compareAtPriceMinor && compareAtPriceMinor > priceMinor);
  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span
        className={cn(
          'font-medium tabular-nums text-ink',
          size === 'sm' && 'text-xs',
          size === 'default' && 'text-sm',
          size === 'lg' && 'text-xl',
          hasCompare && 'text-clay',
        )}
      >
        {formatMoney(priceMinor)}
      </span>
      {hasCompare && (
        <span className={cn('text-ink-muted line-through', size === 'lg' ? 'text-sm' : 'text-xs')}>
          <span className="sr-only">Original price </span>
          {formatMoney(compareAtPriceMinor!)}
        </span>
      )}
    </div>
  );
}
