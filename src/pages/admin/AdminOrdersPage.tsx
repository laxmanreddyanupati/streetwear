import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { Order, OrderStatus } from '@/types';
import { formatMoney } from '@/utils/money';
import { formatDate } from '@/utils/format';
import { OrderStatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: queryKeys.adminOrders,
    queryFn: () => adminService.listOrders(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      adminService.updateOrderStatus(orderId, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
      if (selectedOrder?.id === updated.id) {
        setSelectedOrder(updated);
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <span className="label-xs text-ink-muted">Fulfillment</span>
          <h1 className="display text-3xl">Orders Pipeline</h1>
        </div>
        <p className="font-mono text-xs text-ink-muted">
          {orders ? `${orders.length} total orders recorded` : '—'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Orders Table */}
        <div className={selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'}>
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="border border-ink/15 bg-paper overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-ink/15 bg-bone/70 uppercase font-mono tracking-wider text-ink-muted">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {orders?.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-bone/40 transition-colors ${
                          isSelected ? 'bg-bone/80' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-ink">
                          {order.number}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-ink">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          </span>
                          <p className="text-[10px] text-ink-muted font-mono">{order.email}</p>
                        </td>
                        <td className="py-3 px-4 font-medium text-ink">
                          {formatMoney(order.totalMinor, order.currency)}
                        </td>
                        <td className="py-3 px-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="py-3 px-4 text-ink-muted font-mono text-[11px]">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Order Detail Pane */}
        {selectedOrder && (
          <div className="lg:col-span-5 border border-ink/20 bg-paper p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <div>
                <span className="label-xs text-ink-muted">Order Details</span>
                <h2 className="font-mono text-lg font-semibold">{selectedOrder.number}</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>

            {/* Status changer */}
            <div className="bg-bone p-4 border border-ink/10">
              <label className="label-xs text-ink-muted block mb-2">Update Fulfillment Status</label>
              <div className="flex flex-wrap gap-2">
                {(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        updateStatusMutation.mutate({ orderId: selectedOrder.id, status })
                      }
                      className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-ink text-paper font-semibold'
                          : 'bg-paper border border-ink/20 text-ink hover:bg-bone'
                      }`}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="label-xs text-ink-muted mb-3">Items ({selectedOrder.items.length})</h3>
              <div className="divide-y divide-ink/10">
                {selectedOrder.items.map((item) => (
                  <div key={item.variantId} className="py-2.5 flex items-center gap-3 text-xs">
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="size-12 object-cover bg-bone"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink truncate">{item.productName}</p>
                      <p className="text-ink-muted font-mono text-[10px]">
                        {item.variantLabel} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-medium">
                      {formatMoney(item.lineTotalMinor, selectedOrder.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="text-xs space-y-2 border-t border-ink/10 pt-4">
              <h3 className="label-xs text-ink-muted">Shipping Destination</h3>
              <p className="font-medium">
                {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
              </p>
              <p className="text-ink-muted">
                {selectedOrder.shippingAddress.line1}
                {selectedOrder.shippingAddress.line2 && <><br />{selectedOrder.shippingAddress.line2}</>}
                <br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                <br />
                {selectedOrder.shippingAddress.country}
              </p>
              <p className="font-mono text-ink-muted">Tel: {selectedOrder.shippingAddress.phone}</p>
              {selectedOrder.notes && (
                <div className="mt-3 p-3 bg-bone border border-ink/10 text-xs">
                  <span className="font-semibold block mb-1">Customer Note:</span>
                  &ldquo;{selectedOrder.notes}&rdquo;
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-ink/10 pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal</span>
                <span>{formatMoney(selectedOrder.subtotalMinor, selectedOrder.currency)}</span>
              </div>
              {selectedOrder.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promotion Discount</span>
                  <span>-{formatMoney(selectedOrder.discountMinor, selectedOrder.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <span>Shipping ({selectedOrder.shippingMethod.name})</span>
                <span>{formatMoney(selectedOrder.shippingMinor, selectedOrder.currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-ink pt-2 border-t border-ink/10">
                <span>Grand Total</span>
                <span>{formatMoney(selectedOrder.totalMinor, selectedOrder.currency)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
