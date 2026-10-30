import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, MoveDown, Ruler, Sparkles, Truck } from 'lucide-react';
import { useAllProducts, useCategories, useCollections } from '@/hooks/useCatalog';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Marquee } from '@/components/common/Marquee';
import { Reveal } from '@/components/common/Reveal';
import { NewsletterForm } from '@/components/common/NewsletterForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const values = [
  {
    icon: Sparkles,
    title: 'Small runs',
    copy: 'Made in limited quantities. When a piece is gone, it stays gone — no endless restocks.',
  },
  {
    icon: Ruler,
    title: 'Considered fit',
    copy: 'Patterned in the studio, tested on real bodies. Boxy where it should be, clean everywhere else.',
  },
  {
    icon: Truck,
    title: 'Honest delivery',
    copy: 'Tracked shipping across India. Complimentary standard delivery over ₹1,999.',
  },
];

export function HomePage() {
  usePageMeta({
    title: 'Contemporary essentials',
    description:
      'STREETWEAR. — an independent clothing studio. Small-run essentials, washed outerwear and editorial layers in a neutral palette. INR pricing, demo storefront.',
  });

  const { data: allProducts, isLoading } = useAllProducts();
  const { data: categories } = useCategories();
  const { data: collections } = useCollections();

  const featured = (allProducts ?? [])
    .filter((product) => product.isFeatured)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  const newArrivals = (allProducts ?? [])
    .filter((product) => product.isNew)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 4);

  const featuredCollections = (collections ?? []).filter((collection) => collection.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10">
        <div className="container-editorial grid gap-10 pb-12 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch lg:gap-14 lg:pb-16 lg:pt-14">
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-acid" aria-hidden="true" />
                <p className="label-xs text-ink-muted">SS26 / Field Notes — first delivery</p>
              </div>
              <h1 className="display mt-6 text-[clamp(3.25rem,8.5vw,7.6rem)] leading-[0.82]">
                Layers for the
                <br />
                <span className="italic text-ink-soft">in-between.</span>
              </h1>
              <p className="mt-7 max-w-md text-sm leading-7 text-ink-muted sm:text-base">
                Quiet structure. Washed colour. Everyday shape. A small collection of pieces
                designed to sit between the studio and the street.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/collections/new-arrivals">
                    Shop the new delivery <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">Inside the studio</Link>
                </Button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-ink/10 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-label text-ink-muted">
                  The collection
                </p>
                <p className="mt-1 text-sm">12 considered pieces</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-label text-ink-muted">
                  Made in
                </p>
                <p className="mt-1 text-sm">Small, numbered runs</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-label text-ink-muted">
                  Shipping
                </p>
                <p className="mt-1 text-sm">Free over ₹1,999</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-bone-deep">
              <img
                src="/images/hero-editorial.jpg"
                alt="Model wearing the Field Notes washed overshirt and relaxed denim"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-bone-light sm:p-7">
                <div>
                  <p className="label-xs text-bone-light/70">Campaign 01</p>
                  <p className="mt-1 font-display text-2xl leading-tight sm:text-3xl">Field Notes</p>
                </div>
                <Link
                  to="/collections/field-notes"
                  className="flex size-12 shrink-0 items-center justify-center border border-bone-light/40 transition-colors hover:border-acid hover:bg-acid hover:text-ink"
                  aria-label="Explore the Field Notes collection"
                >
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="absolute -left-3 -top-3 hidden size-16 items-center justify-center bg-acid text-[9px] font-semibold uppercase leading-tight tracking-label text-ink lg:flex">
              New
              <br />
              season
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              Look 04 — Washed Field Overshirt / Relaxed Denim
            </p>
          </div>
        </div>
      </section>

      <Marquee />

      {/* Featured products */}
      <section className="container-editorial py-16 sm:py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="The permanent collection"
            title={
              <>
                Pieces we <span className="italic">return to.</span>
              </>
            }
            description="The essentials — heavyweight jersey, rigid denim and fleece that holds its shape. Designed to be worn hard, washed often and kept for years."
            action={
              <Link to="/shop" className="label-xs inline-flex items-center gap-1.5 border-b border-ink pb-1">
                Shop all pieces <ArrowUpRight className="size-3" aria-hidden="true" />
              </Link>
            }
          />
        </Reveal>
        <Reveal className="mt-10 block lg:mt-12" delay={0.1}>
          <ProductGrid products={featured} isLoading={isLoading} skeletonCount={4} />
        </Reveal>
      </section>

      {/* Categories */}
      <section className="border-y border-ink/10 bg-bone py-16 sm:py-20">
        <div className="container-editorial">
          <Reveal>
            <SectionHeading
              eyebrow="Find your form"
              title="Shop by category"
              action={
                <Link to="/shop" className="label-xs inline-flex items-center gap-1.5 border-b border-ink pb-1">
                  All categories <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              }
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {categories
              ? categories.map((category, index) => (
                  <Reveal key={category.id} delay={index * 0.06}>
                    <Link to={`/shop?category=${category.slug}`} className="group block">
                      <div className="media-zoom relative aspect-[3/4] bg-bone-deep">
                        <img src={category.imageUrl} alt={category.name} loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                        <span className="absolute left-3 top-3 text-[10px] font-semibold tracking-label text-bone-light/70">
                          0{index + 1}
                        </span>
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-bone-light">
                          <h3 className="font-display text-2xl leading-none sm:text-3xl">
                            {category.name}
                          </h3>
                          <ArrowUpRight
                            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <p className="mt-2.5 line-clamp-1 text-[11px] text-ink-muted">
                        {category.description}
                      </p>
                    </Link>
                  </Reveal>
                ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-[3/4] w-full" />
                ))}
          </div>
        </div>
      </section>

      {/* Editorial split */}
      <section className="container-editorial py-16 sm:py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="max-w-xl">
              <p className="label-xs mb-5 text-ink-muted">The studio</p>
              <h2 className="display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
                Utility, <span className="italic">softened</span> for the everyday.
              </h2>
              <p className="mt-6 text-sm leading-7 text-ink-muted">
                We start with pieces that already exist in a wardrobe — the overshirt, the cargo,
                the heavy tee — then rework the weight, the wash and the shape until they feel
                like ours. Nothing louder than it needs to be.
              </p>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                Each collection is drawn, sampled and produced in small runs. The palette comes
                from the city at dusk: ink, bone, washed olive, rinse indigo.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6">
                <div>
                  <p className="font-display text-3xl leading-none">18</p>
                  <p className="mt-1 text-[10px] uppercase tracking-label text-ink-muted">
                    Months in development
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl leading-none">480</p>
                  <p className="mt-1 text-[10px] uppercase tracking-label text-ink-muted">
                    GSM studio fleece
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl leading-none">04</p>
                  <p className="mt-1 text-[10px] uppercase tracking-label text-ink-muted">
                    Categories, done well
                  </p>
                </div>
              </div>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
              >
                Read our approach <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2" delay={0.1}>
            <div className="relative">
              <div className="media-zoom aspect-[4/5] bg-bone-deep">
                <img
                  src="/images/about-studio.jpg"
                  alt="Garments hanging in the STREETWEAR. studio"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden max-w-[220px] bg-bone-light p-5 shadow-xl lg:block">
                <p className="font-display text-lg italic leading-snug">
                  “Made once, worn for years. That is the whole idea.”
                </p>
                <p className="mt-3 text-[9px] uppercase tracking-label text-ink-muted">
                  Studio notes / 01
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Collections */}
      <section className="bg-ink py-16 text-bone-light sm:py-20 lg:py-24">
        <div className="container-editorial">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-xs mb-4 text-bone-light/45">Three chapters</p>
                <h2 className="display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
                  The collections
                </h2>
              </div>
              <Link
                to="/collections"
                className="label-xs inline-flex items-center gap-1.5 self-start border-b border-bone-light/40 pb-1 text-bone-light/75 transition-colors hover:border-acid hover:text-acid sm:self-auto"
              >
                View all <ArrowUpRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-6">
            {featuredCollections.map((collection, index) => (
              <Reveal key={collection.id} delay={index * 0.08}>
                <Link to={`/collections/${collection.slug}`} className="group block">
                  <div className="media-zoom relative aspect-[4/5] bg-ink-soft">
                    <img src={collection.imageUrl} alt={collection.name} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="label-xs text-acid">{collection.tagline}</p>
                      <h3 className="mt-2 font-display text-3xl leading-none">{collection.name}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-bone-light/65">
                        {collection.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-label text-bone-light/80 transition-colors group-hover:text-acid">
                        Explore <ArrowUpRight className="size-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals strip */}
      <section className="container-editorial py-16 sm:py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Just landed"
            title={
              <>
                New <span className="italic">this week.</span>
              </>
            }
            action={
              <Link
                to="/collections/new-arrivals"
                className="label-xs inline-flex items-center gap-1.5 border-b border-ink pb-1"
              >
                All new arrivals <ArrowUpRight className="size-3" aria-hidden="true" />
              </Link>
            }
          />
        </Reveal>
        <Reveal className="mt-10 block" delay={0.08}>
          <ProductGrid products={newArrivals} isLoading={isLoading} skeletonCount={4} />
        </Reveal>
      </section>

      {/* Values */}
      <section className="border-y border-ink/10 bg-bone">
        <div className="container-editorial grid divide-y divide-ink/10 py-4 md:grid-cols-3 md:divide-x md:divide-y-0">
          {values.map((value) => (
            <div key={value.title} className="flex gap-4 py-7 md:px-8 md:first:pl-0 md:last:pr-0">
              <value.icon className="mt-0.5 size-5 shrink-0" strokeWidth={1.4} aria-hidden="true" />
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                  {value.title}
                </h3>
                <p className="mt-1.5 text-xs leading-6 text-ink-muted">{value.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-editorial py-16 sm:py-20 lg:py-24">
        <Reveal>
          <div className="grid gap-10 border border-ink/15 bg-bone-light p-6 sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:p-14">
            <div>
              <p className="label-xs mb-4 text-ink-muted">Studio notes</p>
              <h2 className="display text-4xl leading-[0.95] sm:text-5xl">
                First access to <span className="italic">the next run.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-ink-muted">
                Collection releases, restock notes and occasional studio fragments. One email a
                month — nothing more.
              </p>
            </div>
            <div className="flex items-center">
              <NewsletterForm source="home" />
            </div>
          </div>
        </Reveal>
      </section>

      <div className="container-editorial flex items-center justify-between border-t border-ink/10 py-6 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
        <span>Scroll to explore</span>
        <MoveDown className="size-3.5" aria-hidden="true" />
      </div>
    </>
  );
}
