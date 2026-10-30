import { Link, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Check, MapPin, Package, Truck } from 'lucide-react';
import type { Order } from '@/types';
import { orderService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAuth } from '@/context/AuthContext';
import { DemoNotice } from '@/components/common/DemoNotice';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/common/StatusBadge';
import { OrderTotals } from '@/components/cart/OrderTotals';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/format';

export function OrderConfirmationPage() {
  const { orderId = '' } = useParams();
  const location = useLocation();
  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const { status } = useAuth();

  usePageMeta({
    title: 'Order confirmed',
    description: 'Your demo STREETWEAR. order confirmation.',
  });

  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => orderService.getById(orderId),
    initialData: stateOrder?.id === orderId ? stateOrder : undefined,
  });

  if (isLoading) {
    return (
      <div className="container-editorial space-y-4 py-16">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-editorial py-16">
        <EmptyState
          icon={<Package className="size-8" strokeWidth={1.2} aria-hidden="true" />}
          title="Order not found"
          description="This demo order is not stored in this browser. It may have been placed in another browser or cleared from local storage."
          action={
            <Button asChild>
              <Link to="/shop">
                Back to the shop <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-editorial py-10 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-start gap-5 border-b border-ink/15 pb-10 sm:flex-row sm:items-center">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#dcebd9] text-[#2d5a29]">
            <Check className="size-7" strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <p className="label-xs text-ink-muted">Demo order placed</p>
            <h1 className="display mt-2 text-4xl leading-none sm:text-5xl">Thank you.</h1>
            <p className="mt-2 text-sm text-ink-muted">
              Your demonstration order <span className="font-medium text-ink">{order.number}</span>{' '}
              was created on {formatDate(order.createdAt)}.
            </p>
          </div>
        </div>

        <DemoNotice className="mt-8">
          <strong className="font-semibold">No payment was taken.</strong> This order exists only in
          this browser, is marked as a demo payment, and will not be fulfilled. A production build
          would create the order server-side and confirm payment via a verified provider webhook.
        </DemoNotice>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
          {order.promoCode && (
            <span className="border border-ink/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]">
              {order.promoCode} applied
            </span>
          )}
        </div>

        <div className="mt-8 border border-ink/15">
          <div className="border-b border-ink/15 bg-bone px-5 py-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-label">Order summary</h2>
              <span className="text-[10px] text-ink-muted">{order.items.length} line items</span>
            </div>
          </div>
          <ul className="divide-y divide-ink/10 px-5">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex gap-4 py-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden bg-bone-deep">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.productSlug}`} className="block truncate text-sm font-medium hover:underline">
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-[11px] text-ink-muted">{item.variantLabel}</p>
                  <p className="mt-1 text-[10px] text-ink-muted">Qty {item.quantity} · {item.sku}</p>
                </div>
                <p className="text-sm tabular-nums">{item.lineTotalMinor === 0 ? '—' : `₹${(item.lineTotalMinor / 100).toLocaleString('en-IN')}`}</p>
              </li>
            ))}
          </ul>
          <div className="border-t border-ink/10 px-5 py-5">
            <OrderTotals
              subtotalMinor={order.subtotalMinor}
              discountMinor={order.discountMinor}
              shippingMinor={order.shippingMinor}
              totalMinor={order.totalMinor}
              promoCode={order.promoCode}
              shippingLabel={`${order.shippingMethod.name} · ${order.shippingMethod.estimatedDays}`}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="border border-ink/15 p-5">
            <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label">
              <MapPin className="size-4" aria-hidden="true" /> Shipping address
            </h2>
            <address className="mt-3 text-sm not-italic leading-6 text-ink-muted">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </address>
          </div>
          <div className="border border-ink/15 p-5">
            <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label">
              <Truck className="size-4" aria-hidden="true" /> Delivery
            </h2>
            <p className="mt-3 text-sm font-medium">{order.shippingMethod.name}</p>
            <p className="mt-1 text-xs leading-6 text-ink-muted">{order.shippingMethod.description}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-ink-muted">
              Estimated {order.shippingMethod.estimatedDays}
            </p>
            <p className="mt-3 text-xs leading-6 text-ink-muted">
              Demo only — no dispatch or tracking will occur.
            </p>
          </div>
        </div>

        {order.notes && (
          <div className="mt-5 border border-ink/15 p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-label">Notes</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{order.notes}</p>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 border-t border-ink/15 pt-8 sm:flex-row">
          <Button asChild>
            <Link to="/shop">
              Continue shopping <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={status === 'authenticated' ? '/account/orders' : '/account/login'}>
              {status === 'authenticated' ? 'View order history' : 'Sign in to save orders'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
