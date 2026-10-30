import type { OrderStatus, PaymentStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

const orderStatusVariant: Record<
  OrderStatus,
  'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
> = {
  pending: 'warning',
  confirmed: 'secondary',
  processing: 'warning',
  shipped: 'outline',
  delivered: 'success',
  cancelled: 'danger',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={orderStatusVariant[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const labels: Record<PaymentStatus, string> = {
    demo_pending: 'Demo — unpaid',
    demo_authorised: 'Demo — authorised',
    refunded: 'Refunded',
  };
  return (
    <Badge variant={status === 'refunded' ? 'warning' : 'outline'}>{labels[status]}</Badge>
  );
}
