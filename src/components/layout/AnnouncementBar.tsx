import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const messages = [
  'Complimentary shipping on orders over ₹1,999',
  'SS26 / Field Notes — first delivery now live',
];

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-bone-light">
      <div className="container-editorial flex h-9 items-center justify-center gap-6 text-[9px] font-medium uppercase tracking-[0.16em] sm:text-[10px]">
        <span>{messages[0]}</span>
        <span className="hidden items-center gap-2 sm:flex">
          <span className="size-1 rounded-full bg-acid" aria-hidden="true" />
          {messages[1]}
        </span>
        <Link
          to="/collections/new-arrivals"
          className="hidden items-center gap-1 text-acid transition-colors hover:text-white lg:flex"
        >
          Explore <ArrowUpRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
