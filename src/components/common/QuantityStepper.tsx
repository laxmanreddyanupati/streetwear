import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  label = 'Quantity',
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const clamp = (next: number) => Math.min(Math.max(next, min), max);

  return (
    <div
      className={cn('inline-flex h-11 items-center border border-ink/20 bg-white', className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        className="flex size-10 items-center justify-center transition-colors hover:bg-bone disabled:opacity-35"
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(clamp(next));
        }}
        className="h-full w-10 border-0 bg-transparent p-0 text-center text-sm tabular-nums focus:outline-none focus:ring-0"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        className="flex size-10 items-center justify-center transition-colors hover:bg-bone disabled:opacity-35"
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
