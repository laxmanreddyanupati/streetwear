import { describe, expect, it } from 'vitest';
import { cartService } from './cart';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 'tee',
  slug: 'boxy-tee',
  name: 'Essential Boxy Tee',
  subtitle: 'Relaxed fit / Cotton',
  description: 'Built for the streets.',
  story: 'Atelier notes',
  categoryId: 'cat-tops',
  categorySlug: 'tops',
  categoryName: 'Tops',
  collectionIds: ['col-essentials'],
  images: [{ id: 'img1', url: '/images/product-tee-white.jpg', alt: 'Boxy Tee' }],
  priceMinor: 99900,
  currency: 'INR',
  colors: [{ name: 'White', slug: 'white', hex: '#FFFFFF' }],
  sizes: ['M', 'L'],
  variants: [
    {
      id: 'var-1',
      productId: 'tee',
      sku: 'SW-TEE-WHT-M',
      size: 'M',
      colorSlug: 'white',
      priceMinor: 99900,
      stock: 5,
    },
    {
      id: 'var-2',
      productId: 'tee',
      sku: 'SW-TEE-WHT-L',
      size: 'L',
      colorSlug: 'white',
      priceMinor: 99900,
      stock: 0,
    },
  ],
  details: ['Heavy cotton'],
  materials: '100% Cotton',
  care: 'Cold wash',
  badge: 'Bestseller',
  isNew: false,
  isBestSeller: true,
  isFeatured: true,
  popularity: 100,
  rating: 4.9,
  reviewCount: 30,
  createdAt: '2026-01-01T00:00:00.000Z',
  status: 'active',
};

describe('cartService', () => {
  it('resolves cart lines against products and calculates totals accurately', () => {
    const lines = [{ variantId: 'var-1', quantity: 2 }];
    const resolved = cartService.resolve(lines, [mockProduct]);

    expect(resolved).toHaveLength(1);
    expect(resolved[0]!.line.quantity).toBe(2);
    expect(resolved[0]!.unitPriceMinor).toBe(99900);
    expect(resolved[0]!.lineTotalMinor).toBe(199800);

    const totals = cartService.calculateTotals(resolved, { shippingMinor: 14900 });
    expect(totals.subtotalMinor).toBe(199800);
    expect(totals.shippingMinor).toBe(14900);
    expect(totals.totalMinor).toBe(214700);
  });

  it('drops variants that are missing or out of stock', () => {
    const lines = [
      { variantId: 'var-2', quantity: 1 }, // out of stock
      { variantId: 'non-existent', quantity: 1 },
    ];
    const resolved = cartService.resolve(lines, [mockProduct]);
    expect(resolved).toHaveLength(0);
  });
});
