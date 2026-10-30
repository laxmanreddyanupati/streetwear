import { useCollections } from '@/hooks/useCatalog';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageIntro } from '@/components/common/PageIntro';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/common/Reveal';

export function CollectionsPage() {
  usePageMeta({
    title: 'Collections',
    description:
      'Explore the STREETWEAR. collections — The Essentials, Field Notes and Atelier 01. Small-run contemporary clothing in a neutral palette.',
  });
  const { data: collections, isLoading } = useCollections();

  return (
    <>
      <PageIntro
        eyebrow="Four chapters"
        title="Collections"
        description="Each collection starts from a single idea — a fabric, a workwear reference, a colour pulled from the city — and is built into a short, considered run."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Collections' }]}
      />

      <div className="container-editorial space-y-6 py-10 sm:py-14">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[16/10] w-full" />
            ))
          : collections?.map((collection, index) => (
              <Reveal key={collection.id} delay={index * 0.05}>
                <CollectionCard collection={collection} large />
              </Reveal>
            ))}
      </div>
    </>
  );
}
