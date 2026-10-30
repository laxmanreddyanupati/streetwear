import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageIntro } from '@/components/common/PageIntro';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { OrderTotals } from '@/components/cart/OrderTotals';
import { EmptyState } from '@/components/common/EmptyState';
import { DemoNotice } from '@/components/common/DemoNotice';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoney, FREE_SHIPPING_THRESHOLD_MINOR } from '@/utils/money';

export function CartPage() {
  usePageMeta({
    title: 'Your bag',
    description: 'Review the pieces in your STREETWEAR. bag before checkout.',
  });
  const { items, totals, isLoading } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_MINOR - totals.subtotalMinor);
  const progress = Math.min(100, (totals.subtotalMinor / FREE_SHIPPING_THRESHOLD_MINOR) * 100);

  return (
    <>
      <PageIntro
        eyebrow="Bag"
        title="Your bag"
        description={
          totals.itemCount
            ? `${totals.itemCount} ${totals.itemCount === 1 ? 'piece' : 'pieces'} ready for checkout. Prices are held in this demo session only.`
            : 'Nothing in the bag yet. The collection is a good place to start.'
        }
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bag' }]}
      />

      <div className="container-editorial py-10 lg:py-14">
        {isLoading ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-72 w-full" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="size-8" strokeWidth={1.2} aria-hidden="true" />}
            title="Your bag is empty"
            description="Browse the current collection and add your first piece. Everything is made in small runs, so sizes move quickly."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button asChild>
                  <Link to="/shop">
                    Shop all pieces <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/collections/new-arrivals">New arrivals</Link>
                </Button>
              </div>
            }
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14 xl:gap-20">
            <div>
              <div className="border-y border-ink/15">
                <ul className="divide-y divide-ink/10" aria-label="Bag items">
                  {items.map((item) => (
                    <CartLineItem key={item.variant.id} item={item} />
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <Link
                  to="/shop"
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] underline underline-offset-4"
                >
                  Continue shopping
                </Link>
                <p className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                  Small runs · No restocks
                </p>
              </div>

              <div className="mt-10 border border-ink/15 bg-bone p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                  {remaining > 0
                    ? `${formatMoney(remaining)} from complimentary shipping`
                    : 'Complimentary standard shipping unlocked'}
                </p>
                <div className="mt-3 h-1 w-full bg-ink/10" aria-hidden="true">
                  <div className="h-full bg-ink transition-[width]" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-ink-muted">
                  Standard delivery is free over ₹1,999. Express delivery is available at checkout.
                </p>
              </div>

              <DemoNotice className="mt-6">
                Bag contents are stored in this browser only. In production, cart state would sync
                to an authenticated account and be re-validated server-side.
              </DemoNotice>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-ink/15 bg-white p-5 sm:p-7">
                <h2 className="text-[11px] font-semibold uppercase tracking-label">Order summary</h2>
                <OrderTotals
                  className="mt-5"
                  subtotalMinor={totals.subtotalMinor}
                  shippingMinor={totals.shippingMinor}
                  discountMinor={totals.discountMinor}
                  totalMinor={totals.totalMinor}
                  note="Taxes included. Promotion codes are applied at checkout."
                >
                  <div className="mt-5 space-y-2">
                    <Button asChild size="lg" className="w-full">
                      <Link to="/checkout">
                        Checkout <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/shop">Keep shopping</Link>
                    </Button>
                  </div>
                </OrderTotals>
              </div>

              <ul className="mt-5 space-y-2 text-[11px] leading-5 text-ink-muted">
                <li>· Secure demo checkout — no card details requested.</li>
                <li>· Free returns within 14 days, unworn.</li>
                <li>· Orders are demonstration records only.</li>
              </ul>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
