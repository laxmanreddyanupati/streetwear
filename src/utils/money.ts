import { SUPPORTED_CURRENCY, type CurrencyCode } from '@/types';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: SUPPORTED_CURRENCY,
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const inrCompactFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: SUPPORTED_CURRENCY,
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Format integer minor units (paise) as a display price. */
export function formatMoney(amountMinor: number, currency: CurrencyCode = SUPPORTED_CURRENCY) {
  assertCurrency(currency);
  return inrFormatter.format(amountMinor / 100);
}

export function formatMoneyCompact(amountMinor: number, currency: CurrencyCode = SUPPORTED_CURRENCY) {
  assertCurrency(currency);
  return inrCompactFormatter.format(amountMinor / 100);
}

/** Convert a rupee value (as typed by an admin) into integer paise. */
export function rupeesToMinor(rupees: number): number {
  return Math.round(rupees * 100);
}

export function minorToRupees(minor: number): number {
  return minor / 100;
}

export function assertCurrency(currency: CurrencyCode) {
  if (currency !== SUPPORTED_CURRENCY) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
}

export function assertMinorUnits(amount: number, label = 'amount') {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new Error(`${label} must be a non-negative integer in minor units`);
  }
}

export const FREE_SHIPPING_THRESHOLD_MINOR = 199_900;
export const STANDARD_SHIPPING_MINOR = 14_900;
export const EXPRESS_SHIPPING_MINOR = 29_900;
