import type { NewsletterSubscription } from '@/types';

export interface NewsletterService {
  subscribe(email: string, source: string): Promise<NewsletterSubscription>;
  list(): Promise<NewsletterSubscription[]>;
}
