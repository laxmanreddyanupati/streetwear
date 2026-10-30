import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border border-dashed border-ink/20 bg-bone/50 px-6 py-20 text-center',
        className,
      )}
    >
      {icon && <div className="mb-5 text-ink-muted">{icon}</div>}
      <h2 className="display text-3xl">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">{description}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
