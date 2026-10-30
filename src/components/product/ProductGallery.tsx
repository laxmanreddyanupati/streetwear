import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = product.images[activeIndex] ?? product.images[0];

  function go(direction: -1 | 1) {
    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0) return product.images.length - 1;
      if (next >= product.images.length) return 0;
      return next;
    });
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="no-scrollbar flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
        {product.images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              'relative aspect-[3/4] w-16 shrink-0 overflow-hidden border transition-colors sm:w-full',
              index === activeIndex ? 'border-ink' : 'border-transparent hover:border-ink/30',
            )}
            aria-label={`View image ${index + 1}: ${image.alt}`}
            aria-pressed={index === activeIndex}
          >
            <img src={image.url} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden bg-bone-deep">
        <div className="media-zoom aspect-[3/4]">
          {active && (
            <img
              key={active.id}
              src={active.url}
              alt={active.alt}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {product.images.length > 1 && (
          <>
            <div className="absolute bottom-4 right-4 flex gap-1.5 sm:hidden">
              <button
                type="button"
                onClick={() => go(-1)}
                className="flex size-10 items-center justify-center bg-bone-light/90 backdrop-blur transition-colors hover:bg-bone-light"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="flex size-10 items-center justify-center bg-bone-light/90 backdrop-blur transition-colors hover:bg-bone-light"
                aria-label="Next image"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="absolute left-4 top-4 bg-bone-light/85 px-2.5 py-1 text-[10px] font-medium tabular-nums backdrop-blur">
              {String(activeIndex + 1).padStart(2, '0')} / {String(product.images.length).padStart(2, '0')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
