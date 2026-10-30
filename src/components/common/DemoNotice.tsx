import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function DemoNotice({
  children,
  className,
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 border border-ink/15 bg-bone px-4 py-3 text-xs leading-5 text-ink-muted',
        compact && 'px-3 py-2',
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
