import { Link } from 'react-router-dom';
import { LogIn, LogOut, Package, User, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AccountMenu() {
  const { customer, status, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-10 items-center justify-center transition-colors hover:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          aria-label="Account menu"
        >
          <User className="size-[18px]" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {status === 'authenticated' && customer ? (
          <>
            <DropdownMenuLabel>
              <span className="block normal-case tracking-normal text-ink">{customer.firstName} {customer.lastName}</span>
              <span className="mt-0.5 block truncate text-[10px] font-normal normal-case tracking-normal text-ink-muted">{customer.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/account"><User /> My account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account/orders"><Package /> Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account/addresses"><MapPin /> Addresses</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin"><ShieldCheck /> Admin demo</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => signOut()}>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/account/login"><LogIn /> Sign in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account/register"><User /> Create account</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/account/orders"><Package /> Order history</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
