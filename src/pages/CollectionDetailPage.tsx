import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useCollection, useProducts } from '@/hooks/useCatalog';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { NotFoundPage } from './NotFoundPage';

export function CollectionDetailPage() {
  const { slug = '' } = useParams();
  const { data: collection, isLoading: collectionLoading } = useCollection(slug);
  const { data, isLoading: productsLoading } = useProducts({ collectionSlug: slug, pageSize: 24 });

  usePageMeta({
    title: collection?.name ?? 'Collection',
    description: collection?.description,
  });

  if (collectionLoading) {
    return (
      <div className="container-editorial py-16">
        <Skeleton className="h-[50vh] w-full" />
      </div>
    );
  }

  if (!collection) return <NotFoundPage />;

  const products = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <>
      <section className="relative border-b border-ink/10">
        <div className="relative min-h-[420px] overflow-hidden bg-ink lg:min-h-[560px]">
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
          <div className="container-editorial relative flex min-h-[420px] flex-col justify-between py-8 text-bone-light lg:min-h-[560px] lg:py-10">
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: 'Collections', to: '/collections' },
                { label: collection.name },
              ]}
              className="text-bone-light/60 [&_a:hover]:text-bone-light"
            />
            <div className="max-w-3xl">
              <p className="label-xs mb-4 text-acid">{collection.tagline}</p>
              <h1 className="display text-6xl leading-[0.85] sm:text-7xl lg:text-8xl">
                {collection.name}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-bone-light/70 sm:text-base">
                {collection.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="text-[10px] uppercase tracking-label text-bone-light/50">
                  {total} {total === 1 ? 'piece' : 'pieces'}
                </span>
                <span className="h-px w-10 bg-bone-light/30" aria-hidden="true" />
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-label text-bone-light/80 transition-colors hover:text-acid"
                >
                  Shop everything <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial py-12 sm:py-16">
        {!productsLoading && products.length === 0 ? (
          <div className="flex flex-col items-center border border-dashed border-ink/20 py-20 text-center">
            <h2 className="display text-3xl">This chapter is between deliveries</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">
              Pieces from this collection will appear here as they land. In the meantime, browse
              the full studio.
            </p>
            <Button asChild className="mt-6">
              <Link to="/shop">
                Shop all pieces <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : (
          <ProductGrid
            products={products}
            isLoading={productsLoading}
            skeletonCount={8}
            columns={4}
          />
        )}
      </section>
    </>
  );
}
