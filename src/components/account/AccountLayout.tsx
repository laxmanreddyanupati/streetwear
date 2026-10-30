import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Package, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageIntro } from '@/components/common/PageIntro';
import { DemoNotice } from '@/components/common/DemoNotice';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const tabs = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package, end: false },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin, end: false },
];

export function AccountLayout() {
  const { customer, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <PageIntro
        eyebrow="Account — demo"
        title={customer ? `Hello, ${customer.firstName}.` : 'Your account'}
        description="Manage the demonstration profile, addresses and orders stored in this browser. No real account or password is created."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Account' }]}
      />

      <div className="container-editorial grid gap-10 py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 lg:py-14">
        <aside>
          <div className="lg:sticky lg:top-28">
            <div className="border border-ink/15 bg-white p-5">
              <p className="truncate text-sm font-medium">
                {customer?.firstName} {customer?.lastName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-ink-muted">{customer?.email}</p>
            </div>
            <nav aria-label="Account navigation" className="mt-4">
              <ul className="space-y-1">
                {tabs.map((tab) => (
                  <li key={tab.to}>
                    <NavLink
                      to={tab.to}
                      end={tab.end}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2.5 border-l-2 px-3 py-2.5 text-xs transition-colors',
                          isActive
                            ? 'border-ink bg-bone font-semibold text-ink'
                            : 'border-transparent text-ink-muted hover:border-ink/30 hover:text-ink',
                        )
                      }
                    >
                      <tab.icon className="size-4" aria-hidden="true" />
                      {tab.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <Button
              variant="ghost"
              className="mt-4 w-full justify-start gap-2.5 px-3 text-ink-muted"
              onClick={() => {
                signOut();
                navigate('/');
              }}
            >
              <LogOut className="size-4" aria-hidden="true" /> Sign out
            </Button>
            <DemoNotice compact className="mt-5">
              Demo account only. Passwords are never stored; data lives in this browser.
            </DemoNotice>
          </div>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </>
  );
}
