import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AuthShell({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100dvh-8rem)] lg:grid-cols-[1fr_0.95fr]">
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to the studio
          </Link>
          <p className="label-xs mb-4 text-ink-muted">{eyebrow}</p>
          <h1 className="display text-4xl leading-[0.95] sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-ink-muted">{description}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 border-t border-ink/10 pt-5 text-xs leading-6 text-ink-muted">
            {footer}
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-bone-deep lg:block">
        <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-bone-light">
          <p className="label-xs text-acid">Demo account</p>
          <p className="mt-2 max-w-sm font-display text-3xl italic leading-tight">
            A storefront you can explore without handing over a password.
          </p>
          <p className="mt-3 max-w-sm text-xs leading-6 text-bone-light/65">
            Accounts are local-only. Passwords are required by the form but never stored or sent
            anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
