import { describe, expect, it } from 'vitest';
import {
  formatMoney,
  formatMoneyCompact,
  rupeesToMinor,
  minorToRupees,
  assertCurrency,
  assertMinorUnits,
  FREE_SHIPPING_THRESHOLD_MINOR,
  STANDARD_SHIPPING_MINOR,
} from './money';

describe('money utilities', () => {
  it('formats minor currency amounts in INR currency correctly', () => {
    // ₹999 in minor units (paise) is 99900
    const formatted = formatMoney(99900, 'INR');
    expect(formatted).toContain('999');
  });

  it('converts rupees to minor units and back accurately', () => {
    expect(rupeesToMinor(1499)).toBe(149900);
    expect(minorToRupees(149900)).toBe(1499);
    expect(rupeesToMinor(0)).toBe(0);
  });

  it('formats compact values cleanly', () => {
    const compact = formatMoneyCompact(250000, 'INR');
    expect(compact).toBeDefined();
  });

  it('validates currency code and minor unit invariants', () => {
    expect(() => assertCurrency('INR')).not.toThrow();
    // @ts-expect-error test invalid currency
    expect(() => assertCurrency('USD')).toThrow(/Unsupported currency/);

    expect(() => assertMinorUnits(100)).not.toThrow();
    expect(() => assertMinorUnits(-50)).toThrow();
    expect(() => assertMinorUnits(12.5)).toThrow();
  });

  it('exports expected shipping thresholds', () => {
    expect(FREE_SHIPPING_THRESHOLD_MINOR).toBe(199900);
    expect(STANDARD_SHIPPING_MINOR).toBe(14900);
  });
});
