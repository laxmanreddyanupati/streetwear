import { LoaderCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <LoaderCircle className={cn('size-4 animate-spin', className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
