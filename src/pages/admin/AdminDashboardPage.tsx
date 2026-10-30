import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Users,
} from 'lucide-react';
import { adminService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import { formatMoney } from '@/utils/money';
import { OrderStatusBadge } from '@/components/common/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: () => adminService.getDashboard(),
  });

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <span className="label-xs text-ink-muted">Studio Metrics</span>
          <h1 className="display text-3xl">Atelier Performance</h1>
        </div>
        <div className="text-xs text-ink-muted">
          Active currency: <strong className="text-ink">INR (₹)</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-ink/15 bg-paper p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="label-xs">Gross Revenue</span>
            <TrendingUp className="size-4" />
          </div>
          <p className="display mt-3 text-2xl font-semibold sm:text-3xl">
            {formatMoney(stats.revenueMinor, 'INR')}
          </p>
          <p className="mt-1 text-xs text-ink-muted">From {stats.orderCount} total orders</p>
        </div>

        <div className="border border-ink/15 bg-paper p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="label-xs">Avg. Order Value</span>
            <BarChart3 className="size-4" />
          </div>
          <p className="display mt-3 text-2xl font-semibold sm:text-3xl">
            {formatMoney(stats.averageOrderValueMinor, 'INR')}
          </p>
          <p className="mt-1 text-xs text-ink-muted">Excluding cancelled orders</p>
        </div>

        <div className="border border-ink/15 bg-paper p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="label-xs">Registered Clients</span>
            <Users className="size-4" />
          </div>
          <p className="display mt-3 text-2xl font-semibold sm:text-3xl">
            {stats.customerCount}
          </p>
          <p className="mt-1 text-xs text-ink-muted">Plus {stats.newsletterCount} newsletter subs</p>
        </div>

        <div className="border border-ink/15 bg-paper p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="label-xs">Low Stock Alert</span>
            <AlertTriangle className="size-4 text-amber-600" />
          </div>
          <p className="display mt-3 text-2xl font-semibold sm:text-3xl">
            {stats.lowStockCount}
          </p>
          <p className="mt-1 text-xs text-ink-muted">Variants below threshold</p>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="border border-ink/15 bg-paper p-6">
        <h2 className="label-xs text-ink-muted mb-4">Pipeline by Fulfillment Status</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <div key={status} className="border border-ink/10 bg-bone/60 p-3 text-center">
              <span className="block text-xs font-mono uppercase text-ink-muted">{status}</span>
              <span className="display mt-1 block text-2xl">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="border border-ink/15 bg-paper p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base">Recent Orders</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/orders">
                View All <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>

          <div className="divide-y divide-ink/10">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-mono font-medium text-ink">{order.number}</span>
                  <p className="text-ink-muted mt-0.5">{order.shippingAddress.firstName} {order.shippingAddress.lastName} · {order.items.length} item(s)</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="font-medium">{formatMoney(order.totalMinor, order.currency)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="border border-ink/15 bg-paper p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base">Low Stock Attention</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/inventory">
                Manage Stock <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>

          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-ink-muted py-6 text-center">All variants are sufficiently stocked.</p>
          ) : (
            <div className="divide-y divide-ink/10">
              {stats.lowStock.map((item) => (
                <div key={item.variantId} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-ink">{item.productName}</span>
                    <p className="text-ink-muted mt-0.5 font-mono">{item.color} / Size {item.size} · SKU: {item.sku}</p>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-semibold">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
