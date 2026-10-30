import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro } from '@/components/common/PageIntro';
import { usePageMeta } from '@/hooks/usePageMeta';

export function AboutPage() {
  usePageMeta({
    title: 'The Studio & Ethos',
    description: 'Independent contemporary clothing. Considered layers, honest materials, and small batch runs.',
  });

  return (
    <div>
      <PageIntro
        eyebrow="The Studio"
        title="Built for the streets. Shaped by quiet precision."
        description="We craft garments for individuals who value weight, texture, and lasting construction over seasonal velocity."
      />

      <section className="container-editorial py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-bone">
            <img
              src="/images/about-studio.jpg"
              alt="STREETWEAR. studio cutting table and pattern drafts"
              className="size-full object-cover"
            />
            <span className="absolute bottom-4 left-4 bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-bone backdrop-blur-sm">
              Studio Floor 01 / Mumbai
            </span>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <span className="label-xs text-ink-muted">01 / The Origin</span>
            <h2 className="display text-3xl sm:text-4xl">
              Streetwear that speaks before you do.
            </h2>
            <p className="text-base leading-relaxed text-ink-muted">
              STREETWEAR. was founded on a simple dissatisfaction with disposable streetwear culture.
              We believe a boxy tee or a chore jacket should hold its structure after fifty washes,
              fall with intentional drape, and develop character with age.
            </p>
            <p className="text-base leading-relaxed text-ink-muted">
              Every drop is developed in limited runs in Mumbai. We don&apos;t follow the traditional fashion
              calendar; we release when the cut is tested, the cloth is perfected, and the garment feels indispensable.
            </p>
            <div className="pt-4">
              <Button asChild>
                <Link to="/shop">
                  Explore Drop 001
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="border-t border-ink/10 bg-bone py-16 md:py-24">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <span className="label-xs text-ink-muted">Our Principles</span>
            <h2 className="display mt-2 text-3xl sm:text-4xl">
              How we cut, construct, and release.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="border border-ink/15 bg-paper p-8">
              <span className="font-mono text-xs text-ink-muted">01</span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Heavyweight Integrity</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Custom-milled 280 GSM cotton jersey, 14oz ring-spun denim, and structured twill. We choose weights that feel protective and maintain architectural silhouettes.
              </p>
            </div>

            <div className="border border-ink/15 bg-paper p-8">
              <span className="font-mono text-xs text-ink-muted">02</span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Small Batch Discipline</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Zero deadstock overproduction. Each piece is numbered in disciplined batches, preventing excess waste and ensuring every seam receives human inspection.
              </p>
            </div>

            <div className="border border-ink/15 bg-paper p-8">
              <span className="font-mono text-xs text-ink-muted">03</span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Uncompromising Fit</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Dropped shoulders that don&apos;t sag, boxy torsos that stay proportionate, and collars reinforced with high-density ribbing that never bacon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Campaign Banner */}
      <section className="container-editorial py-16 md:py-24">
        <div className="relative aspect-[16/9] max-h-[600px] w-full overflow-hidden bg-ink">
          <img
            src="/images/about-rack.jpg"
            alt="Garment sample rack in the studio"
            className="size-full object-cover opacity-85"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-8 md:p-14">
            <span className="label-xs text-acid">Atelier Notes</span>
            <h3 className="display mt-2 max-w-xl text-2xl text-paper sm:text-4xl">
              &ldquo;Less ordinary. More you.&rdquo;
            </h3>
            <p className="mt-2 max-w-md text-sm text-bone-light/75">
              Every detail from double-needle chain stitching to matte hardware is engineered for living in.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
