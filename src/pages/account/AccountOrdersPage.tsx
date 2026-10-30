import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Package } from 'lucide-react';
import { orderService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { DemoNotice } from '@/components/common/DemoNotice';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/format';
import { formatMoney } from '@/utils/money';

export function AccountOrdersPage() {
  const { customer } = useAuth();
  const { data: orders, isLoading } = useQuery({
    queryKey: queryKeys.orders(customer?.id ?? 'anonymous'),
    queryFn: () => orderService.listForCustomer(customer!),
    enabled: Boolean(customer),
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <h2 className="font-display text-3xl">Orders</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Demonstration orders placed in this browser, plus seeded studio records.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          {orders ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}` : '—'}
        </p>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : !orders?.length ? (
          <EmptyState
            icon={<Package className="size-8" strokeWidth={1.2} aria-hidden="true" />}
            title="No orders yet"
            description="Place a demo order from the checkout to see it appear here. No payment is required and nothing is shipped."
            action={
              <Button asChild>
                <Link to="/shop">
                  Start shopping <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="border border-ink/15 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-bone px-4 py-3 sm:px-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em]">
                      {order.number}
                    </p>
                    <p className="text-[10px] text-ink-muted">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.variantId}
                          className="h-14 w-11 overflow-hidden border border-bone-light bg-bone-deep"
                        >
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces ·{' '}
                        {order.items.map((item) => item.productName).slice(0, 2).join(', ')}
                        {order.items.length > 2 && '…'}
                      </p>
                      <p className="mt-1 text-sm font-medium tabular-nums">{formatMoney(order.totalMinor)}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/account/orders/${order.id}`}>
                      View order <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DemoNotice className="mt-8">
        Orders are demonstration records stored locally. Status changes made in the admin demo
        update the same browser data.
      </DemoNotice>
    </div>
  );
}
