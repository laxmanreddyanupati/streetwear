import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useCategories, useCollections } from '@/hooks/useCatalog';
import { cn } from '@/utils/cn';

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { data: categories } = useCategories();
  const { data: collections } = useCollections();

  const [prevLoc, setPrevLoc] = useState(location.pathname + location.search);
  if (prevLoc !== location.pathname + location.search) {
    setPrevLoc(location.pathname + location.search);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="shop-mega-menu"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-1.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-ink-muted"
      >
        Shop
        <ChevronDown
          className={cn('size-3 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          id="shop-mega-menu"
          className="absolute left-1/2 top-full z-50 w-[min(920px,calc(100vw-4rem))] -translate-x-1/2 border border-ink/15 bg-bone-light shadow-2xl"
        >
          <div className="grid grid-cols-[1fr_1fr_1.05fr]">
            <div className="border-r border-ink/10 p-7">
              <p className="label-xs mb-5 text-ink-muted">Categories</p>
              <ul className="space-y-3">
                {categories?.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/shop?category=${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline justify-between gap-3"
                    >
                      <span className="font-display text-xl transition-colors group-hover:text-ink-muted">
                        {category.name}
                      </span>
                      <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-r border-ink/10 p-7">
              <p className="label-xs mb-5 text-ink-muted">Collections</p>
              <ul className="space-y-3">
                {collections?.map((collection) => (
                  <li key={collection.id}>
                    <Link
                      to={`/collections/${collection.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex flex-col gap-0.5"
                    >
                      <span className="text-sm font-medium transition-colors group-hover:text-ink-muted">
                        {collection.name}
                      </span>
                      <span className="text-[11px] text-ink-muted">{collection.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="label-xs mt-6 inline-flex items-center gap-1 border-b border-ink pb-1 transition-colors hover:text-ink-muted"
              >
                Shop all <ArrowUpRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
            <Link
              to="/collections/field-notes"
              onClick={() => setOpen(false)}
              className="group relative block min-h-[280px] overflow-hidden bg-bone-deep"
            >
              <img
                src="/images/editorial-motion.jpg"
                alt="Field Notes editorial campaign"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-bone-light">
                <p className="label-xs mb-2 text-bone-light/70">Campaign 01</p>
                <p className="font-display text-3xl leading-none">Field Notes</p>
                <p className="mt-2 text-xs text-bone-light/75">Utility, softened for the everyday.</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
