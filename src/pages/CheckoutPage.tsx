import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowRight, Check, LockKeyhole, ShieldCheck, Tag, Truck } from 'lucide-react';
import { addressBookService, checkoutService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { checkoutSchema, type CheckoutFormValues } from '@/schemas';
import type { PromotionValidation } from '@/types';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageIntro } from '@/components/common/PageIntro';
import { DemoNotice } from '@/components/common/DemoNotice';
import { OrderTotals } from '@/components/cart/OrderTotals';
import { TextAreaField, TextField } from '@/components/forms/Fields';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Spinner';
import { formatMoney, FREE_SHIPPING_THRESHOLD_MINOR } from '@/utils/money';
import { createId } from '@/utils/storage';
import { getErrorMessage } from '@/utils/misc';
import { cn } from '@/utils/cn';

const DEFAULT_VALUES: CheckoutFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phone: '',
  shippingMethodId: 'standard',
  promoCode: '',
  notes: '',
};

export function CheckoutPage() {
  usePageMeta({
    title: 'Checkout',
    description: 'Demo checkout for the STREETWEAR. storefront. No payment is taken.',
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { items, totals, isLoading, clearCart } = useCart();
  const { customer, status } = useAuth();
  const [appliedPromotion, setAppliedPromotion] = useState<PromotionValidation | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const idempotencyKey = useRef(createId('idem'));
  const prefillRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const {
    data: shippingMethods,
    isLoading: shippingLoading,
    isError: shippingError,
  } = useQuery({
    queryKey: queryKeys.shippingMethods,
    queryFn: () => checkoutService.listShippingMethods(),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const { data: addresses } = useQuery({
    queryKey: queryKeys.addresses(customer?.id ?? 'guest'),
    queryFn: () => addressBookService.list(customer!.id),
    enabled: Boolean(customer),
  });

  useEffect(() => {
    if (prefillRef.current) return;
    if (status !== 'authenticated' || !customer || addresses === undefined) return;
    prefillRef.current = true;
    const address = addresses.find((item) => item.isDefault) ?? addresses[0];
    const current = getValues();
    reset({
      ...current,
      email: customer.email,
      firstName: address?.firstName ?? customer.firstName,
      lastName: address?.lastName ?? customer.lastName,
      line1: address?.line1 ?? '',
      line2: address?.line2 ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      postalCode: address?.postalCode ?? '',
      country: address?.country ?? 'India',
      phone: address?.phone ?? customer.phone ?? '',
    });
  }, [addresses, customer, getValues, reset, status]);

  const promoCode = watch('promoCode');
  const shippingMethodId = watch('shippingMethodId');
  const notes = watch('notes');

  useEffect(() => {
    if (!appliedPromotion) return;
    const appliedCode = appliedPromotion.promotion?.code ?? '';
    if ((promoCode ?? '').trim().toUpperCase() !== appliedCode) {
      setAppliedPromotion(null);
      setPromoFeedback(null);
    }
  }, [appliedPromotion, promoCode]);

  const selectedShipping = useMemo(
    () => shippingMethods?.find((method) => method.id === shippingMethodId) ?? shippingMethods?.[0],
    [shippingMethodId, shippingMethods],
  );

  const discountMinor = appliedPromotion?.discountMinor ?? 0;
  const subtotalAfterDiscount = Math.max(0, totals.subtotalMinor - discountMinor);
  const freeShipping =
    appliedPromotion?.promotion?.type === 'free_shipping' ||
    subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD_MINOR;
  const shippingMinor = selectedShipping
    ? selectedShipping.id === 'standard'
      ? freeShipping
        ? 0
        : selectedShipping.priceMinor
      : selectedShipping.priceMinor
    : 0;
  const totalMinor = subtotalAfterDiscount + shippingMinor;

  async function applyPromotion() {
    const code = (getValues('promoCode') ?? '').trim();
    if (!code) {
      setPromoFeedback({ type: 'error', message: 'Enter a promotion code first.' });
      return;
    }
    setIsApplyingPromo(true);
    setPromoFeedback(null);
    try {
      const result = await checkoutService.validatePromotion(code, totals.subtotalMinor);
      if (result.valid) {
        setAppliedPromotion(result);
        setPromoFeedback({ type: 'success', message: result.message });
      } else {
        setAppliedPromotion(null);
        setPromoFeedback({ type: 'error', message: result.message });
      }
    } catch (error) {
      setAppliedPromotion(null);
      setPromoFeedback({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsApplyingPromo(false);
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!selectedShipping) {
      setSubmitError('Choose a delivery method.');
      return;
    }
    setSubmitError(null);
    setIsPlacing(true);
    try {
      const order = await checkoutService.placeOrder(
        {
          customer: customer ?? null,
          email: values.email,
          shippingAddress: {
            firstName: values.firstName,
            lastName: values.lastName,
            line1: values.line1,
            line2: values.line2 || undefined,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country,
            phone: values.phone,
          },
          shippingMethod: selectedShipping,
          promoCode: appliedPromotion?.promotion?.code,
          notes: values.notes || undefined,
          idempotencyKey: idempotencyKey.current,
        },
        items,
      );
      clearCart();
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate(`/checkout/success/${order.id}`, { replace: true, state: { order } });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      setIsPlacing(false);
    }
  });

  if (!isLoading && items.length === 0) {
    return (
      <>
        <PageIntro
          eyebrow="Checkout"
          title="Your bag is empty"
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]}
        />
        <div className="container-editorial py-14">
          <EmptyState
            title="Nothing to check out yet"
            description="Add a piece to your bag before continuing. Your session is preserved in this browser."
            action={
              <Button asChild>
                <Link to="/shop">
                  Shop all pieces <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Checkout — demo"
        title="Checkout"
        description="Complete the demonstration form to create a local order. No payment will be taken and no card details are requested at any point."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bag', to: '/cart' }, { label: 'Checkout' }]}
      />

      <div className="container-editorial py-10 lg:py-14">
        <DemoNotice className="mb-8">
          <strong className="font-semibold">Demo checkout.</strong> Every order is stored in this
          browser and marked <code className="text-[11px]">demo_pending</code>. No payment provider,
          card form or real shipment is involved. In production, order creation and payment
          confirmation would run in trusted server code.
        </DemoNotice>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner className="size-5" label="Loading checkout" />
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 xl:gap-20">
            <div className="space-y-10">
              <section aria-labelledby="checkout-contact">
                <div className="flex items-baseline justify-between gap-4 border-b border-ink/15 pb-3">
                  <h2 id="checkout-contact" className="font-display text-2xl">
                    01 — Contact
                  </h2>
                  {status !== 'authenticated' && (
                    <Link to="/account/login" state={{ from: { pathname: '/checkout' } }} className="text-[10px] uppercase tracking-[0.1em] underline underline-offset-4">
                      Sign in
                    </Link>
                  )}
                </div>
                <div className="pt-5">
                  <TextField
                    type="email"
                    label="Email address"
                    autoComplete="email"
                    placeholder="you@example.com"
                    hint="Used only for this demo order record."
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  {status === 'authenticated' && customer && (
                    <p className="mt-3 flex items-center gap-2 text-[11px] text-ink-muted">
                      <ShieldCheck className="size-3.5" aria-hidden="true" />
                      Checking out as {customer.firstName} {customer.lastName}. Address details can
                      still be edited below.
                    </p>
                  )}
                </div>
              </section>

              <section aria-labelledby="checkout-shipping-address">
                <div className="border-b border-ink/15 pb-3">
                  <h2 id="checkout-shipping-address" className="font-display text-2xl">
                    02 — Shipping address
                  </h2>
                </div>
                <div className="grid gap-4 pt-5 sm:grid-cols-2">
                  <TextField
                    label="First name"
                    autoComplete="given-name"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  <TextField
                    label="Last name"
                    autoComplete="family-name"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                  <TextField
                    label="Address line 1"
                    autoComplete="address-line1"
                    containerClassName="sm:col-span-2"
                    error={errors.line1?.message}
                    {...register('line1')}
                  />
                  <TextField
                    label="Address line 2 (optional)"
                    autoComplete="address-line2"
                    containerClassName="sm:col-span-2"
                    error={errors.line2?.message}
                    {...register('line2')}
                  />
                  <TextField
                    label="City"
                    autoComplete="address-level2"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <TextField
                    label="State / region"
                    autoComplete="address-level1"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                  <TextField
                    label="Postal code"
                    autoComplete="postal-code"
                    error={errors.postalCode?.message}
                    {...register('postalCode')}
                  />
                  <TextField
                    label="Country"
                    autoComplete="country-name"
                    error={errors.country?.message}
                    {...register('country')}
                  />
                  <TextField
                    label="Phone"
                    type="tel"
                    autoComplete="tel"
                    containerClassName="sm:col-span-2"
                    hint="Used only to complete the demo order record."
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>
              </section>

              <section aria-labelledby="checkout-delivery">
                <div className="border-b border-ink/15 pb-3">
                  <h2 id="checkout-delivery" className="font-display text-2xl">
                    03 — Delivery
                  </h2>
                </div>
                <fieldset className="pt-5">
                  <legend className="sr-only">Delivery method</legend>
                  {shippingLoading ? (
                    <div className="flex items-center gap-2 border border-ink/15 p-4 text-xs text-ink-muted">
                      <Spinner className="size-4" /> Loading delivery options…
                    </div>
                  ) : shippingError ? (
                    <p className="flex items-center gap-2 border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive">
                      <AlertCircle className="size-4" aria-hidden="true" /> Delivery options could not
                      be loaded. Refresh to try again.
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {shippingMethods?.map((method) => {
                        const checked = shippingMethodId === method.id;
                        const methodPrice =
                          method.id === 'standard' && freeShipping ? 0 : method.priceMinor;
                        return (
                          <label
                            key={method.id}
                            className={cn(
                              'flex cursor-pointer items-start gap-3 border p-4 transition-colors',
                              checked ? 'border-ink bg-bone' : 'border-ink/20 hover:border-ink/45',
                            )}
                          >
                            <input
                              type="radio"
                              value={method.id}
                              className="mt-1 size-3.5 accent-[#171714]"
                              {...register('shippingMethodId')}
                            />
                            <span className="flex flex-1 items-start justify-between gap-4">
                              <span>
                                <span className="flex items-center gap-2 text-sm font-medium">
                                  <Truck className="size-4" aria-hidden="true" />
                                  {method.name}
                                </span>
                                <span className="mt-1 block text-[11px] leading-5 text-ink-muted">
                                  {method.description}
                                </span>
                                <span className="mt-0.5 block text-[10px] uppercase tracking-[0.08em] text-ink-muted">
                                  {method.estimatedDays}
                                </span>
                              </span>
                              <span className="shrink-0 text-sm font-medium tabular-nums">
                                {methodPrice === 0 ? 'Free' : formatMoney(methodPrice)}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {errors.shippingMethodId && (
                    <p className="mt-2 text-xs text-destructive">{errors.shippingMethodId.message}</p>
                  )}
                </fieldset>
              </section>

              <section aria-labelledby="checkout-promo">
                <div className="border-b border-ink/15 pb-3">
                  <h2 id="checkout-promo" className="font-display text-2xl">
                    04 — Promotion
                  </h2>
                </div>
                <div className="pt-5">
                  <label htmlFor="promo-code" className="field-label">
                    Promotion code
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex-1">
                      <div className="relative">
                        <Tag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
                        <input
                          id="promo-code"
                          autoComplete="off"
                          placeholder="Try WELCOME10 or FIELDNOTES"
                          className={cn(
                            'flex h-12 w-full rounded-sm border border-ink/20 bg-white pl-10 pr-3.5 text-sm uppercase tracking-[0.06em] text-ink transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-muted/70 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink',
                            errors.promoCode && 'border-destructive',
                          )}
                          {...register('promoCode')}
                        />
                      </div>
                      {errors.promoCode && (
                        <p className="mt-1.5 text-xs text-destructive">{errors.promoCode.message}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void applyPromotion()}
                      disabled={isApplyingPromo}
                      className="h-12"
                    >
                      {isApplyingPromo ? 'Checking…' : 'Apply code'}
                    </Button>
                  </div>
                  {promoFeedback && (
                    <p
                      className={cn(
                        'mt-2 flex items-center gap-2 text-xs',
                        promoFeedback.type === 'success' ? 'text-[#2d5a29]' : 'text-destructive',
                      )}
                      aria-live="polite"
                    >
                      {promoFeedback.type === 'success' && <Check className="size-3.5" aria-hidden="true" />}
                      {promoFeedback.message}
                    </p>
                  )}
                  <p className="mt-2 text-[10px] text-ink-muted">
                    Demo codes: WELCOME10 (10% over ₹1,999), FIELDNOTES (free standard shipping).
                  </p>
                </div>
              </section>

              <section aria-labelledby="checkout-notes">
                <div className="border-b border-ink/15 pb-3">
                  <h2 id="checkout-notes" className="font-display text-2xl">
                    05 — Notes
                  </h2>
                </div>
                <div className="pt-5">
                  <TextAreaField
                    label="Order notes (optional)"
                    placeholder="Delivery instructions, gift note, or anything the studio should know."
                    hint={`${(notes ?? '').length}/300 characters`}
                    error={errors.notes?.message}
                    {...register('notes')}
                  />
                </div>
              </section>

              {submitError && (
                <div className="flex items-start gap-3 border border-destructive/30 bg-destructive/5 p-4" role="alert">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                  <p className="text-xs leading-5 text-destructive">{submitError}</p>
                </div>
              )}

              <div className="border-t border-ink/15 pt-6">
                <div className="mb-4 flex items-center gap-2 text-[11px] text-ink-muted">
                  <LockKeyhole className="size-4" aria-hidden="true" />
                  No card fields. No payment. This is a local demonstration order.
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPlacing}>
                  {isPlacing ? (
                    <>
                      <Spinner className="size-4" label="Placing demo order" /> Placing demo order…
                    </>
                  ) : (
                    <>
                      Place demo order — {formatMoney(totalMinor)}
                      <ArrowRight aria-hidden="true" />
                    </>
                  )}
                </Button>
                <p className="mt-3 text-[10px] leading-5 text-ink-muted">
                  By placing this demo order you confirm the information above is fictional and
                  understand that no goods will be shipped.
                </p>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-ink/15 bg-white p-5 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[11px] font-semibold uppercase tracking-label">Your order</h2>
                  <Link to="/cart" className="text-[10px] uppercase tracking-[0.1em] text-ink-muted underline underline-offset-4 hover:text-ink">
                    Edit bag
                  </Link>
                </div>

                <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li key={item.variant.id} className="flex gap-3">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-bone-deep">
                        <img
                          src={item.product.images[0]?.url}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-[9px] font-medium text-bone-light">
                          {item.line.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{item.product.name}</p>
                        <p className="text-[10px] text-ink-muted">
                          {item.color.name} / {item.variant.size}
                        </p>
                      </div>
                      <p className="text-xs tabular-nums">{formatMoney(item.lineTotalMinor)}</p>
                    </li>
                  ))}
                </ul>

                <OrderTotals
                  className="mt-5 border-t border-ink/10 pt-5"
                  subtotalMinor={totals.subtotalMinor}
                  shippingMinor={shippingMinor}
                  discountMinor={discountMinor}
                  totalMinor={totalMinor}
                  promoCode={appliedPromotion?.promotion?.code}
                  shippingLabel={selectedShipping?.estimatedDays}
                  note="Taxes included. Promotion and totals are re-validated when the demo order is placed."
                />
              </div>

              <div className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-ink-muted">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                Demo checkout records are stored in localStorage and can be cleared from your
                browser at any time.
              </div>
            </aside>
          </form>
        )}
      </div>
    </>
  );
}
