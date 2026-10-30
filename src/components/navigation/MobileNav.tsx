import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCategories, useCollections } from '@/hooks/useCatalog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function MobileNav({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const { customer, status } = useAuth();
  const { data: categories } = useCategories();
  const { data: collections } = useCollections();

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex size-10 items-center justify-center transition-colors hover:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            {status === 'authenticated' && customer
              ? `Signed in as ${customer.firstName} ${customer.lastName}`
              : 'Independent contemporary clothing studio.'}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-8 p-5">
          <button
            type="button"
            onClick={() => {
              close();
              onSearch();
            }}
            className="flex items-center gap-3 border border-ink/20 px-4 py-3 text-left text-sm text-ink-muted transition-colors hover:border-ink"
          >
            <Search className="size-4" aria-hidden="true" />
            Search the collection
          </button>

          <nav aria-label="Mobile navigation">
            <p className="label-xs mb-3 text-ink-muted">Shop</p>
            <ul className="space-y-1 border-b border-ink/10 pb-5">
              {[
                { to: '/shop', label: 'All pieces' },
                { to: '/collections/new-arrivals', label: 'New arrivals' },
                { to: '/collections', label: 'Collections' },
                { to: '/about', label: 'About the studio' },
                { to: '/account', label: 'My account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={close}
                    className="flex items-center justify-between py-2 font-display text-2xl transition-colors hover:text-ink-muted"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-xs mb-3 text-ink-muted">Categories</p>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/shop?category=${category.slug}`}
                    onClick={close}
                    className="flex items-center justify-between border-b border-ink/10 py-2 text-sm"
                  >
                    {category.name}
                    <ArrowUpRight className="size-3.5 text-ink-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-xs mb-3 text-ink-muted">Collections</p>
            <ul className="space-y-2">
              {collections?.map((collection) => (
                <li key={collection.id}>
                  <Link
                    to={`/collections/${collection.slug}`}
                    onClick={close}
                    className="flex items-baseline justify-between border-b border-ink/10 py-2 text-sm"
                  >
                    {collection.name}
                    <span className="text-[10px] text-ink-muted">{collection.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto border-t border-ink/10 pt-5">
            <ul className="space-y-2 text-xs text-ink-muted">
              <li><Link to="/contact" onClick={close} className="hover:text-ink">Contact</Link></li>
              <li><Link to="/shipping" onClick={close} className="hover:text-ink">Shipping</Link></li>
              <li><Link to="/returns" onClick={close} className="hover:text-ink">Returns</Link></li>
              <li><Link to="/faq" onClick={close} className="hover:text-ink">FAQ</Link></li>
              <li><Link to="/admin" onClick={close} className="hover:text-ink">Admin demo</Link></li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
