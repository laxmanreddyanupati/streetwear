import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/common/QuantityStepper';
import { EmptyState } from '@/components/common/EmptyState';
import { formatMoney, FREE_SHIPPING_THRESHOLD_MINOR } from '@/utils/money';

export function CartSheet() {
  const { isOpen, closeCart, items, totals, updateQuantity, removeItem, isMutating } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_MINOR - totals.subtotalMinor);
  const progress = Math.min(100, (totals.subtotalMinor / FREE_SHIPPING_THRESHOLD_MINOR) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent side="right" className="w-full max-w-md p-0">
        <SheetHeader className="border-b border-ink/10 bg-bone-light p-5">
          <SheetTitle>Your bag</SheetTitle>
          <SheetDescription>
            {totals.itemCount === 0
              ? 'Nothing here yet.'
              : `${totals.itemCount} ${totals.itemCount === 1 ? 'piece' : 'pieces'} reserved for the demo.`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center p-5">
            <EmptyState
              className="w-full border-0 bg-transparent py-12"
              icon={<ShoppingBag className="size-8" strokeWidth={1.2} aria-hidden="true" />}
              title="Your bag is empty"
              description="Start with the essentials, or browse the latest delivery from the studio."
              action={
                <Button asChild onClick={closeCart}>
                  <Link to="/shop">
                    Shop all pieces <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {totals.subtotalMinor < FREE_SHIPPING_THRESHOLD_MINOR ? (
                <div className="border-b border-ink/10 py-4">
                  <p className="text-[11px] text-ink-muted">
                    <span className="font-semibold text-ink">{formatMoney(remaining)}</span> away
                    from complimentary standard shipping.
                  </p>
                  <div className="mt-2 h-1 w-full bg-ink/10" aria-hidden="true">
                    <div className="h-full bg-ink transition-[width]" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <p className="border-b border-ink/10 py-4 text-[11px] text-[#2d5a29]">
                  Complimentary standard shipping unlocked.
                </p>
              )}

              <ul className="divide-y divide-ink/10" aria-label="Bag items">
                {items.map((item) => (
                  <li key={item.variant.id} className="flex gap-4 py-5">
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="media-zoom block h-28 w-20 shrink-0"
                    >
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.images[0]?.alt ?? item.product.name}
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="block truncate text-sm font-medium hover:underline"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-[11px] text-ink-muted">
                            {item.color.name} / {item.variant.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variant.id)}
                          className="flex size-7 shrink-0 items-center justify-center text-ink-muted transition-colors hover:text-destructive"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                        <QuantityStepper
                          value={item.line.quantity}
                          max={Math.min(item.variant.stock, 10)}
                          disabled={isMutating}
                          onChange={(value) => void updateQuantity(item.variant.id, value)}
                        />
                        <p className="text-sm font-medium tabular-nums">
                          {formatMoney(item.lineTotalMinor)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/10 bg-bone p-5 pb-safe">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="font-medium tabular-nums">{formatMoney(totals.subtotalMinor)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Shipping estimate</dt>
                  <dd className="font-medium tabular-nums">
                    {totals.shippingMinor === 0 ? 'Complimentary' : formatMoney(totals.shippingMinor)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-ink/15 pt-2 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-semibold tabular-nums">{formatMoney(totals.totalMinor)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-[10px] text-ink-muted">
                Taxes included. Shipping is finalised at checkout.
              </p>
              <div className="mt-4 grid gap-2">
                <Button asChild onClick={closeCart} className="w-full">
                  <Link to="/checkout">
                    Continue to checkout <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" onClick={closeCart} className="w-full">
                  <Link to="/cart">View full bag</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
