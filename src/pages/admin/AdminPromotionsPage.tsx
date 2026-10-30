import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Plus, Tag } from 'lucide-react';
import { adminService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { Promotion } from '@/types';
import type { AdminPromotionInput } from '@/services/contracts/admin';
import { adminPromotionSchema, type AdminPromotionFormValues } from '@/schemas';
import { formatMoney, minorToRupees, rupeesToMinor } from '@/utils/money';
import { Button } from '@/components/ui/button';
import { TextField, SelectField } from '@/components/forms/Fields';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminPromotionsPage() {
  const queryClient = useQueryClient();
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: promotions, isLoading } = useQuery({
    queryKey: queryKeys.adminPromotions,
    queryFn: () => adminService.listPromotions(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminPromotionFormValues>({
    resolver: zodResolver(adminPromotionSchema) as unknown as Resolver<AdminPromotionFormValues>,
    defaultValues: {
      code: '',
      description: '',
      type: 'percentage',
      value: 10,
      active: true,
      minSubtotalRupees: 1999,
    },
  });

  const upsertMutation = useMutation({
    mutationFn: (data: AdminPromotionFormValues) => {
      const input: AdminPromotionInput = {
        id: editingPromo?.id,
        code: data.code.toUpperCase(),
        description: data.description,
        type: data.type,
        value: data.type === 'fixed' ? rupeesToMinor(data.value) : data.value,
        minSubtotalMinor: data.minSubtotalRupees ? rupeesToMinor(data.minSubtotalRupees) : undefined,
        active: Boolean(data.active),
      };
      return adminService.upsertPromotion(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPromotions });
      setIsCreating(false);
      setEditingPromo(null);
      reset();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ promoId, active }: { promoId: string; active: boolean }) =>
      adminService.togglePromotion(promoId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPromotions });
    },
  });

  const startEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setIsCreating(true);
    reset({
      code: promo.code,
      description: promo.description,
      type: promo.type,
      value: promo.type === 'fixed' ? minorToRupees(promo.value) : promo.value,
      minSubtotalRupees: promo.minSubtotalMinor ? minorToRupees(promo.minSubtotalMinor) : undefined,
      active: promo.active,
    });
  };

  const startNew = () => {
    setEditingPromo(null);
    setIsCreating(true);
    reset({
      code: '',
      description: '',
      type: 'percentage',
      value: 10,
      active: true,
      minSubtotalRupees: 1999,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <span className="label-xs text-ink-muted">Incentives</span>
          <h1 className="display text-3xl">Campaign Promotions</h1>
        </div>
        {!isCreating && (
          <Button onClick={startNew}>
            <Plus className="size-4" /> Add Code
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="border border-ink/20 bg-paper p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-6">
            <h2 className="font-display text-2xl">
              {editingPromo ? `Edit Code: ${editingPromo.code}` : 'New Promotional Campaign'}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit((d) => upsertMutation.mutate(d))} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                label="Promotion Code (e.g. DROP10) *"
                placeholder="FIRSTDROP"
                error={errors.code?.message}
                {...register('code')}
              />
              <TextField
                label="Campaign Description *"
                placeholder="10% off your initial studio order"
                error={errors.description?.message}
                {...register('description')}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <SelectField
                label="Discount Mechanism *"
                options={[
                  { label: 'Percentage (%)', value: 'percentage' },
                  { label: 'Fixed Amount in ₹ (Rupees)', value: 'fixed' },
                  { label: 'Free Shipping Threshold', value: 'free_shipping' },
                ]}
                error={errors.type?.message}
                {...register('type')}
              />
              <TextField
                label="Value (e.g. 10 for 10%, or 500 for ₹500) *"
                type="number"
                error={errors.value?.message}
                {...register('value')}
              />
              <TextField
                label="Minimum Order Subtotal in ₹ (Optional)"
                type="number"
                placeholder="1999"
                error={errors.minSubtotalRupees?.message}
                {...register('minSubtotalRupees')}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                className="size-4 accent-ink"
                {...register('active')}
              />
              <label htmlFor="active" className="text-xs text-ink cursor-pointer font-medium">
                Activate this promotional code immediately
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-ink/10">
              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? 'Saving…' : 'Save Code'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="border border-ink/15 bg-paper overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink/15 bg-bone/70 uppercase font-mono tracking-wider text-ink-muted">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Subtotal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {promotions?.map((promo) => (
                <tr key={promo.id} className="hover:bg-bone/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-ink">
                    <div className="flex items-center gap-2">
                      <Tag className="size-3.5 text-ink-muted" />
                      {promo.code}
                    </div>
                    <span className="block font-sans text-xs font-normal text-ink-muted mt-0.5">
                      {promo.description}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono uppercase text-ink-muted text-[11px]">
                    {promo.type.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-ink">
                    {promo.type === 'percentage'
                      ? `${promo.value}%`
                      : promo.type === 'fixed'
                        ? formatMoney(promo.value, 'INR')
                        : 'Complimentary Delivery'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ink-muted">
                    {promo.minSubtotalMinor ? formatMoney(promo.minSubtotalMinor, 'INR') : 'None'}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() =>
                        toggleMutation.mutate({ promoId: promo.id, active: !promo.active })
                      }
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] uppercase font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
                        promo.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {promo.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(promo)}
                    >
                      <Edit2 className="size-3" />
                      Edit
                    </Button>
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
