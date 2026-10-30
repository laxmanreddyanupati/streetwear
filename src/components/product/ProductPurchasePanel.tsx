import { useMemo, useState } from 'react';
import { Check, LoaderCircle, PackageX } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/common/QuantityStepper';
import { Price } from '@/components/common/Price';
import { formatMoney } from '@/utils/money';
import { cn } from '@/utils/cn';

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem, isMutating } = useCart();
  const [colorSlug, setColorSlug] = useState(product.colors[0]?.slug ?? '');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const variantFor = useMemo(
    () => (candidateSize: string, candidateColor: string) =>
      product.variants.find(
        (variant) => variant.size === candidateSize && variant.colorSlug === candidateColor,
      ),
    [product.variants],
  );

  const sizesWithStock = useMemo(
    () =>
      product.sizes.map((candidateSize) => {
        const variant = variantFor(candidateSize, colorSlug);
        return { size: candidateSize, stock: variant?.stock ?? 0, variantId: variant?.id };
      }),
    [colorSlug, product.sizes, variantFor],
  );

  const [prevColor, setPrevColor] = useState(colorSlug);
  if (prevColor !== colorSlug) {
    setPrevColor(colorSlug);
    const firstAvailable = sizesWithStock.find((entry) => entry.stock > 0)?.size ?? '';
    if (!size || !sizesWithStock.some((entry) => entry.size === size && entry.stock > 0)) {
      setSize(firstAvailable);
    }
  }

  const selectedVariant = size ? variantFor(size, colorSlug) : undefined;
  const selectedColor = product.colors.find((color) => color.slug === colorSlug);
  const maxQuantity = Math.min(selectedVariant?.stock ?? 1, 10);
  const anyStock = product.variants.some((variant) => variant.stock > 0);

  if (quantity > maxQuantity) {
    setQuantity(maxQuantity);
  }

  async function handleAdd() {
    if (!selectedVariant) {
      setFeedback({ type: 'error', message: 'Choose a size to continue.' });
      return;
    }
    setFeedback(null);
    const result = await addItem(selectedVariant.id, quantity);
    if (!result.ok) {
      setFeedback({ type: 'error', message: result.message });
    } else {
      setFeedback({ type: 'success', message: 'Added to your bag.' });
    }
  }

  return (
    <div>
      <div className="border-b border-ink/10 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="label-xs text-ink-muted">{product.categoryName}</p>
          {product.badge && (
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-clay">
              {product.badge}
            </span>
          )}
        </div>
        <h1 className="mt-3 font-display text-4xl font-light leading-[0.95] tracking-editorial sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">{product.subtitle}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Price
            priceMinor={product.priceMinor}
            compareAtPriceMinor={product.compareAtPriceMinor}
            size="lg"
          />
          <span className="text-[11px] text-ink-muted">
            {product.rating.toFixed(1)} / 5 · {product.reviewCount} reviews
          </span>
        </div>
        <p className="mt-5 text-sm leading-7 text-ink-muted">{product.description}</p>
      </div>

      <div className="space-y-6 py-6">
        <fieldset>
          <legend className="field-label">
            Colour — <span className="font-normal normal-case tracking-normal text-ink-muted">{selectedColor?.name}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((color) => {
              const hasStock = product.variants.some(
                (variant) => variant.colorSlug === color.slug && variant.stock > 0,
              );
              return (
                <button
                  key={color.slug}
                  type="button"
                  onClick={() => {
                    setColorSlug(color.slug);
                    setFeedback(null);
                  }}
                  aria-pressed={color.slug === colorSlug}
                  aria-label={`${color.name}${hasStock ? '' : ' — sold out'}`}
                  className={cn(
                    'relative flex size-9 items-center justify-center rounded-full border transition-all',
                    color.slug === colorSlug
                      ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-bone-light'
                      : 'border-ink/20 hover:border-ink/45',
                  )}
                  title={color.name}
                >
                  <span
                    className="size-6 rounded-full border border-ink/15"
                    style={{ backgroundColor: color.hex }}
                  />
                  {!hasStock && (
                    <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,transparent_47%,#171714_48%,#171714_52%,transparent_53%)]" />
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <div className="mb-2 flex items-center justify-between">
            <legend className="field-label mb-0">Size</legend>
            <span className="text-[10px] text-ink-muted">Fits true to size</span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {sizesWithStock.map((entry) => {
              const isSelected = entry.size === size;
              const soldOut = entry.stock <= 0;
              return (
                <button
                  key={entry.size}
                  type="button"
                  onClick={() => {
                    setSize(entry.size);
                    setFeedback(null);
                  }}
                  disabled={soldOut}
                  aria-pressed={isSelected}
                  className={cn(
                    'relative h-11 border text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors',
                    isSelected
                      ? 'border-ink bg-ink text-bone-light'
                      : 'border-ink/20 bg-transparent text-ink hover:border-ink',
                    soldOut && 'cursor-not-allowed border-ink/10 text-ink-muted/50 line-through hover:border-ink/10',
                  )}
                >
                  {entry.size}
                  {entry.stock > 0 && entry.stock <= 2 && (
                    <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-clay" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {soldOut ? ' — sold out' : entry.stock <= 2 ? ` — only ${entry.stock} left` : ''}
                  </span>
                </button>
              );
            })}
          </div>
          {!anyStock && (
            <p className="mt-3 flex items-center gap-2 text-xs text-destructive">
              <PackageX className="size-4" aria-hidden="true" /> This piece is currently sold out.
            </p>
          )}
          {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
            <p className="mt-3 text-xs text-clay">
              Only {selectedVariant.stock} left in {selectedColor?.name} / {size}. Small run, no
              restock.
            </p>
          )}
          {size && !selectedVariant && (
            <p className="mt-3 text-xs text-destructive">
              This colour is sold out in size {size}. Choose another size or colour.
            </p>
          )}
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={maxQuantity}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
            className="sm:w-auto"
          />
          <Button
            type="button"
            onClick={() => void handleAdd()}
            disabled={isMutating || !selectedVariant || selectedVariant.stock <= 0}
            className="h-11 flex-1"
            size="lg"
          >
            {isMutating ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden="true" /> Adding
              </>
            ) : !anyStock ? (
              'Sold out'
            ) : !selectedVariant ? (
              'Choose a size'
            ) : (
              `Add to bag — ${formatMoney(selectedVariant.priceMinor * quantity)}`
            )}
          </Button>
        </div>

        <div aria-live="polite" className="min-h-5">
          {feedback && (
            <p
              className={cn(
                'flex items-center gap-2 text-xs',
                feedback.type === 'success' ? 'text-[#2d5a29]' : 'text-destructive',
              )}
            >
              {feedback.type === 'success' && <Check className="size-3.5" aria-hidden="true" />}
              {feedback.message}
            </p>
          )}
        </div>

        <div className="space-y-2 border-t border-ink/10 pt-5 text-[11px] leading-5 text-ink-muted">
          <p>Complimentary standard shipping over ₹1,999.</p>
          <p>Free returns within 14 days, unworn with tags.</p>
          <p>Demo pricing in INR. No payment is taken.</p>
        </div>
      </div>
    </div>
  );
}
