import type * as React from 'react';
import { cn } from '@/utils/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('shimmer rounded-sm bg-ink/10', className)} {...props} />;
}

export { Skeleton };
