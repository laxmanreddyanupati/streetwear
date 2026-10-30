import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { CartItem } from '@/types';
import { QuantityStepper } from '@/components/common/QuantityStepper';
import { formatMoney } from '@/utils/money';
import { useCart } from '@/context/CartContext';

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem, isMutating } = useCart();

  return (
    <li className="flex gap-4 py-5 sm:gap-6 sm:py-6">
      <Link to={`/product/${item.product.slug}`} className="media-zoom block h-32 w-24 shrink-0 sm:h-40 sm:w-32">
        <img
          src={item.product.images[0]?.url}
          alt={item.product.images[0]?.alt ?? item.product.name}
          loading="lazy"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-medium leading-5 sm:text-base">
              <Link to={`/product/${item.product.slug}`} className="hover:underline">
                {item.product.name}
              </Link>
            </h2>
            <p className="mt-1 text-[11px] text-ink-muted">
              {item.color.name} / {item.variant.size}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-ink-muted">
              SKU {item.variant.sku}
            </p>
            {item.variant.stock <= 3 && (
              <p className="mt-2 text-[10px] text-clay">Only {item.variant.stock} left</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.variant.id)}
            className="flex size-8 shrink-0 items-center justify-center text-ink-muted transition-colors hover:text-destructive"
            aria-label={`Remove ${item.product.name} from bag`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <QuantityStepper
            value={item.line.quantity}
            max={Math.min(item.variant.stock, 10)}
            disabled={isMutating}
            onChange={(value) => void updateQuantity(item.variant.id, value)}
          />
          <div className="text-right">
            <p className="text-sm font-medium tabular-nums">{formatMoney(item.lineTotalMinor)}</p>
            {item.line.quantity > 1 && (
              <p className="text-[10px] text-ink-muted">
                {formatMoney(item.unitPriceMinor)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
