import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, UserCheck } from 'lucide-react';
import { adminService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import { formatDate } from '@/utils/format';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminCustomersPage() {
  const { data: customers, isLoading } = useQuery({
    queryKey: queryKeys.adminCustomers,
    queryFn: () => adminService.listCustomers(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <span className="label-xs text-ink-muted">Clientèle</span>
          <h1 className="display text-3xl">Registered Customers</h1>
        </div>
        <p className="font-mono text-xs text-ink-muted">
          {customers ? `${customers.length} registered profiles` : '—'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="border border-ink/15 bg-paper overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink/15 bg-bone/70 uppercase font-mono tracking-wider text-ink-muted">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4">Adapter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-bone/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-ink text-paper flex items-center justify-center font-mono font-medium text-xs">
                        {customer.firstName[0]}
                        {customer.lastName[0]}
                      </div>
                      <span className="font-semibold text-ink text-sm">
                        {customer.firstName} {customer.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink-muted">
                    <div className="flex items-center gap-1.5">
                      <Mail className="size-3.5 text-ink-muted" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink-muted">
                    {customer.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone className="size-3.5 text-ink-muted" />
                        {customer.phone}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink-muted">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-700 font-mono text-[10px] uppercase font-semibold">
                      <UserCheck className="size-3" /> Demo Auth
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
