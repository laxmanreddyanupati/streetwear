import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

export function PageIntro({
  eyebrow,
  title,
  description,
  breadcrumbs,
  aside,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  breadcrumbs?: Crumb[];
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('border-b border-ink/10 pb-10 pt-10 sm:pb-14 sm:pt-14', className)}>
      <div className="container-editorial">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-8" />}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow && <p className="label-xs mb-4 text-ink-muted">{eyebrow}</p>}
            <h1 className="display text-5xl leading-[0.92] sm:text-7xl lg:text-8xl">{title}</h1>
            {description && (
              <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
                {description}
              </p>
            )}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
