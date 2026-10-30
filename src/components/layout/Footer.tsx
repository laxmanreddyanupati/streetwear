import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { NewsletterForm } from '@/components/common/NewsletterForm';
import { DemoNotice } from '@/components/common/DemoNotice';

function InstagramIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

const groups = [
  {
    title: 'Shop',
    links: [
      { label: 'All pieces', to: '/shop' },
      { label: 'New arrivals', to: '/collections/new-arrivals' },
      { label: 'Outerwear', to: '/shop?category=outerwear' },
      { label: 'Knitwear', to: '/shop?category=knitwear' },
      { label: 'Collections', to: '/collections' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns', to: '/returns' },
      { label: 'Contact', to: '/contact' },
      { label: 'Track an order', to: '/account/orders' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Account', to: '/account' },
      { label: 'Admin demo', to: '/admin' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-bone-light">
      <div className="border-b border-bone-light/15">
        <div className="container-editorial grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20 lg:py-20">
          <div>
            <p className="label-xs mb-4 text-bone-light/50">Studio notes</p>
            <h2 className="display max-w-xl text-4xl leading-[0.95] sm:text-5xl">
              Closer to the work, not the noise.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-bone-light/60">
              A short note each month: new pieces, process, and the occasional archive find.
              No daily email, no noise.
            </p>
          </div>
          <NewsletterForm source="footer" tone="dark" />
        </div>
      </div>

      <div className="container-editorial grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
        <div>
          <Link
            to="/"
            className="inline-flex items-baseline text-3xl font-semibold tracking-[-0.075em]"
            aria-label="STREETWEAR. home"
          >
            STREETWEAR
            <span className="ml-0.5 text-acid" aria-hidden="true">
              .
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-bone-light/55">
            Independent contemporary clothing. Considered layers, honest materials, and small
            runs made to be worn hard.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              className="flex size-10 items-center justify-center border border-bone-light/25 transition-colors hover:border-acid hover:text-acid"
              aria-label="STREETWEAR. on Instagram (external link)"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer noopener"
              className="flex size-10 items-center justify-center border border-bone-light/25 transition-colors hover:border-acid hover:text-acid"
              aria-label="STREETWEAR. on YouTube (external link)"
            >
              <YoutubeIcon className="size-4" />
            </a>
          </div>
        </div>

        {groups.map((group) => (
          <nav key={group.title} aria-label={`${group.title} links`}>
            <p className="label-xs mb-4 text-bone-light/45">{group.title}</p>
            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1 text-sm text-bone-light/70 transition-colors hover:text-bone-light"
                  >
                    {link.label}
                    <ArrowUpRight
                      className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-bone-light/15">
        <div className="container-editorial py-6">
          <DemoNotice className="mb-6 border-bone-light/20 bg-bone-light/5 text-bone-light/60">
            This is a portfolio demonstration storefront. Orders, accounts and admin tools are
            local-only. No payment is taken and no card details are requested.
          </DemoNotice>
          <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.14em] text-bone-light/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} STREETWEAR. Studio — demo build</p>
            <p className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-acid" aria-hidden="true" />
              Designed in Mumbai · INR pricing
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
