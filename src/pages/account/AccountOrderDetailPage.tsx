import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Truck } from 'lucide-react';
import { orderService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/common/StatusBadge';
import { OrderTotals } from '@/components/cart/OrderTotals';
import { DemoNotice } from '@/components/common/DemoNotice';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatDateTime } from '@/utils/format';
import { formatMoney } from '@/utils/money';

export function AccountOrderDetailPage() {
  const { orderId = '' } = useParams();
  const { customer } = useAuth();
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => orderService.getForCustomer(orderId, customer!),
    enabled: Boolean(customer),
  });

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order does not exist in the demo records, or it belongs to another account."
        action={
          <Button asChild>
            <Link to="/account/orders">Back to orders</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" /> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <h2 className="font-display text-3xl">{order.number}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Placed {formatDate(order.createdAt)} · {order.email}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
        <p className="font-display text-3xl tabular-nums">{formatMoney(order.totalMinor)}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-label">Items</h3>
          <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex gap-4 py-4">
                <div className="h-24 w-18 shrink-0 overflow-hidden bg-bone-deep">
                  {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.productSlug}`} className="text-sm font-medium hover:underline">
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-[11px] text-ink-muted">{item.variantLabel}</p>
                  <p className="mt-0.5 text-[10px] text-ink-muted">SKU {item.sku}</p>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Qty {item.quantity} × {formatMoney(item.unitPriceMinor)}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{formatMoney(item.lineTotalMinor)}</p>
              </li>
            ))}
          </ul>

          <OrderTotals
            className="mt-6"
            subtotalMinor={order.subtotalMinor}
            discountMinor={order.discountMinor}
            shippingMinor={order.shippingMinor}
            totalMinor={order.totalMinor}
            promoCode={order.promoCode}
            shippingLabel={`${order.shippingMethod.name} · ${order.shippingMethod.estimatedDays}`}
          />

          {order.notes && (
            <div className="mt-6 border border-ink/15 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-label text-ink-muted">Notes</p>
              <p className="mt-2 text-xs leading-6">{order.notes}</p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="border border-ink/15 p-4">
            <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-label">
              <MapPin className="size-3.5" aria-hidden="true" /> Shipping address
            </h3>
            <address className="mt-3 text-xs not-italic leading-6 text-ink-muted">
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
          <div className="border border-ink/15 p-4">
            <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-label">
              <Truck className="size-3.5" aria-hidden="true" /> Delivery
            </h3>
            <p className="mt-3 text-xs font-medium">{order.shippingMethod.name}</p>
            <p className="mt-1 text-[11px] leading-5 text-ink-muted">
              {order.shippingMethod.estimatedDays}
            </p>
            <p className="mt-2 text-[10px] text-ink-muted">
              Last updated {formatDateTime(order.createdAt)}
            </p>
          </div>
        </aside>
      </div>

      <DemoNotice className="mt-8" compact>
        Demo order — no payment was captured and no shipment will be dispatched.
      </DemoNotice>
    </div>
  );
}
