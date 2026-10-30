import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProduct, useRelatedProducts } from '@/hooks/useCatalog';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { NotFoundPage } from './NotFoundPage';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related } = useRelatedProducts(product?.id);

  usePageMeta({
    title: product?.name ?? 'Product',
    description: product
      ? `${product.name} — ${product.subtitle}. ${product.description.slice(0, 130)}`
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="container-editorial grid gap-10 py-10 lg:grid-cols-2 lg:py-14">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-2/3" />
        </div>
      </div>
    );
  }

  if (!product) return <NotFoundPage />;

  return (
    <>
      <div className="container-editorial pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: product.categoryName, to: `/shop?category=${product.categorySlug}` },
            { label: product.name },
          ]}
        />
      </div>

      <section className="container-editorial grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-12 xl:gap-20">
        <ProductGallery product={product} />
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductPurchasePanel product={product} />

          <Accordion type="multiple" defaultValue={['details']} className="border-t border-ink/10">
            <AccordionItem value="details">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1.5">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-ink" aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="story">
              <AccordionTrigger>From the studio</AccordionTrigger>
              <AccordionContent>{product.story}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="materials">
              <AccordionTrigger>Materials & care</AccordionTrigger>
              <AccordionContent>
                <p>{product.materials}</p>
                <p className="mt-2">{product.care}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & returns</AccordionTrigger>
              <AccordionContent>
                <p>
                  Complimentary standard shipping on orders over ₹1,999. Express delivery is
                  available at checkout. Returns accepted within 14 days, unworn and with tags.
                </p>
                <p className="mt-2">
                  This is a demo storefront — no physical shipment will be dispatched.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-bone py-14 sm:py-16">
        <div className="container-editorial">
          <SectionHeading
            eyebrow="Pair it with"
            title="Complete the look"
            action={
              <Button asChild variant="outline" size="sm">
                <Link to={`/shop?category=${product.categorySlug}`}>
                  More {product.categoryName} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            }
          />
          <div className="mt-10">
            <ProductGrid products={related ?? []} isLoading={!related} skeletonCount={4} />
          </div>
        </div>
      </section>
    </>
  );
}
