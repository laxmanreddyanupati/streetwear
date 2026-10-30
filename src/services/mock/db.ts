import {
  categories,
  collections,
  demoCustomers,
  newsletterSubscribers,
  products,
  promotions,
  seedOrders,
} from '@/data/catalog';
import type { Category, Collection, Customer, Order, Product, Promotion } from '@/types';

/**
 * In-memory demo database.
 *
 * This is deliberately mutable so admin demo actions work within a session.
 * It is not persistent beyond a refresh (except orders stored by the order
 * service). A future Firebase implementation replaces this module wholesale.
 */
export const db = {
  products: products.map((product) => structuredClone(product)) as Product[],
  categories: categories.map((category) => structuredClone(category)) as Category[],
  collections: collections.map((collection) => structuredClone(collection)) as Collection[],
  customers: demoCustomers.map((customer) => structuredClone(customer)) as Customer[],
  promotions: promotions.map((promotion) => structuredClone(promotion)) as Promotion[],
  newsletter: structuredClone(newsletterSubscribers),
  seedOrders: seedOrders.map((order) => structuredClone(order)) as Order[],
  version: 1,
};

export async function simulateLatency(ms = 180) {
  if (import.meta.env.MODE === 'test') return;
  await new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
