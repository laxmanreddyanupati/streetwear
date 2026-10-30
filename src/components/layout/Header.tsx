import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { AccountMenu } from '@/components/navigation/AccountMenu';
import { MegaMenu } from '@/components/navigation/MegaMenu';
import { MobileNav } from '@/components/navigation/MobileNav';
import { SearchDialog } from '@/components/navigation/SearchDialog';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <>
      <header className="sticky top-0 z-[900] border-b border-ink/10 bg-bone-light/95 backdrop-blur-md">
        <div className="container-editorial flex h-16 items-center justify-between gap-4 lg:h-20">
          <div className="flex items-center gap-1 lg:gap-0">
            <MobileNav onSearch={() => setSearchOpen(true)} />
            <Link
              to="/"
              className="group flex items-baseline px-2 text-[22px] font-semibold tracking-[-0.075em] text-ink sm:text-2xl lg:px-0"
              aria-label="STREETWEAR. home"
            >
              STREETWEAR
              <span className="ml-0.5 text-acid transition-transform duration-300 group-hover:scale-125" aria-hidden="true">
                .
              </span>
            </Link>
          </div>

          <nav
            aria-label="Main navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          >
            <MegaMenu />
            <Link
              to="/collections/new-arrivals"
              className="py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-ink-muted"
            >
              New arrivals
            </Link>
            <Link
              to="/collections"
              className="py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-ink-muted"
            >
              Collections
            </Link>
            <Link
              to="/about"
              className="py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-ink-muted"
            >
              Studio
            </Link>
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex size-10 items-center justify-center transition-colors hover:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              aria-label="Search"
            >
              <Search className="size-[18px]" aria-hidden="true" />
            </button>
            <AccountMenu />
            <button
              type="button"
              onClick={openCart}
              className="relative flex size-10 items-center justify-center transition-colors hover:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag className="size-[18px]" aria-hidden="true" />
              {count > 0 && (
                <span
                  data-testid="cart-count"
                  className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-semibold leading-4 text-bone-light"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
