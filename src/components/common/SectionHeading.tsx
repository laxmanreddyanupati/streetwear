import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        {eyebrow && <p className="label-xs mb-4 text-ink-muted">{eyebrow}</p>}
        <h2 className={cn('display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl', titleClassName)}>
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
