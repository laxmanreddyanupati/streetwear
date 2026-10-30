import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchSuggestions } from './SearchSuggestions';

const popular = ['Boxy tee', 'Outerwear', 'Denim', 'Knitwear'];

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();

  function close() {
    onOpenChange(false);
    setQuery('');
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    close();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="top-[8%] max-h-[84vh] translate-y-0 overflow-y-auto p-0 sm:top-[12%] sm:max-w-2xl">
        <div className="p-6 sm:p-8">
          <DialogHeader>
            <p className="label-xs text-ink-muted">Search</p>
            <DialogTitle>Find your next layer</DialogTitle>
            <DialogDescription>
              Search by piece, category, colour or collection. Try “olive”, “hoodie” or “tailored”.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-5" role="search">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                  aria-hidden="true"
                />
                <Input
                  id="site-search"
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search the collection"
                  className="pl-10"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" disabled={!query.trim()}>
                Search
              </Button>
            </div>
          </form>
          {query.trim().length < 2 && (
            <div className="mt-5">
              <p className="label-xs mb-2 text-ink-muted">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popular.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="border border-ink/15 px-3 py-1.5 text-xs transition-colors hover:border-ink hover:bg-bone"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          <SearchSuggestions query={query} onNavigate={close} />
          <button
            type="button"
            onClick={() => {
              if (!query.trim()) return;
              navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
              close();
            }}
            className="label-xs mt-5 inline-flex items-center gap-1 border-b border-ink pb-1 disabled:opacity-40"
            disabled={!query.trim()}
          >
            View all results <ArrowUpRight className="size-3" aria-hidden="true" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
