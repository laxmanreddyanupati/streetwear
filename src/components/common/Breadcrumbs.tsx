import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-2 text-[11px] text-ink-muted', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {item.to && !isLast ? (
              <Link to={item.to} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-ink' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="size-3" aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}
