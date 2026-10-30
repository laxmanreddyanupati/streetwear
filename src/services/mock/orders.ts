import type { Customer, Order, OrderStatus } from '@/types';
import type { OrderService } from '@/services/contracts/orders';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';
import { db, simulateLatency } from './db';

function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== 'object') return false;
  const order = value as Partial<Order>;
  return (
    typeof order.id === 'string' &&
    typeof order.number === 'string' &&
    Array.isArray(order.items) &&
    typeof order.createdAt === 'string' &&
    typeof order.totalMinor === 'number'
  );
}

export function readLocalOrders(): Order[] {
  const stored = readStorage<unknown>(STORAGE_KEYS.demoOrders, []);
  return Array.isArray(stored) ? stored.filter(isOrder) : [];
}

export function appendLocalOrder(order: Order) {
  const orders = readLocalOrders();
  const existingIndex = orders.findIndex((item) => item.id === order.id);
  if (existingIndex >= 0) orders[existingIndex] = order;
  else orders.unshift(order);
  writeStorage(STORAGE_KEYS.demoOrders, orders);
}

function mergedOrders(): Order[] {
  const local = readLocalOrders();
  const byId = new Map<string, Order>();
  db.seedOrders.forEach((order) => byId.set(order.id, order));
  local.forEach((order) => byId.set(order.id, order));
  return [...byId.values()].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export const orderService: OrderService = {
  async listForCustomer(customer: Customer) {
    await simulateLatency(120);
    return mergedOrders().filter(
      (order) =>
        order.customerId === customer.id ||
        order.email.toLowerCase() === customer.email.toLowerCase(),
    );
  },

  async getForCustomer(orderId, customer) {
    await simulateLatency(100);
    const order = mergedOrders().find((item) => item.id === orderId);
    if (!order) return null;
    const ownsOrder =
      order.customerId === customer.id ||
      order.email.toLowerCase() === customer.email.toLowerCase();
    return ownsOrder ? order : null;
  },

  async getById(orderId) {
    await simulateLatency(100);
    return mergedOrders().find((order) => order.id === orderId) ?? null;
  },

  async listAll() {
    await simulateLatency(100);
    return mergedOrders();
  },

  async updateStatus(orderId, status: OrderStatus) {
    await simulateLatency(130);
    const order = mergedOrders().find((item) => item.id === orderId);
    if (!order) throw new Error('Order not found.');
    const updated: Order = { ...order, status };
    appendLocalOrder(updated);
    return updated;
  },
};
