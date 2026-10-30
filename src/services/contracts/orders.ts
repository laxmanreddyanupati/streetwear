import type { Customer, Order, OrderStatus } from '@/types';

export interface OrderService {
  listForCustomer(customer: Customer): Promise<Order[]>;
  getForCustomer(orderId: string, customer: Customer): Promise<Order | null>;
  getById(orderId: string): Promise<Order | null>;
  listAll(): Promise<Order[]>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order>;
}
