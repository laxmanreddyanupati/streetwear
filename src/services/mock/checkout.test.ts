import { describe, expect, it } from 'vitest';
import { checkoutService } from './checkout';

describe('checkoutService promotion validation', () => {
  it('validates WELCOME10 promo code with 10% discount', async () => {
    // subtotal ₹2,000 (200000 paise) -> 10% discount = 20000 paise (₹200)
    const result = await checkoutService.validatePromotion('WELCOME10', 200000);
    expect(result.valid).toBe(true);
    expect(result.discountMinor).toBe(20000);
  });

  it('rejects invalid or non-existent promotion codes gracefully', async () => {
    const result = await checkoutService.validatePromotion('INVALID_CODE', 200000);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('not recognised');
  });

  it('enforces minimum subtotal on promotions', async () => {
    // WELCOME10 requires minSubtotal ₹1,999 (199900 paise)
    const result = await checkoutService.validatePromotion('WELCOME10', 100000);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('subtotal of at least');
  });
});
