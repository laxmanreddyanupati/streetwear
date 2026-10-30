import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, MapPin, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { addressBookService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { Address } from '@/types';
import { addressSchema, type AddressFormValues } from '@/schemas';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/forms/Fields';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { DemoNotice } from '@/components/common/DemoNotice';

export function AccountAddressesPage() {
  const { customer } = useAuth();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: queryKeys.addresses(customer?.id ?? 'anonymous'),
    queryFn: () => addressBookService.list(customer!.id),
    enabled: Boolean(customer),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Home',
      firstName: customer?.firstName ?? '',
      lastName: customer?.lastName ?? '',
      line1: '',
      line2: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      phone: '',
      isDefault: false,
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: AddressFormValues) =>
      addressBookService.create(customer!.id, {
        label: data.label,
        firstName: data.firstName,
        lastName: data.lastName,
        line1: data.line1,
        line2: data.line2 || undefined,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefault: Boolean(data.isDefault),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses(customer!.id) });
      setIsAdding(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: string) =>
      addressBookService.remove(customer!.id, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses(customer!.id) });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (addressId: string) =>
      addressBookService.setDefault(customer!.id, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses(customer!.id) });
    },
  });

  const onSubmit = (data: AddressFormValues) => {
    addMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <h2 className="font-display text-3xl">Saved Addresses</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Manage your delivery destinations for fast checkout.
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="size-4" />
            Add New Address
          </Button>
        )}
      </div>

      <div className="mt-6">
        <DemoNotice className="mb-6">
          Addresses are stored locally in your browser demo profile and automatically pre-fill at checkout.
        </DemoNotice>

        {isAdding && (
          <div className="mb-8 border border-ink/15 bg-paper p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-6">
              <h3 className="font-semibold text-lg">Add New Address</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <TextField
                  label="Address Label (e.g. Studio, Home) *"
                  error={errors.label?.message}
                  {...register('label')}
                />
                <TextField
                  label="First Name *"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <TextField
                  label="Last Name *"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <TextField
                label="Street Address / Building *"
                placeholder="Flat / Floor, Building, Street"
                error={errors.line1?.message}
                {...register('line1')}
              />

              <TextField
                label="Apartment, suite, unit (optional)"
                error={errors.line2?.message}
                {...register('line2')}
              />

              <div className="grid gap-6 sm:grid-cols-3">
                <TextField
                  label="City *"
                  error={errors.city?.message}
                  {...register('city')}
                />
                <TextField
                  label="State *"
                  error={errors.state?.message}
                  {...register('state')}
                />
                <TextField
                  label="Postal / PIN Code *"
                  error={errors.postalCode?.message}
                  {...register('postalCode')}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  label="Country *"
                  defaultValue="India"
                  {...register('country')}
                />
                <TextField
                  label="Phone Number (for Courier) *"
                  placeholder="+91 98765 43210"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  className="size-4 border-ink/30 accent-ink"
                  {...register('isDefault')}
                />
                <label htmlFor="isDefault" className="text-xs text-ink cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex gap-4 pt-2">
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? 'Saving…' : 'Save Address'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        ) : !addresses?.length ? (
          <EmptyState
            icon={<MapPin className="size-8" strokeWidth={1.2} aria-hidden="true" />}
            title="No saved addresses"
            description="Add a shipping address so you can complete future drops in a single tap."
            action={
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="size-4" /> Add Address
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {addresses.map((addr: Address) => (
              <div
                key={addr.id}
                className="relative flex flex-col justify-between border border-ink/15 bg-paper p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm tracking-wide uppercase">
                      {addr.label || 'Address'}
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 bg-ink text-paper px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider">
                        <Check className="size-3" /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-medium text-ink">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                    {addr.line1}
                    {addr.line2 && <><br />{addr.line2}</>}
                    <br />
                    {addr.city}, {addr.state} {addr.postalCode}
                    <br />
                    {addr.country}
                  </p>
                  <p className="mt-2 text-xs font-mono text-ink-muted">
                    Tel: {addr.phone}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultMutation.mutate(addr.id)}
                      className="text-xs text-ink underline underline-offset-4 hover:text-ink-muted"
                    >
                      Set as default
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMutation.mutate(addr.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
