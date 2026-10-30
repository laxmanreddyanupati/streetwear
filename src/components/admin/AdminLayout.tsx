import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  BarChart3,
  Boxes,
  FolderOpen,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Percent,
  Users,
} from 'lucide-react';
import { DemoNotice } from '@/components/common/DemoNotice';
import { cn } from '@/utils/cn';

const navItems = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package, end: false },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes, end: false },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree, end: false },
  { label: 'Collections', to: '/admin/collections', icon: FolderOpen, end: false },
  { label: 'Orders', to: '/admin/orders', icon: BarChart3, end: false },
  { label: 'Customers', to: '/admin/customers', icon: Users, end: false },
  { label: 'Promotions', to: '/admin/promotions', icon: Percent, end: false },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-bone">
      {/* Top Banner */}
      <div className="border-b border-ink/20 bg-ink px-4 py-2.5 text-bone text-xs font-mono">
        <div className="container-editorial flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-acid animate-pulse" />
            <span className="uppercase tracking-widest text-[11px]">
              STREETWEAR. Atelier Console (Demo Environment)
            </span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-bone-light/70 hover:text-bone text-[11px] uppercase tracking-wider"
          >
            <LogOut className="size-3" />
            Back to Storefront
          </Link>
        </div>
      </div>

      <div className="container-editorial py-8">
        <DemoNotice className="mb-8">
          <strong>Phase 5 Administrative Suite:</strong> Real-time operations here (stock changes, status toggles, product adjustments) update local browser state via the Service Layer. In production, these mutations route through Cloud Functions and Firestore Security Rules.
        </DemoNotice>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Admin Sidebar */}
          <aside>
            <nav className="sticky top-24 space-y-1 border border-ink/15 bg-paper p-3">
              <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                Studio Management
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wide uppercase transition-colors',
                        isActive
                          ? 'bg-ink text-paper font-semibold'
                          : 'text-ink-muted hover:bg-bone hover:text-ink',
                      )
                    }
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          {/* Admin Main View */}
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
