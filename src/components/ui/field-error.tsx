import { cn } from '@/utils/cn';

export function FieldError({
  id,
  message,
  className,
}: {
  id?: string;
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={cn('mt-1.5 text-xs leading-5 text-destructive', className)}>
      {message}
    </p>
  );
}
