import type { Category, Collection } from '@/types';
import type { CatalogFacets } from '@/services/contracts/catalog';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/utils/cn';

export const PRICE_RANGES = [
  { id: 'under-1500', label: 'Under ₹1,500', min: undefined, max: 149_999 },
  { id: '1500-2999', label: '₹1,500 – ₹2,999', min: 150_000, max: 299_999 },
  { id: '3000-4999', label: '₹3,000 – ₹4,999', min: 300_000, max: 499_999 },
  { id: '5000-plus', label: '₹5,000 and above', min: 500_000, max: undefined },
] as const;

export interface ShopFilterValues {
  category?: string;
  collection?: string;
  sizes: string[];
  colors: string[];
  price?: string;
  inStock: boolean;
}

export function ProductFilters({
  facets,
  categories,
  collections,
  value,
  onChange,
  onClear,
}: {
  facets?: CatalogFacets;
  categories?: Category[];
  collections?: Collection[];
  value: ShopFilterValues;
  onChange: (patch: Partial<ShopFilterValues>) => void;
  onClear: () => void;
}) {
  const hasFilters = Boolean(
    value.category ||
      value.collection ||
      value.sizes.length ||
      value.colors.length ||
      value.price ||
      value.inStock,
  );

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <p className="label-xs">Filters</p>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-ink-muted transition-colors hover:text-ink"
          >
            <X className="size-3" aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      <fieldset>
        <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
          Category
        </legend>
        <ul className="space-y-1.5">
          <li>
            <FilterRadio
              checked={!value.category}
              label="All categories"
              onClick={() => onChange({ category: undefined })}
            />
          </li>
          {categories?.map((category) => (
            <li key={category.id}>
              <FilterRadio
                checked={value.category === category.slug}
                label={category.name}
                onClick={() => onChange({ category: category.slug })}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="border-t border-ink/10 pt-6">
        <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
          Collection
        </legend>
        <ul className="space-y-1.5">
          <li>
            <FilterRadio
              checked={!value.collection}
              label="All collections"
              onClick={() => onChange({ collection: undefined })}
            />
          </li>
          {collections?.map((collection) => (
            <li key={collection.id}>
              <FilterRadio
                checked={value.collection === collection.slug}
                label={collection.name}
                onClick={() => onChange({ collection: collection.slug })}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="border-t border-ink/10 pt-6">
        <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Size</legend>
        <div className="flex flex-wrap gap-1.5">
          {facets?.sizes.map((size) => {
            const selected = value.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  onChange({
                    sizes: selected
                      ? value.sizes.filter((item) => item !== size)
                      : [...value.sizes, size],
                  })
                }
                className={cn(
                  'min-w-9 border px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors',
                  selected
                    ? 'border-ink bg-ink text-bone-light'
                    : 'border-ink/20 hover:border-ink',
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-t border-ink/10 pt-6">
        <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]">Colour</legend>
        <div className="grid grid-cols-2 gap-1.5">
          {facets?.colors.map((color) => {
            const selected = value.colors.includes(color.slug);
            return (
              <button
                key={color.slug}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  onChange({
                    colors: selected
                      ? value.colors.filter((item) => item !== color.slug)
                      : [...value.colors, color.slug],
                  })
                }
                className={cn(
                  'flex items-center gap-2 border px-2 py-1.5 text-left text-[10px] transition-colors',
                  selected ? 'border-ink bg-bone' : 'border-ink/15 hover:border-ink/40',
                )}
              >
                <span
                  className="relative flex size-3.5 shrink-0 items-center justify-center rounded-full border border-ink/20"
                  style={{ backgroundColor: color.hex }}
                >
                  {selected && (
                    <Check
                      className={cn(
                        'size-2.5',
                        ['white', 'bone', 'sand', 'stone'].includes(color.slug)
                          ? 'text-ink'
                          : 'text-bone-light',
                      )}
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="truncate">{color.name}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-t border-ink/10 pt-6">
        <legend className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]">Price</legend>
        <ul className="space-y-1.5">
          <li>
            <FilterRadio
              checked={!value.price}
              label="Any price"
              onClick={() => onChange({ price: undefined })}
            />
          </li>
          {PRICE_RANGES.map((range) => (
            <li key={range.id}>
              <FilterRadio
                checked={value.price === range.id}
                label={range.label}
                onClick={() => onChange({ price: range.id })}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-ink/10 pt-6">
        <Checkbox
          id="in-stock-only"
          checked={value.inStock}
          onCheckedChange={(checked) => onChange({ inStock: checked === true })}
        />
        <label htmlFor="in-stock-only" className="text-xs leading-5">
          In stock only
        </label>
      </div>

      <Button variant="outline" onClick={onClear} className="w-full" disabled={!hasFilters}>
        Clear all filters
      </Button>
    </div>
  );
}

function FilterRadio({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={cn(
        'flex w-full items-center gap-2 py-0.5 text-left text-xs transition-colors',
        checked ? 'font-medium text-ink' : 'text-ink-muted hover:text-ink',
      )}
    >
      <span
        className={cn(
          'flex size-3 items-center justify-center rounded-full border',
          checked ? 'border-ink' : 'border-ink/30',
        )}
        aria-hidden="true"
      >
        {checked && <span className="size-1.5 rounded-full bg-ink" />}
      </span>
      {label}
    </button>
  );
}
