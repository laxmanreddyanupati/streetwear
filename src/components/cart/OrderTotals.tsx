import type { ReactNode } from 'react';
import { formatMoney } from '@/utils/money';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';

export function OrderTotals({
  subtotalMinor,
  shippingMinor,
  discountMinor = 0,
  totalMinor,
  promoCode,
  shippingLabel,
  className,
  children,
  note,
}: {
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor?: number;
  totalMinor: number;
  promoCode?: string;
  shippingLabel?: string;
  className?: string;
  children?: ReactNode;
  note?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <dl className="space-y-2.5 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(subtotalMinor)}</dd>
        </div>
        {discountMinor > 0 && (
          <div className="flex items-baseline justify-between gap-4 text-[#2d5a29]">
            <dt>Discount{promoCode ? ` — ${promoCode}` : ''}</dt>
            <dd className="tabular-nums">−{formatMoney(discountMinor)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ink-muted">Shipping</dt>
          <dd className="text-right tabular-nums">
            {shippingMinor === 0 ? (
              <span className="text-[#2d5a29]">Complimentary</span>
            ) : (
              formatMoney(shippingMinor)
            )}
            {shippingLabel && (
              <span className="mt-0.5 block text-[10px] text-ink-muted">{shippingLabel}</span>
            )}
          </dd>
        </div>
      </dl>
      <Separator />
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.12em]">Total</p>
        <p className="font-display text-2xl tabular-nums">{formatMoney(totalMinor)}</p>
      </div>
      {note && <p className="text-[10px] leading-4 text-ink-muted">{note}</p>}
      {children}
    </div>
  );
}
