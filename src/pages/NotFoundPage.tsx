import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta({
    title: 'Page Not Found',
    description: 'The requested piece or editorial story could not be located.',
  });

  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="label-xs mb-3 text-ink-muted">404 — Archival Miss</span>
      <h1 className="display text-4xl sm:text-6xl">
        This piece has moved or no longer exists.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
        The archive reference or route you followed might have been updated with the latest drop.
        Explore the current collection or head back to the studio.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link to="/shop">
            Shop Current Drop
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/">Return to Studio</Link>
        </Button>
      </div>

      <div className="mt-14 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-muted">
        <Compass className="size-4" aria-hidden="true" />
        <span>Need guidance? <Link to="/contact" className="underline underline-offset-4 hover:text-ink">Contact Client Services</Link></span>
      </div>
    </div>
  );
}
