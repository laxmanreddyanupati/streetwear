import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Collection } from '@/types';

export function CollectionCard({
  collection,
  large = false,
}: {
  collection: Collection;
  large?: boolean;
}) {
  return (
    <Link to={`/collections/${collection.slug}`} className="group block">
      <div className={`media-zoom relative bg-bone-deep ${large ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}>
        <img src={collection.imageUrl} alt={collection.name} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-bone-light sm:p-8">
          <p className="label-xs text-acid">{collection.tagline}</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl leading-none sm:text-4xl lg:text-5xl">
              {collection.name}
            </h2>
            <span className="flex size-9 shrink-0 items-center justify-center border border-bone-light/40 transition-colors group-hover:border-acid group-hover:bg-acid group-hover:text-ink">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 max-w-md text-xs leading-6 text-bone-light/70">
            {collection.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
