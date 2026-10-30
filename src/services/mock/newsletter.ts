import type { NewsletterSubscription } from '@/types';
import type { NewsletterService } from '@/services/contracts/newsletter';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';
import { newsletterSubscribers } from '@/data/catalog';
import { simulateLatency } from './db';

function load(): NewsletterSubscription[] {
  const stored = readStorage<unknown>(STORAGE_KEYS.newsletter, []);
  const safe = Array.isArray(stored)
    ? stored.filter(
        (item): item is NewsletterSubscription =>
          Boolean(item) &&
          typeof (item as NewsletterSubscription).email === 'string' &&
          typeof (item as NewsletterSubscription).subscribedAt === 'string',
      )
    : [];
  return safe;
}

function all(): NewsletterSubscription[] {
  const merged = new Map<string, NewsletterSubscription>();
  [...newsletterSubscribers, ...load()].forEach((subscriber) => {
    merged.set(subscriber.email.toLowerCase(), subscriber);
  });
  return [...merged.values()].sort((a, b) => Date.parse(b.subscribedAt) - Date.parse(a.subscribedAt));
}

export const newsletterService: NewsletterService = {
  async subscribe(email, source) {
    await simulateLatency(160);
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new Error('Enter a valid email address.');
    }
    const existing = all().find((item) => item.email.toLowerCase() === normalized);
    if (existing) return existing;
    const subscription: NewsletterSubscription = {
      email: normalized,
      subscribedAt: new Date().toISOString(),
      source,
    };
    writeStorage(STORAGE_KEYS.newsletter, [...load(), subscription]);
    return subscription;
  },

  async list() {
    await simulateLatency(60);
    return all();
  },
};
